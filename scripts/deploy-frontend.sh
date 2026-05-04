#!/usr/bin/env bash
# Build the Vite frontend and sync to an S3 bucket.
# Usage:
#   VITE_API_URL=https://xxx.lambda-url.us-east-1.on.aws \
#     scripts/deploy-frontend.sh <bucket-name> [cloudfront-distribution-id]
#
# If a distribution id is given, also invalidates the cache so changes
# show up immediately.
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: VITE_API_URL=<lambda-fn-url> $0 <s3-bucket> [cf-dist-id]" >&2
  exit 1
fi
if [ -z "${VITE_API_URL:-}" ]; then
  echo "ERROR: set VITE_API_URL to your Lambda Function URL first." >&2
  exit 1
fi

BUCKET="$1"
DIST_ID="${2:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT/frontend"
echo "VITE_API_URL=$VITE_API_URL" > .env.production
bun run build

aws s3 sync dist/ "s3://$BUCKET/" --delete

if [ -n "$DIST_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" >/dev/null
  echo "Invalidated CloudFront $DIST_ID"
fi

echo "Deployed to s3://$BUCKET/"
