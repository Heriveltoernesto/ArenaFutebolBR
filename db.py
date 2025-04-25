import sqlite3

DB_NAME = "jogos.db"

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
            dt_fim_cst TEXT,
            UNIQUE(ano, serie, num_jogo)
        )
        ''')

def salvar_em_db(jogos):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT OR IGNORE INTO jogos (
                ano, serie, num_jogo, num_rodada, num_turno, estadio, cidade, uf,
                data, dia_semana, hora, mandante, uf_mandante, gol_mandante,
                gol_visitante, visitante, uf_visitante, gols_jogo, resultado,
                resultado_mandante, resultado_visitante, placar, link, dt_ini_cst, dt_fim_cst
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, jogos)
        conn.commit()
