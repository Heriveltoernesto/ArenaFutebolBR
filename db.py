import os
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, UniqueConstraint

# Pega o banco da env, com fallback pro SQLite local
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///jogos.db")

engine = create_engine(DATABASE_URL)
metadata = MetaData()

jogos_table = Table(
    "jogos", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("ano", Integer),
    Column("serie", String),
    Column("num_jogo", Integer),
    Column("num_rodada", Integer),
    Column("num_turno", Integer),
    Column("estadio", String),
    Column("cidade", String),
    Column("uf", String),
    Column("data", String),
    Column("dia_semana", String),
    Column("hora", String),
    Column("mandante", String),
    Column("uf_mandante", String),
    Column("gol_mandante", Integer),
    Column("gol_visitante", Integer),
    Column("visitante", String),
    Column("uf_visitante", String),
    Column("gols_jogo", Integer),
    Column("resultado", String),
    Column("resultado_mandante", String),
    Column("resultado_visitante", String),
    Column("placar", String),
    Column("link", String),
    Column("dt_ini_cst", String),
    Column("dt_fim_cst", String),
    UniqueConstraint("ano", "serie", "num_jogo", name="uix_ano_serie_jogo")
)

def init_db():
    metadata.create_all(engine)

def salvar_em_db(jogos):
    from sqlalchemy.exc import IntegrityError
    conn = engine.connect()
    trans = conn.begin()
    try:
        for jogo in jogos:
            ins = jogos_table.insert().prefix_with("OR IGNORE" if "sqlite" in DATABASE_URL else "").values(
                ano=jogo[0], serie=jogo[1], num_jogo=jogo[2], num_rodada=jogo[3], num_turno=jogo[4],
                estadio=jogo[5], cidade=jogo[6], uf=jogo[7], data=jogo[8], dia_semana=jogo[9],
                hora=jogo[10], mandante=jogo[11], uf_mandante=jogo[12], gol_mandante=jogo[13],
                gol_visitante=jogo[14], visitante=jogo[15], uf_visitante=jogo[16], gols_jogo=jogo[17],
                resultado=jogo[18], resultado_mandante=jogo[19], resultado_visitante=jogo[20],
                placar=jogo[21], link=jogo[22], dt_ini_cst=jogo[23], dt_fim_cst=jogo[24]
            )
            try:
                conn.execute(ins)
            except IntegrityError:
                pass  # já existe
        trans.commit()
    except Exception as e:
        trans.rollback()
        print("Erro ao salvar no banco:", e)
    finally:
        conn.close()
