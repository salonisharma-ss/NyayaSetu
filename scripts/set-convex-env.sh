#!/usr/bin/env bash
# Push backend secrets from .env.local to your Convex deployment.
#   Usage:
#     bash scripts/set-convex-env.sh          # sets on the DEV deployment
#     bash scripts/set-convex-env.sh --prod   # sets on the PRODUCTION deployment
#
# Reads values from .env.local (gitignored) — nothing secret lives in this script.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"
[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE"; exit 1; }

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

FLAG=""
[ "${1:-}" = "--prod" ] && FLAG="--prod"

setvar() {
  local name="$1" val="${2:-}"
  if [ -n "$val" ]; then
    echo "→ convex env set $name ($FLAG)"
    npx convex env set $FLAG "$name" "$val"
  else
    echo "· skip $name (empty)"
  fi
}

setvar GROQ_API_KEY        "${GROQ_API_KEY:-}"
setvar GROQ_MODEL          "${GROQ_MODEL:-}"
setvar GEMINI_API_KEY      "${GEMINI_API_KEY:-}"
setvar GEMINI_MODEL        "${GEMINI_MODEL:-}"
setvar GEMINI_EMBED_MODEL  "${GEMINI_EMBED_MODEL:-}"
setvar UPDATE_JSON_FEEDS   "${UPDATE_JSON_FEEDS:-}"
setvar UPDATE_RSS_FEEDS    "${UPDATE_RSS_FEEDS:-}"

echo "Done. Verify with:  npx convex env list $FLAG"
