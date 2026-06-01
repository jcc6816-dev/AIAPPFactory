#!/bin/bash

# ==============================================================================
# AI FormFactory - 阿里云一键自动化部署脚本 (本地执行)
# ==============================================================================
# 运行环境：本地 macOS / Linux 终端
# 使用方法：./scripts/deploy-app.sh <服务器公网IP> [SSH密钥路径，可选]
# 示例：./scripts/deploy-app.sh 47.88.99.100 ~/.ssh/id_rsa
# ==============================================================================

# 颜色控制
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVER_IP=$1
KEY_PATH=$2

# 1. 参数验证
if [ -z "$SERVER_IP" ]; then
  echo -e "${RED}错误: 请指定服务器的公网 IP。${NC}"
  echo -e "用法: $0 <服务器IP> [SSH密钥路径, 可选]"
  exit 1
fi

SSH_OPTS=""
if [ -n "$KEY_PATH" ]; then
  if [ -f "$KEY_PATH" ]; then
    SSH_OPTS="-i $KEY_PATH"
    echo -e "${GREEN}使用指定密钥进行连接: $KEY_PATH${NC}"
  else
    echo -e "${RED}错误: 找不到指定的私钥文件: $KEY_PATH${NC}"
    exit 1
  fi
fi

# 获取当前工作目录 (保证在 Code 目录下执行)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo -e "${GREEN}=== 开始一键自动化部署流程 ===${NC}"
echo -e "目标服务器 IP: ${YELLOW}$SERVER_IP${NC}"

# 2. 本地打包代码
echo -e "${YELLOW}[1/4] 正在本地打包项目源文件...${NC}"
TEMP_ZIP="app_deploy_temp.zip"

# 清理历史残留
rm -f "$TEMP_ZIP"

# 压缩必要源文件，排除本地缓存和庞大的依赖包
zip -r "$TEMP_ZIP" . \
  -x "node_modules/*" -x "*/node_modules/*" \
  -x ".next/*" -x "*/.next/*" \
  -x ".git/*" -x "*/.git/*" \
  -x "test-results/*" -x "*/test-results/*" \
  -x "playwright-report/*" -x "*/playwright-report/*" \
  -x "*.zip" \
  -x "package-lock.json" \
  -x ".vscode/*" -x "*/.vscode/*" \
  -x ".idea/*" -x "*/.idea/*" &> /dev/null

if [ ! -f "$TEMP_ZIP" ]; then
  echo -e "${RED}打包失败，请检查 zip 命令是否在本地可用。${NC}"
  exit 1
fi
echo -e "${GREEN}打包成功！压缩文件：$TEMP_ZIP${NC}"

# 3. 上传代码压缩包与本地配置文件至阿里云 ECS
echo -e "${YELLOW}[2/4] 正在上传代码包与配置文件至服务器...${NC}"
# 传输代码包
scp $SSH_OPTS "$TEMP_ZIP" root@$SERVER_IP:/app/aiform-factory/app.zip
if [ $? -ne 0 ]; then
  echo -e "${RED}传输代码包失败！请检查 IP、SSH 密钥或网络连接。${NC}"
  rm -f "$TEMP_ZIP"
  exit 1
fi

# 传输本地配置文件 .env.local 至服务器作为容器环境变量
if [ -f ".env.local" ]; then
  echo -e "检测到本地 .env.local，正在同步至服务器..."
  scp $SSH_OPTS ".env.local" root@$SERVER_IP:/app/aiform-factory/.env.local
else
  echo -e "${YELLOW}警告: 未在本地检测到 .env.local 配置文件，请确保服务器上已手动配置好环境变量！${NC}"
fi

# 4. 连接服务器解压并启动 Docker Compose 编译部署
echo -e "${YELLOW}[3/4] 正在远程连接服务器并启动 Docker 镜像编译部署...${NC}"
ssh $SSH_OPTS root@$SERVER_IP "cd /app/aiform-factory && unzip -o app.zip &> /dev/null && rm -f app.zip && echo '代码解压成功，正在通过 Docker Compose 构建并运行应用...' && docker compose down && docker compose up --build -d && echo '服务已在后台启动！'"

if [ $? -ne 0 ]; then
  echo -e "${RED}远程编译部署失败，请登录服务器检查 docker compose 日志。${NC}"
  rm -f "$TEMP_ZIP"
  exit 1
fi

# 5. 清理本地临时压缩包
rm -f "$TEMP_ZIP"

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}          🎉 自动化打包与发布部署圆满成功！        ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "访问链接: ${YELLOW}http://$SERVER_IP${NC}"
echo -e "提示：如果是首次运行，容器构建可能需要 1-3 分钟，请稍候再访问。${NC}"
echo -e "${GREEN}====================================================${NC}"
