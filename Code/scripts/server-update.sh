#!/bin/bash
set -e

echo "=== 开始一键更新 GenForms.ai 生产服务 ==="

# 1. 确保 SSH 公钥允许本地直接部署
mkdir -p /home/genforms/.ssh /root/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6jyp9l+/D7TT1JwuTXI+p+eGBvVb5Sm1hlEwnBSgrp/hIvEf3nefHWCEw2xWad1buQum0i2CDgmInyvAclXOcfzfeIpyoYF7zmnrkVhkFOV9OXLJsur6EvtyvjIDnLrjTriNdny1AjZW1eMeqvFJ8vzPFfgFAt2ZvWT7SGbt1kci3xfz34rS9tgby1hclxKdIlDojVtZDi8pYL5SLRZRojFaVrG9yoqEDs6sfgEa08291RZXb1J8pTrUDTXXMGqQSI82qZxLtEOHnbvw+4Y4SRXQJ5cTX24g/e6d0fRtrNLpyPEL4TzcU9mPw2RohBVXF4cHR2M4sGDzS6mpb//bx" | tee -a /home/genforms/.ssh/authorized_keys /root/.ssh/authorized_keys >/dev/null
chmod 600 /home/genforms/.ssh/authorized_keys /root/.ssh/authorized_keys
chown -R genforms:genforms /home/genforms/.ssh 2>/dev/null || true

# 2. 确保 2G 虚拟交换内存 (Swap)
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile 2>/dev/null || true
  swapon /swapfile 2>/dev/null || true
fi

# 3. 使用预编译或 pnpm 源码同步产物
BUILD_DIR="/tmp/genforms-build"
if [ -d "$BUILD_DIR/Code/.next/standalone" ]; then
  echo ">>> 使用已构建产物覆盖 /app/aiform-factory..."
  cd "$BUILD_DIR/Code"
  mkdir -p /app/aiform-factory/.next /app/aiform-factory/scripts
  cp -r .next/standalone/* /app/aiform-factory/
  cp -r .next/static /app/aiform-factory/.next/
  cp -r public /app/aiform-factory/
  cp -r scripts/* /app/aiform-factory/scripts/ 2>/dev/null || true
else
  rm -rf "$BUILD_DIR"
  git clone --depth 1 https://github.com/jcc6816-dev/AIAPPFactory.git "$BUILD_DIR"
  cd "$BUILD_DIR/Code"
  export NODE_OPTIONS="--max-old-space-size=2048"
  command -v pnpm >/dev/null 2>&1 || npm install -g pnpm@latest
  pnpm install --no-frozen-lockfile
  pnpm run build
  mkdir -p /app/aiform-factory/.next /app/aiform-factory/scripts
  cp -r .next/standalone/* /app/aiform-factory/
  cp -r .next/static /app/aiform-factory/.next/
  cp -r public /app/aiform-factory/
  cp -r scripts/* /app/aiform-factory/scripts/ 2>/dev/null || true
fi

# 4. 智能拉起/重载 PM2 进程
cd /app/aiform-factory
echo ">>> 启动/重载 PM2 服务进程..."
if [ -f scripts/production-start-guard.js ]; then
  pm2 reload aiform-factory 2>/dev/null || pm2 restart aiform-factory 2>/dev/null || PORT=3000 NODE_ENV=production pm2 start scripts/production-start-guard.js --name aiform-factory --interpreter node --update-env
elif [ -f server.js ]; then
  pm2 reload aiform-factory 2>/dev/null || pm2 restart aiform-factory 2>/dev/null || PORT=3000 NODE_ENV=production pm2 start server.js --name aiform-factory --interpreter node --update-env
fi
pm2 save

echo "=== GenForms.ai 生产服务已成功启动并运行！==="
pm2 status aiform-factory
