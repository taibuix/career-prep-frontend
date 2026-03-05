#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/career-prep-frontend}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-career-prep-frontend}"
PORT="${PORT:-3000}"

echo "Starting frontend deploy"
echo "APP_DIR=${APP_DIR}"
echo "DEPLOY_BRANCH=${DEPLOY_BRANCH}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "APP_DIR does not exist: ${APP_DIR}" >&2
  exit 1
fi

cd "${APP_DIR}"

if [[ ! -d ".git" ]]; then
  echo "APP_DIR is not a git repository: ${APP_DIR}" >&2
  exit 1
fi

# Free disk before git/index operations on small EC2 volumes.
rm -rf node_modules .next || true
npm cache clean --force || true
df -h .

# Deployment clones should be immutable. Clean local drift before switching branches.
git reset --hard
git clean -fd

git fetch --all --prune
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"
echo "Deploying commit: $(git rev-parse --short HEAD)"

export PORT

npm ci --include=dev
npm run build -- --webpack

export NODE_ENV="production"

pm2 delete "${PM2_APP_NAME}" >/dev/null 2>&1 || true
pm2 start npm --name "${PM2_APP_NAME}" --cwd "${APP_DIR}" -- run start
pm2 show "${PM2_APP_NAME}" | sed -n '1,20p'

pm2 save
echo "Frontend deploy completed successfully"
