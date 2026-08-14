# 生产环境部署自检清单与安全守护规则

本清单用于 GenForms.ai 阿里云 PM2 Standalone 部署。目标是避免环境变量丢失、错误 PM2 启动目录、生产配置被本地文件覆盖，以及服务“显示 online 但核心登录不可用”的静默失败。

> 发布治理总规则见：[GenForms.ai 发布治理规则](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/release_governance.md)。任何 Codex / Gemini / Mike 发起的生产发布，都必须遵守该文件。

## 核心原则

1. **生产配置持久隔离**
   - 批量 `rsync --delete` 不得覆盖或删除生产 `.env.local`。
   - 本地 `.env.local` 默认不得上传生产。只有生产配置明确变化时，才使用人工确认后的单独配置流程。
   - `data/`、`public/`、`.next/static/` 与 standalone 根目录分开同步，避免目录误删。

2. **启动上下文一致**
   - PM2 启动和重启必须在 `/app/aiform-factory` 下执行。
   - PM2 必须使用 `--update-env`，避免沿用旧环境。
   - 当前新服务器由 Nginx 反向代理至应用 `3000` 端口；默认使用 `DEPLOY_APP_PORT=3000`。若基础设施调整端口，必须由发布人显式传入该变量并在发布后回源验证。
   - PM2 入口使用 `scripts/production-start-guard.js`，先校验生产环境变量，再加载 `server.js`。

3. **部署后必须验证**
   - 查看 PM2 状态和最近日志。
   - 请求 `/api/auth/session`，确认认证入口不是 500。
   - 运行 SEO/品牌/结构化数据巡检脚本。

## 标准发布流程

### 1. 本地验证

```bash
cd /Users/mike/Documents/AIFactory/Code
npx tsc --noEmit
npm test -- --run
npm run build
./scripts/release-preflight.sh --skip-build
```

### 2. 同步发布

```bash
cd /Users/mike/Documents/AIFactory/Code
DEPLOY_SSH_USER=genforms DEPLOY_SSH_KEY=/absolute/path/to/GenFormV2.pem \
  ./scripts/deploy-pm2.sh 43.98.160.36
```

> 不要把私钥路径或私钥内容写入仓库、脚本或日志。旧服务器地址仅可用于受控回滚，不能作为默认发布目标。

### 3. 生产验收

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://genforms.ai/api/auth/session
./scripts/verify-release-state.sh https://genforms.ai
./scripts/verify-production-seo.sh
ssh -i /absolute/path/to/GenFormV2.pem genforms@43.98.160.36 \
  "pm2 logs aiform-factory --lines 30 --nostream"
```

## 关键风险

- 不要直接修改 `.next/standalone/server.js`。它是构建产物，下一次 `npm run build` 会覆盖。
- 不要在批量同步里上传本地 `.env.local`。
- 不要用 PM2 直接启动 `server.js`，否则会绕过启动守护校验。
- 如果启动守护报缺失变量，应修复服务器 `/app/aiform-factory/.env.local`，而不是临时删掉守护逻辑。
- `/api/auth/session` 应使用 GET 检测状态码，不要用 `curl -I`；Auth.js 不支持 HEAD 请求，会产生 `UnknownAction` 日志。
- 默认不得跳过 `release-preflight.sh`。如必须受控脏发布，需 Mike/Codex 明确授权 `RELEASE_ALLOW_DIRTY=1`，并在报告中说明原因。
- `release-preflight.sh` 必须确认 standalone 产物含 `css-tree/data/patch.json`；缺失时文章页会在生产环境 500，禁止发布。
