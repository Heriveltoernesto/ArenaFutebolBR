import os
import json

def cache_raspagem(serie, ano, raspagem_func):
    caminho = f'cache_{serie}_{ano}.json'

    if os.path.exists(caminho):
        with open(caminho, 'r') as f:
            return json.load(f)

    jogos = raspagem_func(serie, ano)

    with open(caminho, 'w') as f:
        json.dump(jogos, f, default=str)

    return jogos
