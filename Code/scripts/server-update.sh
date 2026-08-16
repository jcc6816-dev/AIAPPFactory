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

# 3. 优先通过预编译独立 Standalone Release 安装（秒级完成，0 内存压力）
RELEASE_URL="https://github.com/jcc6816-dev/AIAPPFactory/releases/download/v1.2-release/genforms-fef0f119775b-linux.tar.gz"
echo ">>> 正在下载最新预构建生产包..."
if curl -fsSL "$RELEASE_URL" -o /tmp/release.tar.gz 2>/dev/null && [ -s /tmp/release.tar.gz ]; then
  echo ">>> 解压生产包到 /app/aiform-factory..."
  mkdir -p /app/aiform-factory
  tar -xzf /tmp/release.tar.gz -C /app/aiform-factory/
  rm -f /tmp/release.tar.gz
else
  echo ">>> 回退为 pnpm 源码构建..."
  BUILD_DIR="/tmp/genforms-build"
  rm -rf "$BUILD_DIR"
  git clone --depth 1 https://github.com/jcc6816-dev/AIAPPFactory.git "$BUILD_DIR"
  cd "$BUILD_DIR/Code"
  export NODE_OPTIONS="--max-old-space-size=2048"
  command -v pnpm >/dev/null 2>&1 || npm install -g pnpm@latest
  pnpm install --no-frozen-lockfile
  pnpm run build
  mkdir -p /app/aiform-factory/.next
  cp -r .next/standalone/* /app/aiform-factory/
  cp -r .next/static /app/aiform-factory/.next/
  cp -r public /app/aiform-factory/
fi

# 4. PM2 重启
pm2 reload aiform-factory || pm2 restart aiform-factory

echo "=== GenForms.ai 生产服务已成功更新并重启！==="
