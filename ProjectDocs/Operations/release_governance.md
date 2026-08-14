# GenForms.ai 发布治理规则

版本：2026-06-15  
适用范围：GenForms.ai 阿里云 PM2 Standalone 生产发布  
目标：允许 Codex、Mike、Gemini 在必要时都能参与发布，但必须有统一门禁，避免旧版本覆盖、环境变量丢失、端口错误、关键 API 消失和体验优化回退。

## 1. 核心结论

后续任何生产发布都不能只凭“本地 build 通过”或“Gemini 说完成”就上线。

发布必须同时满足：

1. 本地构建成功。
2. 发布前门禁通过。
3. 部署脚本不会覆盖生产 `.env.local`。
4. PM2 必须通过 `scripts/production-start-guard.js` 启动。
5. 生产发布后必须执行线上状态验证。
6. 如果工作区不是干净 Git 状态，必须由 Mike 或 Codex 明确批准“受控脏发布”。

## 2. 发布角色边界

### Codex

- 负责最终发布策略、风险判断、门禁维护、生产复核。
- 可以执行部署，但必须先跑门禁。
- 生产故障时可以做最小化紧急修复，但事后必须补记录。

### Gemini

- 可以编写代码、运行本地验证、生成执行报告。
- 可以在 Mike 明确授权时执行发布命令。
- 但不能绕过发布门禁，不能手动上传 `.env.local`，不能直接启动 `server.js`，不能自行宣布“生产通过”。
- 如果门禁失败，必须停止并把失败原因原样报告给 Mike/Codex。

### Mike

- 可以授权一次发布。
- 如果授权 Gemini 发布，应明确要求 Gemini 使用本文件中的标准命令，并提交发布结果。
- Cloudflare 缓存清理通常由 Mike 操作，除非另行授权。

## 3. 标准发布命令

在 `Code/` 目录下执行：

```bash
npm run build
./scripts/release-preflight.sh --skip-build
DEPLOY_SSH_USER=genforms DEPLOY_SSH_KEY=/absolute/path/to/GenFormV2.pem \
  ./scripts/deploy-pm2.sh 43.98.160.36
./scripts/verify-release-state.sh https://genforms.ai
./scripts/verify-production-seo.sh https://genforms.ai
```

如果工作区存在未提交改动，默认会阻断发布。只有在 Mike 或 Codex 明确批准时，才允许：

```bash
RELEASE_ALLOW_DIRTY=1 ./scripts/release-preflight.sh --skip-build
RELEASE_ALLOW_DIRTY=1 DEPLOY_SSH_USER=genforms DEPLOY_SSH_KEY=/absolute/path/to/GenFormV2.pem \
  ./scripts/deploy-pm2.sh 43.98.160.36
```

这代表“受控脏发布”，不是常规流程。执行报告必须写明：

- 为什么不能等待干净提交。
- 本次脏发布包含哪些关键改动。
- 哪些文件未提交但被发布。
- 发布后验证结果。

## 4. 发布前门禁检查内容

脚本：

```bash
Code/scripts/release-preflight.sh
```

它会检查：

- 工作区是否干净，或是否获得受控脏发布授权。
- `deploy-pm2.sh` 是否排除 `.env.local`。
- `deploy-pm2.sh` 是否通过 `production-start-guard.js` 启动。
- `deploy-pm2.sh` 是否以显式、可覆盖的 `DEPLOY_APP_PORT` 启动应用（新服务器默认 `3000`）。
- `.next/standalone` 是否存在。
- 构建产物是否包含关键页面与 API：
  - `/forms/new`
  - 首页
  - GSC summary API
  - GA4 summary API
  - PageSpeed summary API
  - Clarity summary API
  - Growth Daily Brief API
- 首页旧文案是否回退：
  - `AI Form SaaS V2.0`
  - `View Delivery Path`
- `/forms/new` 游客态是否避免顶部免费额度升级提示。
- 新的关键埋点是否仍在：
  - `forms_new_view`
  - `workspace_preview_ready`
- standalone 产物是否包含 `css-tree/data/patch.json`，避免文章页生产 500。

## 5. 发布后验证内容

脚本：

```bash
Code/scripts/verify-release-state.sh https://genforms.ai
```

它会检查：

- 首页 200。
- `/api/auth/session` 200。
- Bing-safe 首页标题上线。
- 首页没有旧 badge / 旧 CTA。
- `/forms/new` 游客态不显示顶部升级条。
- Admin Growth 相关 API 路由仍存在，并且未登录访问返回 403。

此外继续运行：

```bash
Code/scripts/verify-production-seo.sh https://genforms.ai
```

它负责 SEO 结构、sitemap、canonical、hreflang、结构化数据等验证。

## 6. 生产发布红线

禁止：

- 上传本地 `.env.local` 覆盖生产。
- 直接修改 `.next/standalone/server.js`。
- 直接用 PM2 启动 `server.js`。
- 使用旧版 `deploy-app.sh` 或手写 rsync 命令绕过门禁。
- 在不知道当前 Git/工作区状态的情况下发布。
- 发布后不做线上验证。
- 因为一个小 CSS 或文案修复而全量覆盖未知旧版本。

## 7. Gemini 发布时必须回复给 Mike 的格式

Gemini 发布前必须回复：

```text
我将按 GenForms.ai 发布治理规则执行发布。
我会依次运行：
1. npm run build
2. ./scripts/release-preflight.sh --skip-build
3. DEPLOY_SSH_USER=genforms DEPLOY_SSH_KEY=/absolute/path/to/GenFormV2.pem ./scripts/deploy-pm2.sh 43.98.160.36
4. ./scripts/verify-release-state.sh https://genforms.ai
5. ./scripts/verify-production-seo.sh https://genforms.ai

如果 release-preflight 失败，我会停止，不会继续部署。
如果工作区是脏的，我会先请求 Mike/Codex 是否允许 RELEASE_ALLOW_DIRTY=1 的受控脏发布。
```

Gemini 发布后必须回复：

```text
本次发布完成/失败。
发布前门禁：通过/失败
PM2 状态：online/异常
Auth 检查：通过/失败
首页旧文案回退检查：通过/失败
/forms/new 游客升级条检查：通过/失败
Admin Growth API 存在性检查：通过/失败
SEO 巡检：通过/失败
需要 Mike 操作：是否清理 Cloudflare 缓存、是否重新请求 Bing/GSC 抓取
请让 Codex 复核。
```

## 8. 当前待治理债务

当前仓库仍存在大量未提交文件和未纳入正式基线的生产能力。下一阶段应完成：

1. 按 [发布基线审计](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/release_baseline_audit_2026-06-15.md) 把已上线且确认需要保留的能力分批整理进 Git。
2. 把生产启动守护脚本、发布门禁脚本、发布后验证脚本作为第一批 guardrails 正式提交。
3. 把 Admin Growth / GSC / GA4 / PageSpeed / Clarity / Daily Brief 作为第二批产品能力提交。
4. 清理临时脚本、一次性调试文件、本地数据和截图，避免它们进入生产发布提交。
5. 建立“发布批次记录”，每次上线记录 commit、时间、改动范围和验证结果。
