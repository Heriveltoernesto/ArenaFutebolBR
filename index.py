from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/jogos')
def jogos():
    competicao = request.args.get('competicao')
    ano = request.args.get('ano')
    # Aqui você pode integrar seu scraper ou banco de dados
    return jsonify([
        {
            "mandante": "Flamengo",
            "visitante": "Palmeiras",
            "placar": "2x1",
            "data": "2025-04-27",
            "hora": "16:00",
            "estadio": "Maracanã",
            "cidade": "Rio de Janeiro",
            "uf": "RJ"
        }
    ])

if __name__ == '__main__':
    app.run()
