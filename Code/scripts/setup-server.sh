#!/bin/bash

# ==============================================================================
# AI FormFactory - 阿里云 Ubuntu 服务器一键初始化脚本
# ==============================================================================
# 适用系统：Ubuntu 22.04 LTS (64位)
# 执行权限：需要在服务器上以 root 用户权限运行：sudo bash setup-server.sh
# ==============================================================================

# 颜色控制
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 开始进行服务器环境一键初始化 ===${NC}"

# 1. 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}错误: 请以 root 用户权限运行此脚本 (例如使用 sudo)。${NC}"
  exit 1
fi

# 2. 系统软件包更新
echo -e "${YELLOW}[1/6] 正在更新系统软件包列表...${NC}"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw tar wget htop build-essential

# 3. 开启 2GB SWAP 虚拟内存 (核心步骤：防止 2G 内存主机编译 Next.js 时内存溢出崩溃)
echo -e "${YELLOW}[2/6] 正在检查并开启 2GB SWAP 虚拟内存...${NC}"
if [ -f /swapfile ]; then
  echo -e "${GREEN}检测到 swapfile 已存在，跳过创建。${NC}"
else
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo -e "${GREEN}成功创建并启用 2GB SWAP 虚拟内存！${NC}"
fi

# 4. 安装 Docker
echo -e "${YELLOW}[3/6] 正在检查并安装 Docker 容器引擎...${NC}"
if command -v docker &> /dev/null; then
  echo -e "${GREEN}Docker 已安装，跳过安装步骤。${NC}"
else
  curl -fsSL https://get.docker.com | sh
  systemctl start docker
  systemctl enable docker
  echo -e "${GREEN}Docker 安装成功并已设置为自启动！${NC}"
fi

# 5. 安装 Docker Compose
echo -e "${YELLOW}[4/6] 正在检查并安装 Docker Compose V2...${NC}"
if docker compose version &> /dev/null; then
  echo -e "${GREEN}Docker Compose 已安装。${NC}"
else
  apt-get install -y docker-compose-plugin
  echo -e "${GREEN}Docker Compose 安装成功！${NC}"
fi

# 6. 配置系统自带防火墙 (UFW)
echo -e "${YELLOW}[5/6] 正在配置系统防火墙，确保安全与端口通行...${NC}"
# 允许 SSH (22), HTTP (80), HTTPS (443)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
# 默认启用防火墙 (非交互式，防止阻塞命令行)
echo "y" | ufw enable
ufw status verbose

# 7. 创建应用部署工作目录
echo -e "${YELLOW}[6/6] 正在初始化应用工作目录...${NC}"
mkdir -p /app/aiform-factory
chmod -R 755 /app

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}              🎉 服务器初始化圆满完成！             ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "${YELLOW}您的服务器当前状态：${NC}"
echo -e "- SWAP 虚拟内存：已开启 (2GB)"
echo -e "- 防火墙：已启用 (已开放端口: 22, 80, 443)"
echo -e "- 部署工作目录：/app/aiform-factory"
echo -e "- Docker 版本：$(docker --version)"
echo -e "- Docker Compose 版本：$(docker compose version)"
echo -e "${GREEN}====================================================${NC}"
echo -e "${YELLOW}提示：您现在可以将在本地生成的代码压缩包，传输到服务器的 /app/aiform-factory 目录下进行解压部署了。${NC}"
