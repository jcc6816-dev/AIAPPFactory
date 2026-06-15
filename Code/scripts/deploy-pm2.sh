#!/bin/bash

# ==============================================================================
# GenForms.ai - 阿里云 PM2 Standalone 一键部署脚本 (本地执行)
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

APP_DIR="/app/aiform-factory"
APP_NAME="aiform-factory"

echo -e "${GREEN}=== GenForms.ai PM2 Standalone 部署 ===${NC}"
echo -e "目标服务器 IP: ${YELLOW}$SERVER_IP${NC}"

# 1. 发布门禁：检查构建产物、关键路由、旧版本回退风险和部署脚本安全性。
if [ "${SKIP_RELEASE_PREFLIGHT:-0}" != "1" ]; then
  echo -e "${YELLOW}[0/4] 正在执行发布前门禁检查...${NC}"
  ./scripts/release-preflight.sh --skip-build
  if [ $? -ne 0 ]; then
    echo -e "${RED}发布前门禁未通过，已停止部署。${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}[0/4] 已跳过发布前门禁检查。仅允许紧急人工恢复使用。${NC}"
fi

# 2. 检查本地是否已完成编译
if [ ! -d ".next/standalone" ]; then
  echo -e "${RED}错误: 未找到 .next/standalone 目录，请先在本地运行 pnpm build！${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 检测到本地编译产物 .next/standalone${NC}"

# 3. 在服务器上安装 Node.js 22 和 PM2（如已安装则自动跳过）
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
  mkdir -p $APP_DIR/scripts
  echo '服务器环境就绪'
"
if [ $? -ne 0 ]; then
  echo -e "${RED}服务器环境初始化失败，请检查网络连接。${NC}"
  exit 1
fi

# 4. 同步编译后的 standalone 产物到服务器 (体积极小，通常只有 5-10MB)
echo -e "${YELLOW}[2/4] 正在同步编译产物到服务器（只传输必要文件）...${NC}"

# 同步 standalone 核心目录
rsync -avz --delete \
  --exclude="/.env.local" \
  --exclude="/.env.local.bak-*" \
  --exclude="/data/" \
  --exclude="/public/" \
  --exclude="/.next/static/" \
  .next/standalone/ \
  root@$SERVER_IP:$APP_DIR/

# 同步 static 静态资源
rsync -avz --delete \
  .next/static/ \
  root@$SERVER_IP:$APP_DIR/.next/static/

# 同步 public 公共资源
rsync -avz --delete \
  public/ \
  root@$SERVER_IP:$APP_DIR/public/

# 同步源码级生产启动守护脚本。该脚本不可写入 .next/standalone/server.js，
# 因为 server.js 是构建产物，每次 next build 都会被重新生成。
ssh root@$SERVER_IP "mkdir -p $APP_DIR/scripts"
rsync -avz \
  scripts/production-start-guard.js \
  root@$SERVER_IP:$APP_DIR/scripts/production-start-guard.js

if [ $? -ne 0 ]; then
  echo -e "${RED}文件同步失败，请检查网络连接。${NC}"
  exit 1
fi

# 5. 检查生产环境变量配置文件。默认不上传本地 .env.local，避免覆盖生产密钥。
echo -e "${YELLOW}[3/4] 正在检查生产环境变量配置...${NC}"
ssh root@$SERVER_IP "
  test -f $APP_DIR/.env.local
"
if [ $? -ne 0 ]; then
  echo -e "${RED}错误: 服务器缺少 $APP_DIR/.env.local。请先手动配置生产环境变量。${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 服务器 .env.local 存在，本次不会覆盖生产配置${NC}"

# 6. 远程启动 PM2 进程
echo -e "${YELLOW}[4/4] 正在启动 PM2 应用进程...${NC}"
ssh root@$SERVER_IP "
  cd $APP_DIR
  pm2 stop $APP_NAME 2>/dev/null || true
  pm2 delete $APP_NAME 2>/dev/null || true
  PORT=80 NODE_ENV=production pm2 start scripts/production-start-guard.js \
    --name $APP_NAME \
    --interpreter node \
    --update-env
  pm2 save
  pm2 status $APP_NAME
  AUTH_STATUS=\"000\"
  for i in 1 2 3 4 5; do
    AUTH_STATUS=\$(curl -s -o /dev/null -w \"%{http_code}\" http://127.0.0.1:80/api/auth/session || true)
    if [ \"\$AUTH_STATUS\" = \"200\" ] || [ \"\$AUTH_STATUS\" = \"302\" ] || [ \"\$AUTH_STATUS\" = \"307\" ]; then
      break
    fi
    AUTH_STATUS=\$(curl -s -o /dev/null -w \"%{http_code}\" http://127.0.0.1:3000/api/auth/session || true)
    if [ \"\$AUTH_STATUS\" = \"200\" ] || [ \"\$AUTH_STATUS\" = \"302\" ] || [ \"\$AUTH_STATUS\" = \"307\" ]; then
      break
    fi
    sleep 2
  done
  echo \"Auth session status: \$AUTH_STATUS\"
  case \"\$AUTH_STATUS\" in
    200|302|307) ;;
    *) echo 'Auth session check failed'; exit 1 ;;
  esac
  pm2 logs $APP_NAME --lines 30 --nostream
"

if [ $? -ne 0 ]; then
  echo -e "${RED}PM2 启动失败，请登录服务器运行 pm2 logs 查看错误详情。${NC}"
  exit 1
fi

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}       PM2 Standalone 部署完成，请继续运行线上巡检。       ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "访问链接: ${YELLOW}https://genforms.ai${NC}"
echo -e "${GREEN}====================================================${NC}"
