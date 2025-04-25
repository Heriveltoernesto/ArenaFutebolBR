import logging
import requests
from bs4 import BeautifulSoup
from datetime import date as dt
from scraping.utlils import remove_acentos, retMes

def coletar_jogos_libertadores(ano):
    logging.info(f"[INÍCIO] Coletando jogos da Libertadores - {ano}")
    jogos = []
    base_url = f"https://ge.globo.com/futebol/libertadores/tabela/{ano}/"

    try:
        r = requests.get(base_url, timeout=5)
        if r.status_code != 200:
            logging.warning(f"[AVISO] Não foi possível acessar a tabela da Libertadores ({ano})")
            return jogos

        soup = BeautifulSoup(r.content, "html.parser")
        partidas = soup.select("div.placar-wrapper")

        for partida in partidas:
            try:
                data_attr = partida.get("data-event-date")
                if not data_attr:
                    continue
                data = dt.fromisoformat(data_attr.split("T")[0]).isoformat()

                m_time = remove_acentos(partida.select_one(".equipes .mandante .nome").get_text())
                v_time = remove_acentos(partida.select_one(".equipes .visitante .nome").get_text())

                gols_m = int(partida.select_one(".placar-mandante").get_text())
                gols_v = int(partida.select_one(".placar-visitante").get_text())
                total = gols_m + gols_v

                if gols_m > gols_v:
                    resultado = "Mandante"
                elif gols_m < gols_v:
                    resultado = "Visitante"
                else:
                    resultado = "Empate"

                placar = f"{gols_m}-{gols_v}"

                jogo = {
                    "data": data,
                    "hora": data_attr.split("T")[1][:5],
                    "mandante": m_time,
                    "visitante": v_time,
                    "gols_mandante": gols_m,
                    "gols_visitante": gols_v,
                    "total_gols": total,
                    "resultado": resultado,
                    "placar": placar,
                    "ano": ano,
                    "campeonato": "libertadores"
                }
                jogos.append(jogo)

            except Exception as e:
                logging.error(f"[ERRO] Ao processar uma partida da Libertadores: {e}")
                continue

    except Exception as e:
        logging.critical(f"[FALHA GERAL] Erro ao acessar página da Libertadores: {e}")

    logging.info(f"[FIM] Total de jogos coletados da Libertadores: {len(jogos)}")
    return jogos
