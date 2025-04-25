from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from db import init_db, salvar_em_db
from scraping.brasileirao import raspagem_brasileirao
from scraping.copa_do_brasil import coletar_jogos_copa_do_brasil
from scraping.libertadores import coletar_jogos_libertadores
from cache import cache_raspagem
from sqlalchemy import create_engine
import os  # ✅ agora importado

# Banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///jogos.db")
engine = create_engine(DATABASE_URL)

# App Flask
app = Flask(__name__)
CORS(app)

# Rota para jogos do Brasileirão (Série A até D)
@app.route('/api/jogos', methods=['GET'])
def api_jogos():
    campeonato = request.args.get('competicao', 'serie-a').lower()
    
    try:
        ano = int(request.args.get('ano', 2025))  # 🆕 default temporário para 2025
    except ValueError:
        return jsonify({'erro': 'Ano inválido. Use um número inteiro.'}), 400

    salvar = request.args.get('salvar', 'sim').lower() != 'nao'

    if campeonato not in ['serie-a', 'serie-b', 'serie-c', 'serie-d']:
        return jsonify({'erro': 'Competição ainda não implementada. Válidas: serie-a, serie-b, serie-c, serie-d'}), 400

    serie = campeonato.split("-")[1]

    print(f"🔎 Buscando jogos do {campeonato.upper()} - {ano}...")  # 🆕 log

    jogos = cache_raspagem(serie, ano, raspagem_brasileirao)

    if salvar:
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

# Rota Copa do Brasil
@app.route('/api/jogos/copa-do-brasil', methods=['GET'])
def api_jogos_copa_do_brasil():
    try:
        ano = int(request.args.get('ano', 2025))
    except ValueError:
        return jsonify({'erro': 'Ano inválido. Use um número inteiro.'}), 400

    print(f"🔎 Coletando Copa do Brasil - {ano}...")  # 🆕 log
    jogos = coletar_jogos_copa_do_brasil(ano)
    return jsonify(jogos)

# Rota Libertadores
@app.route('/api/jogos/libertadores', methods=['GET'])
def api_jogos_libertadores():
    try:
        ano = int(request.args.get('ano', 2025))
    except ValueError:
        return jsonify({'erro': 'Ano inválido. Use um número inteiro.'}), 400

    print(f"🔎 Coletando Libertadores - {ano}...")  # 🆕 log
    jogos = coletar_jogos_libertadores(ano)
    return jsonify(jogos)

# Inicialização
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
with open('public/scraping/brasileirao.py', 'rb') as f:
    content = f.read()
    if b'\0' in content:
        print("Arquivo contém byte nulo!")
    else:
        print("Nenhum byte nulo encontrado.")
# Remover byte nulo de um arquivo Python
def remove_null_bytes(file_path):
    with open(file_path, 'rb') as file:
        content = file.read()

    # Verificar e remover os bytes nulos
    content = content.replace(b'\0', b'')  # Remove bytes nulos

    with open(file_path, 'wb') as file:
        file.write(content)

    print(f"Bytes nulos removidos de: {file_path}")

# Caminho do arquivo que está com o erro
remove_null_bytes('public/scraping/brasileirao.py')

from scraping.brasileirao import raspagem_brasileirao