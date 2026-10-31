#!/usr/bin/env bash
# Homework readiness check for macOS and Linux.
# From the course repo:
#   bash scripts/readiness-check.sh
# Repo shape only:
#   bash scripts/readiness-check.sh --course-files

set -euo pipefail
cd "$(dirname "$0")/.."

extra=()
for arg in "$@"; do
  case "$arg" in
    --course-files|--skip-claude|--skip-opencode|--skip-openrouter|--skip-workshop)
      extra+=("$arg")
      ;;
    *)
      echo "unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

exec node scripts/verify-setup.mjs "${extra[@]}"
