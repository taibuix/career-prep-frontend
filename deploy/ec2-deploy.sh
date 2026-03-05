#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/career-prep-frontend}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
NODE_ENV="${NODE_ENV:-production}"
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

git fetch --all --prune
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"

export NODE_ENV
export PORT

npm ci
npm run build -- --webpack

if pm2 describe "${PM2_APP_NAME}" >/dev/null 2>&1; then
  pm2 restart "${PM2_APP_NAME}" --update-env
else
  pm2 start npm --name "${PM2_APP_NAME}" -- run start
fi

pm2 save
echo "Frontend deploy completed successfully"
