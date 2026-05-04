#!/usr/bin/env bash
# Bundle the FastAPI app + Linux x86_64 wheels into backend/lambda.zip,
# ready to upload to a Python 3.12 Lambda function.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$ROOT/build/lambda"
ZIP="$ROOT/backend/lambda.zip"

rm -rf "$BUILD" "$ZIP"
mkdir -p "$BUILD"

# Source files at the zip root (Lambda handler resolves from there).
cp "$ROOT/backend/main.py"           "$BUILD/"
cp "$ROOT/backend/game.py"           "$BUILD/"
cp "$ROOT/backend/words.py"          "$BUILD/"
cp "$ROOT/backend/lambda_handler.py" "$BUILD/"

# Install Linux x86_64 wheels (we're cross-compiling from macOS).
python3 -m pip install \
  --target "$BUILD" \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.12 \
  --only-binary=:all: \
  --upgrade \
  -r "$ROOT/backend/requirements-lambda.txt" >/dev/null

# Trim noise to keep the zip small.
find "$BUILD" -type d -name "__pycache__" -exec rm -rf {} +
find "$BUILD" -type f -name "*.pyc" -delete
find "$BUILD" -type d -name "*.dist-info" -exec rm -rf {} +

(cd "$BUILD" && zip -qr "$ZIP" .)
echo "Built: $ZIP ($(du -h "$ZIP" | cut -f1))"
