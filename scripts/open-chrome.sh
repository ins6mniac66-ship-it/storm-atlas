#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8083}"
HOST="${HOST:-localhost}"
URL="http://${HOST}:${PORT}"
LOG_FILE="${ROOT_DIR}/.expo-web-${PORT}.log"

cd "${ROOT_DIR}"

if lsof -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Server already listening on ${URL}"
else
  echo "Starting Expo web server on ${URL}"
  nohup npm run web -- --host "${HOST}" --port "${PORT}" >"${LOG_FILE}" 2>&1 &
  SERVER_PID="$!"

  for _ in $(seq 1 45); do
    if lsof -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
      break
    fi

    if ! kill -0 "${SERVER_PID}" >/dev/null 2>&1; then
      echo "Expo server exited before opening ${URL}."
      echo "Log: ${LOG_FILE}"
      exit 1
    fi

    sleep 1
  done

  if ! lsof -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Timed out waiting for Expo server on ${URL}."
    echo "Log: ${LOG_FILE}"
    exit 1
  fi
fi

echo "Opening ${URL} in Google Chrome"
open -a "Google Chrome" "${URL}"
echo "Ready: ${URL}"

