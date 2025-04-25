from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date as dt
from bs4 import BeautifulSoup
from unicodedata import normalize as nm
import sqlite3, requests, os


from scraping.brasileirao import raspagem_brasileirao
from scraping.copa_do_brasil import coletar_jogos_copa_do_brasil
from scraping.libertadores import coletar_jogos_libertadores

app = Flask(__name__)
CORS(app)

DB_NAME = "jogos.db"

# ========== INIT DB ==========
def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS jogos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            serie TEXT,
            num_jogo INTEGER,
            num_rodada INTEGER,
            num_turno INTEGER,
            estadio TEXT,
            cidade TEXT,
            uf TEXT,
            data TEXT,
            dia_semana TEXT,
            hora TEXT,
            mandante TEXT,
            uf_mandante TEXT,
            gol_mandante INTEGER,
            gol_visitante INTEGER,
            visitante TEXT,
            uf_visitante TEXT,
            gols_jogo INTEGER,
            resultado TEXT,
            resultado_mandante TEXT,
            resultado_visitante TEXT,
            placar TEXT,
            link TEXT,
            dt_ini_cst TEXT,
            dt_fim_cst TEXT
        )
        ''')

# ========== UTILS ==========
def remove_acentos(txt):
    return nm('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')

def retMes(mes):
    meses = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04', 'Maio': '05',
        'Junho': '06', 'Julho': '07', 'Agosto': '08', 'Setembro': '09',
        'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    }
    return meses.get(mes, '01')

# ========== RASPAGEM ==========
def raspagem_brasileirao(serie, ano):
    jogos = []
    for nj in range(1, 381):  # Até 380 jogos
        url = f'https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-{serie}/{ano}/{nj}'
        r = requests.get(url)
        if r.status_code != 200: continue
        soup = BeautifulSoup(r.content, 'html.parser')

        try:
            numJogoTag = soup.select_one('.left > strong')
            localJogo = soup.select('.left > p')
            dataJogoTag = soup.select('.right > p')
            captTimes = soup.select('.partida-desc > h3')
            captGols = soup.select('.partida-desc > span')

            if not all([numJogoTag, localJogo, dataJogoTag, captTimes]): continue

            num_jogo = int(numJogoTag.get_text().strip().replace('Jogo: ', '').split()[0])
            rodada = num_jogo // 10 if num_jogo % 10 == 0 else num_jogo // 10 + 1
            turno = 1 if num_jogo <= 190 else 2

            estadio = remove_acentos(localJogo[0].get_text().split(" - ")[0].strip())
            cidade = remove_acentos(localJogo[0].get_text().split(" - ")[1].strip())
            uf = localJogo[0].get_text().split(" - ")[2].strip()

            diasemana = remove_acentos(dataJogoTag[1].get_text().split(",")[0].strip())
            data_raw = dataJogoTag[1].get_text().split(",")[1].strip()
            dia, mes, ano_data = data_raw.split(" de ")
            data = dt(int(ano_data), int(retMes(mes)), int(dia)).isoformat()
            hora = dataJogoTag[2].get_text().strip()

            m_time, m_uf = captTimes[0].get_text().split("-")
            v_time, v_uf = captTimes[1].get_text().split("-")
            mandante = remove_acentos(m_time.strip())
            visitante = remove_acentos(v_time.strip())
            ufMandante = m_uf.strip()
            ufVisitante = v_uf.strip()

            if len(captGols) == 2:
                gol_mandante = int(captGols[0].get_text().strip())
                gol_visitante = int(captGols[1].get_text().strip())
                total_gols = gol_mandante + gol_visitante
                if gol_mandante > gol_visitante:
                    resultado, res_m, res_v = 'Mandante', 'Vitoria', 'Derrota'
                elif gol_mandante < gol_visitante:
                    resultado, res_m, res_v = 'Visitante', 'Derrota', 'Vitoria'
                else:
                    resultado = res_m = res_v = 'Empate'
                placar = f"{gol_mandante}-{gol_visitante}"
            else:
                gol_mandante = gol_visitante = total_gols = 0
                resultado = res_m = res_v = 'WO'
                placar = 'W-O'

            link = url
            dt_ini_cst = dt_fim_cst = data

            jogo = (ano, f"serie-{serie}", num_jogo, rodada, turno, estadio, cidade, uf,
                    data, diasemana, hora, mandante, ufMandante, gol_mandante,
                    gol_visitante, visitante, ufVisitante, total_gols, resultado,
                    res_m, res_v, placar, link, dt_ini_cst, dt_fim_cst)
            jogos.append(jogo)
        except Exception as e:
            print(f"[ERRO] Série {serie} - Jogo {nj}: {e}")
            continue
    return jogos

# ========== SALVA DB ==========
def salvar_em_db(jogos):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT INTO jogos (
                ano, serie, num_jogo, num_rodada, num_turno, estadio, cidade, uf,
                data, dia_semana, hora, mandante, uf_mandante, gol_mandante,
                gol_visitante, visitante, uf_visitante, gols_jogo, resultado,
                resultado_mandante, resultado_visitante, placar, link, dt_ini_cst, dt_fim_cst
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, jogos)
        conn.commit()

# ========== API ==========
@app.route('/api/jogos', methods=['GET'])
def api_jogos():
    campeonato = request.args.get('competicao', 'serie-a').lower()
    ano = int(request.args.get('ano', datetime.now().year))

    if campeonato not in ['serie-a', 'serie-b', 'serie-c', 'serie-d']:
        return jsonify({'erro': 'Competição ainda não implementada.'}), 400

    serie = campeonato.split("-")[1]
    jogos = raspagem_brasileirao(serie, ano)
    salvar_em_db(jogos)

    return jsonify([{
        'num_jogo': j[2], 'rodada': j[3], 'turno': j[4], 'data': j[8],
        'hora': j[10], 'dia_semana': j[9], 'estadio': j[5], 'cidade': j[6],
        'uf': j[7], 'mandante': j[11], 'visitante': j[15],
        'gols_mandante': j[13], 'gols_visitante': j[14], 'total_gols': j[17],
        'resultado': j[18], 'resultado_mandante': j[19],
        'resultado_visitante': j[20], 'placar': j[21],
        'campeonato': j[1], 'ano': j[0]
    } for j in jogos])
@app.route('/api/jogos/copa-do-brasil', methods=['GET'])
def api_jogos_copa_do_brasil():

    ano = int(request.args.get('ano', datetime.now().year))
    jogos = coletar_jogos_copa_do_brasil(ano)
    return jsonify(jogos)

@app.route('/api/jogos/libertadores', methods=['GET'])
def api_jogos_libertadores():
    ano = int(request.args.get('ano', datetime.now().year))
    jogos = coletar_jogos_libertadores(2025)
    return jsonify(jogos)

# ========== EXECUTA ==========
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
