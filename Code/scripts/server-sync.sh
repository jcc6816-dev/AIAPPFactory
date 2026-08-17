#!/bin/bash
set -e

echo "=== 1. 拉取最新 main 源码并执行极速增量构建 ==="
BUILD_DIR="/tmp/genforms-build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"
curl -sL https://github.com/jcc6816-dev/AIAPPFactory/archive/refs/heads/main.tar.gz | tar -xz --strip-components=1

cd "$BUILD_DIR/Code"
rm -rf .next
export NODE_OPTIONS="--max-old-space-size=2048"
pnpm run build

echo "=== 2. 同步编译产物到 /app/aiform-factory ==="
mkdir -p /app/aiform-factory/.next/static /app/aiform-factory/public /app/aiform-factory/scripts
cp -r .next/standalone/* /app/aiform-factory/
cp -r .next/static/* /app/aiform-factory/.next/static/
cp -r public/* /app/aiform-factory/public/
cp -r scripts/* /app/aiform-factory/scripts/ 2>/dev/null || true

echo "=== 3. 重启 PM2 生产服务 ==="
cd /app/aiform-factory
pm2 delete aiform-factory 2>/dev/null || true
PORT=3000 NODE_ENV=production pm2 start server.js --name aiform-factory --interpreter node --update-env
pm2 save

echo "=== GenForms.ai 生产服务已成功更新并生效！==="
pm2 status aiform-factory
