#!/usr/bin/env bash
set -euo pipefail

echo "=== Building and deploying ==="

docker compose down
docker compose build --no-cache
docker compose up -d

echo "=== Deploy complete on port 3007 ==="
