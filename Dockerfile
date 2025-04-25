# Imagem base mais estável e com menos CVEs
FROM python:3.11-slim

# Evita criação de arquivos .pyc e mantém logs no console
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Atualiza o pip e instala dependências do projeto
COPY requirements.txt .
RUN apt-get update && \
    apt-get install -y gcc libpq-dev build-essential && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia o restante dos arquivos
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


# Comando padrão
CMD ["python", "app.py"]

RUN apt-get update && apt-get upgrade -y && apt-get clean
