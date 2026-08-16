#!/bin/bash
set -e

echo "=== 1. 同步全量最新产物到 /app/aiform-factory ==="
mkdir -p /app/aiform-factory/.next/static /app/aiform-factory/public /app/aiform-factory/scripts

if [ -d "/tmp/genforms-build/Code/.next/standalone" ]; then
  cp -r /tmp/genforms-build/Code/.next/standalone/* /app/aiform-factory/
  cp -r /tmp/genforms-build/Code/.next/static/* /app/aiform-factory/.next/static/
  cp -r /tmp/genforms-build/Code/public/* /app/aiform-factory/public/
  cp -r /tmp/genforms-build/Code/scripts/* /app/aiform-factory/scripts/ 2>/dev/null || true
fi

echo "=== 2. 彻底硬重启 PM2 进程，释放所有旧版本内存缓存 ==="
cd /app/aiform-factory
pm2 delete aiform-factory 2>/dev/null || true
PORT=3000 NODE_ENV=production pm2 start server.js --name aiform-factory --interpreter node --update-env
pm2 save

echo "=== GenForms.ai 生产服务已全新拉起并生效！==="
pm2 status aiform-factory
