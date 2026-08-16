#!/bin/bash
set -e

echo "=== 开始一键更新 GenForms.ai 生产服务 ==="

# 1. 确保 SSH 公钥允许本地直接部署
mkdir -p /home/genforms/.ssh /root/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6jyp9l+/D7TT1JwuTXI+p+eGBvVb5Sm1hlEwnBSgrp/hIvEf3nefHWCEw2xWad1buQum0i2CDgmInyvAclXOcfzfeIpyoYF7zmnrkVhkFOV9OXLJsur6EvtyvjIDnLrjTriNdny1AjZW1eMeqvFJ8vzPFfgFAt2ZvWT7SGbt1kci3xfz34rS9tgby1hclxKdIlDojVtZDi8pYL5SLRZRojFaVrG9yoqEDs6sfgEa08291RZXb1J8pTrUDTXXMGqQSI82qZxLtEOHnbvw+4Y4SRXQJ5cTX24g/e6d0fRtrNLpyPEL4TzcU9mPw2RohBVXF4cHR2M4sGDzS6mpb//bx" | tee -a /home/genforms/.ssh/authorized_keys /root/.ssh/authorized_keys >/dev/null
chmod 600 /home/genforms/.ssh/authorized_keys /root/.ssh/authorized_keys
chown -R genforms:genforms /home/genforms/.ssh 2>/dev/null || true

# 2. 确保 2G 虚拟交换内存 (Swap)，彻底防止 Next.js 编译内存溢出 (OOM)
if [ ! -f /swapfile ]; then
  echo ">>> 创建 2G Swap 交换分区以支持 Next.js 构建..."
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile 2>/dev/null || true
  swapon /swapfile 2>/dev/null || true
  grep -q "/swapfile" /etc/fstab || echo "/swapfile swap swap defaults 0 0" >> /etc/fstab
fi

# 3. 拉取最新源码编译并同步到 /app/aiform-factory
BUILD_DIR="/tmp/genforms-build"
rm -rf "$BUILD_DIR"
git clone --depth 1 https://github.com/jcc6816-dev/AIAPPFactory.git "$BUILD_DIR"

cd "$BUILD_DIR/Code"
export NODE_OPTIONS="--max-old-space-size=2048"
npm install --legacy-peer-deps --no-audit --no-fund
npm run build

mkdir -p /app/aiform-factory/.next
cp -r .next/standalone/* /app/aiform-factory/
cp -r .next/static /app/aiform-factory/.next/
cp -r public /app/aiform-factory/

# 4. PM2 重启
pm2 reload aiform-factory || pm2 restart aiform-factory

echo "=== GenForms.ai 生产服务已成功更新并重启！==="
