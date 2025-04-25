#!/usr/bin/env bash
# Espera o serviço de banco estar disponível

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  >&2 echo "Postgres não está disponível ainda - esperando..."
  sleep 2
done

>&2 echo "Postgres está pronto - executando comando"
exec $cmd
chmod +x wait-for-it.sh
