#!/bin/bash
set -e

echo "=== 开始同步最新产物并重启 PM2 服务 ==="

# 1. 确保已编译好的产物同步到 /app/aiform-factory
mkdir -p /app/aiform-factory/.next /app/aiform-factory/scripts
if [ -d "/tmp/genforms-build/Code/.next/standalone" ]; then
  echo ">>> 同步 /tmp/genforms-build 编译产物..."
  cp -r /tmp/genforms-build/Code/.next/standalone/* /app/aiform-factory/
  cp -r /tmp/genforms-build/Code/.next/static /app/aiform-factory/.next/
  cp -r /tmp/genforms-build/Code/public /app/aiform-factory/
  cp -r /tmp/genforms-build/Code/scripts/* /app/aiform-factory/scripts/ 2>/dev/null || true
fi

# 2. 重启 PM2 生产服务
cd /app/aiform-factory
echo ">>> 重启 PM2 服务..."
pm2 restart aiform-factory --update-env 2>/dev/null || PORT=3000 NODE_ENV=production pm2 start server.js --name aiform-factory --interpreter node --update-env
pm2 save

echo "=== GenForms.ai 生产服务已成功更新并生效！==="
pm2 status aiform-factory
