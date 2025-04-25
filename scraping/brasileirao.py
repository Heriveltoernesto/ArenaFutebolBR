import logging
import requests
from bs4 import BeautifulSoup
from datetime import date as dt
from scraping.utlils import remove_acentos, retMes

def raspagem_brasileirao(serie, ano):
    logging.info(f"[INÍCIO] Raspando jogos da Série {serie.upper()} do ano {ano}...")
    jogos = []

    for nj in range(1, 381):  # Máximo 380 jogos
        url = f'https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-{serie}/{ano}/{nj}'
        try:
            r = requests.get(url, timeout=5)
            if r.status_code != 200:
                continue

            soup = BeautifulSoup(r.content, 'html.parser')

            numJogoTag = soup.select_one('.left > strong')
            localJogo = soup.select('.left > p')
            dataJogoTag = soup.select('.right > p')
            captTimes = soup.select('.partida-desc > h3')
            captGols = soup.select('.partida-desc > span')

            if not all([numJogoTag, localJogo, dataJogoTag, captTimes]):
                continue

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

            jogo = (
                ano, f"serie-{serie}", num_jogo, rodada, turno, estadio, cidade, uf,
                data, diasemana, hora, mandante, ufMandante, gol_mandante,
                gol_visitante, visitante, ufVisitante, total_gols, resultado,
                res_m, res_v, placar, url, data, data
            )
            jogos.append(jogo)

        except Exception as e:
            logging.error(f"[ERRO] Série {serie} - Jogo {nj}: {e}")
            continue

    logging.info(f"[FIM] Total de jogos raspados: {len(jogos)}")
    return jogos
