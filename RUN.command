#!/bin/zsh
set -e

PORT=4173
HOST=127.0.0.1

existing_pids=$(lsof -tiTCP:${PORT} -sTCP:LISTEN || true)
if [[ -n "${existing_pids}" ]]; then
  echo "Stopping existing server on ${HOST}:${PORT}..."
  kill ${=existing_pids}

  for _ in {1..20}; do
    if ! lsof -tiTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done
fi

cd /Users/main/Dropbox/Coding/Github/ugc_portfolio/docs
python3 -m http.server ${PORT} --bind ${HOST}
