from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulação de base de dados
jogos_fake = {
    "serie-a": [
        {"time_casa": "Flamengo", "time_fora": "Palmeiras", "data": "2024-05-01"},
        {"time_casa": "Corinthians", "time_fora": "Grêmio", "data": "2024-05-02"}
    ],
    "serie-b": [
        {"time_casa": "Vasco", "time_fora": "Cruzeiro", "data": "2024-05-03"}
    ]
}

@app.route('/api/jogos', methods=['GET'])
def get_jogos():
    competicao = request.args.get('competicao')
    ano = request
