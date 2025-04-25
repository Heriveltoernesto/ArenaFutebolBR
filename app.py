from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from db import init_db, salvar_em_db
from scraping.brasileirao import raspagem_brasileirao
from scraping.copa_do_brasil import coletar_jogos_copa_do_brasil
from scraping.libertadores import coletar_jogos_libertadores
from cache import cache_raspagem

app = Flask(__name__)
CORS(app)

@app.route('/api/jogos', methods=['GET'])
def api_jogos():
    campeonato = request.args.get('competicao', 'serie-a').lower()
    ano = int(request.args.get('ano', datetime.now().year))
    salvar = request.args.get('salvar', 'sim').lower() != 'nao'

    if campeonato not in ['serie-a', 'serie-b', 'serie-c', 'serie-d']:
        return jsonify({'erro': 'Competição ainda não implementada.'}), 400

    serie = campeonato.split("-")[1]
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

@app.route('/api/jogos/copa-do-brasil', methods=['GET'])
def api_jogos_copa_do_brasil():
    ano = int(request.args.get('ano', datetime.now().year))
    jogos = coletar_jogos_copa_do_brasil(ano)
    return jsonify(jogos)

@app.route('/api/jogos/libertadores', methods=['GET'])
def api_jogos_libertadores():
    ano = int(request.args.get('ano', datetime.now().year))
    jogos = coletar_jogos_libertadores(ano)
    return jsonify(jogos)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
