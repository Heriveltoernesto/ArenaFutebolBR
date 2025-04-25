import logging
import requests
from bs4 import BeautifulSoup
from datetime import date as dt
from scraping.utlils import remove_acentos, retMes

def coletar_jogos_copa_do_brasil(ano):
    logging.info(f"[INÍCIO] Coletando jogos da Copa do Brasil - {ano}")
    jogos = []
    base_url = f"https://www.cbf.com.br/futebol-brasileiro/competicoes/copa-brasil/{ano}"

    try:
        r = requests.get(base_url, timeout=5)
        if r.status_code != 200:
            logging.warning(f"[AVISO] Não foi possível acessar a página da Copa do Brasil ({ano})")
            return jogos

        soup = BeautifulSoup(r.content, "html.parser")
        partidas = soup.select(".aside-content .lista-de-jogos li")

        for partida in partidas:
            try:
                data_info = partida.select_one(".partida-desc .data").get_text().strip()
                dia_semana, data_str = data_info.split(",")
                dia, mes, ano_data = data_str.strip().split(" de ")
                data = dt(int(ano_data), int(retMes(mes)), int(dia)).isoformat()

                hora = partida.select_one(".partida-desc .hora").get_text().strip()
                times = partida.select(".partida-desc h3")
                placar_info = partida.select(".partida-desc span")

                m_time = remove_acentos(times[0].get_text().strip())
                v_time = remove_acentos(times[1].get_text().strip())

                if len(placar_info) == 2:
                    gol_m = int(placar_info[0].get_text().strip())
                    gol_v = int(placar_info[1].get_text().strip())
                    total = gol_m + gol_v

                    if gol_m > gol_v:
                        resultado = "Mandante"
                    elif gol_m < gol_v:
                        resultado = "Visitante"
                    else:
                        resultado = "Empate"
                    placar = f"{gol_m}-{gol_v}"
                else:
                    gol_m = gol_v = total = 0
                    resultado = "WO"
                    placar = "W-O"

                jogo = {
                    "data": data,
                    "dia_semana": remove_acentos(dia_semana),
                    "hora": hora,
                    "mandante": m_time,
                    "visitante": v_time,
                    "gols_mandante": gol_m,
                    "gols_visitante": gol_v,
                    "total_gols": total,
                    "resultado": resultado,
                    "placar": placar,
                    "ano": ano,
                    "campeonato": "copa-do-brasil"
                }
                jogos.append(jogo)
            except Exception as e:
                logging.error(f"[ERRO] Ao processar uma partida da Copa do Brasil: {e}")
                continue

    except Exception as e:
        logging.critical(f"[FALHA GERAL] Erro ao acessar página da Copa do Brasil: {e}")

    logging.info(f"[FIM] Total de jogos coletados da Copa do Brasil: {len(jogos)}")
    return jogos
