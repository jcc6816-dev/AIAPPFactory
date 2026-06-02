#!/bin/bash

# ==============================================================================
# AI FormFactory - 阿里云 PM2 Standalone 一键部署脚本 (本地执行)
# ==============================================================================
# 使用方式：本地先执行 pnpm build，然后运行此脚本
# 示例：./scripts/deploy-pm2.sh 43.98.193.104
# ==============================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVER_IP=$1

if [ -z "$SERVER_IP" ]; then
  echo -e "${RED}错误: 请指定服务器的公网 IP。${NC}"
  echo -e "用法: $0 <服务器IP>"
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo -e "${GREEN}=== AI FormFactory PM2 Standalone 部署 ===${NC}"
echo -e "目标服务器 IP: ${YELLOW}$SERVER_IP${NC}"

# 1. 检查本地是否已完成编译
if [ ! -d ".next/standalone" ]; then
  echo -e "${RED}错误: 未找到 .next/standalone 目录，请先在本地运行 pnpm build！${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 检测到本地编译产物 .next/standalone${NC}"

# 2. 在服务器上安装 Node.js 22 和 PM2（如已安装则自动跳过）
echo -e "${YELLOW}[1/4] 正在检查并初始化服务器运行环境...${NC}"
ssh root@$SERVER_IP "
  if ! command -v node &> /dev/null; then
    echo '正在安装 Node.js 22...'
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
  fi
  if ! command -v pm2 &> /dev/null; then
    echo '正在安装 PM2...'
    npm i -g pm2
  fi
  mkdir -p /app/aiform-factory
  echo '服务器环境就绪'
"
if [ $? -ne 0 ]; then
  echo -e "${RED}服务器环境初始化失败，请检查网络连接。${NC}"
  exit 1
fi

# 3. 同步编译后的 standalone 产物到服务器 (体积极小，通常只有 5-10MB)
echo -e "${YELLOW}[2/4] 正在同步编译产物到服务器（只传输必要文件）...${NC}"

# 同步 standalone 核心目录
rsync -avz --delete \
  --exclude=".env.local" \
  --exclude=".env.local.bak-*" \
  --exclude="data/" \
  --exclude="public/" \
  --exclude=".next/static/" \
  .next/standalone/ \
  root@$SERVER_IP:/app/aiform-factory/

# 同步 static 静态资源
rsync -avz --delete \
  .next/static/ \
  root@$SERVER_IP:/app/aiform-factory/.next/static/

# 同步 public 公共资源
rsync -avz --delete \
  public/ \
  root@$SERVER_IP:/app/aiform-factory/public/

if [ $? -ne 0 ]; then
  echo -e "${RED}文件同步失败，请检查网络连接。${NC}"
  exit 1
fi

# 4. 同步环境变量配置文件
echo -e "${YELLOW}[3/4] 正在同步环境变量配置...${NC}"
if [ -f ".env.local" ]; then
  scp .env.local root@$SERVER_IP:/app/aiform-factory/.env.local
  echo -e "${GREEN}✓ .env.local 已同步${NC}"
else
  echo -e "${YELLOW}警告: 未找到 .env.local，请确保服务器上已手动配置环境变量！${NC}"
fi

# 5. 远程启动 PM2 进程
echo -e "${YELLOW}[4/4] 正在启动 PM2 应用进程...${NC}"
ssh root@$SERVER_IP "
  cd /app/aiform-factory
  pm2 stop aiform-factory 2>/dev/null || true
  pm2 delete aiform-factory 2>/dev/null || true
  PORT=3000 NODE_ENV=production pm2 start server.js \
    --name aiform-factory \
    --env production
  pm2 save
  pm2 status
"

if [ $? -ne 0 ]; then
  echo -e "${RED}PM2 启动失败，请登录服务器运行 pm2 logs 查看错误详情。${NC}"
  exit 1
fi

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}       🎉 PM2 Standalone 部署圆满成功！            ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "访问链接: ${YELLOW}http://$SERVER_IP:3000${NC}"
echo -e "${GREEN}====================================================${NC}"
