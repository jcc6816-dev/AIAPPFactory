# Release Manifest: SEO / Growth Controlled Dirty Release

> 创建日期：2026-06-25
> 发布类型：Controlled dirty release
> 发布判断：允许整体部署当前 `Code/` 构建产物，但必须先通过 targeted tests、`npm run build`、release preflight 和生产 SEO gate。

## 1. 为什么不是只部署 Webhook 小修

本轮 Webhook Cluster 小修本身只需要：

- `Code/services/growth-content-clusters.ts`
- `Code/services/growth-content-clusters.test.ts`

但当前工作区还有一批此前已完成、已验证或已进入生产主线的未提交改动。现有 `Code/scripts/deploy-pm2.sh` 会部署 `.next/standalone` 构建产物，构建产物来自当前 `Code/` 状态，不支持只带某两个源文件。

因此，如果部署，就应作为一次明确记录边界的 controlled dirty release，而不是假装这是“只上线 Webhook 小修”。

## 2. 本次可带上线的代码改动分组

### 2.1 P0 认证与登录稳定性

文件：

- `Code/auth/config.ts`
- `Code/components/sign/form.tsx`
- `Code/components/sign/modal.tsx`
- `Code/services/deployment-health.ts`
- `Code/services/deployment-health.test.ts`

目的：

- 修复 Google OAuth / Auth.js PKCE cookie 在生产回调中的稳定性。
- 阻止登录按钮重复点击。
- 增加生产部署健康检查，识别 `AUTH_URL` / `NEXTAUTH_URL` / `NEXT_PUBLIC_WEB_URL` 不一致风险。

发布判断：可上线。属于前期生产登录问题的 P0 修复。

### 2.2 SEO 页面到创建路径的 intent 承接

文件：

- `Code/app/[locale]/(default)/use-cases/[slug]/page.tsx`
- `Code/app/[locale]/(workspace)/forms/new/page.tsx`
- `Code/components/templates/template-use-button.tsx`
- `Code/components/templates/template-use-url.ts`
- `Code/components/templates/template-use-button.test.ts`
- `Code/components/forms/form-creation-manager.tsx`
- `Code/components/forms/form-generator.tsx`
- `Code/types/form.d.ts`

目的：

- SEO Use Case CTA 传递 `source` / `intent` / `mode` / `prompt` 到 `/forms/new`。
- 创建页接住上下文，并写入增长事件。
- 支持 Contact / Webhook / QR / Typeform Alternative / Lead Capture 的预配置创建入口。

发布判断：可上线。符合 SEO 与产品漏斗对齐目标。

### 2.3 SEO Use Case / Post 内容增强

文件：

- `Code/app/[locale]/(default)/posts/[slug]/page.tsx`
- `Code/components/blocks/blog-detail/index.tsx`
- `Code/services/use-case-landing-pages.ts`
- `Code/services/use-case-landing-pages.test.ts`
- `Code/services/form-templates.ts`
- `Code/services/growth-content-clusters.ts`
- `Code/services/growth-content-clusters.test.ts`
- `Code/public/llms.txt`

目的：

- 给 Webhook 教程 Post 增加 keywords / FAQPage JSON-LD。
- 让重点 Post 的侧边 CTA 指向正确 intent。
- 增强 Contact / Webhook / QR / Typeform 等 Use Case 的搜索意图匹配模块、FAQ 和产品事实边界。
- 补全 Webhook Cluster 的 Related guides。

发布判断：可上线。属于已批准 SEO 主线内容优化，不涉及未确认产品能力承诺。

### 2.4 首页与 Pricing 锚点修复

文件：

- `Code/app/[locale]/(default)/page.tsx`
- `Code/components/analytics/hash-anchor-scroller.tsx`
- `Code/components/blocks/pricing/index.tsx`

目的：

- 缩短英文首页 title / description，修复 Bing metadata 风险。
- 修复移动端点击 `#pricing` 后落位不稳定问题。

发布判断：可上线。属于已观察到真实 Google 访客行为后的低风险修复。

### 2.5 增长数据快照与 Cron 修复

文件：

- `Code/app/api/admin/growth/snapshots/cron/route.ts`
- `Code/app/api/admin/growth/snapshots/cron/route.test.ts`
- `Code/services/growth-snapshot.ts`
- `Code/services/growth-snapshot.test.ts`
- `Code/scripts/inspect-all-snapshots.js`
- `Code/scripts/inspect-ga4-details.js`
- `Code/scripts/inspect-gsc-queries.js`
- `Code/scripts/inspect-raw-queries.js`
- `Code/scripts/trigger-growth-cron.sh`

目的：

- Cron 默认后台快速返回，避免长时间无响应。
- 增加 `source` 参数，可单独跑 `google` / `gsc` / `ga4` / `clarity` / `pagespeed`。
- 增加并发锁和 fetch timeout。
- OAuth token 失败时可回落 service account。
- 增加数据检查脚本。

发布判断：可上线。属于 SEO 数据灯塔修复。

### 2.6 发布门禁与生产巡检

文件：

- `Code/scripts/release-preflight.sh`
- `Code/scripts/verify-production-seo.sh`
- `.gitignore`

目的：

- 更新 guest-safe allowance gate 的构建检查。
- 增加 Webhook / Lead Capture use case SEO 生产巡检。
- 防止 `Secrets/` 进入版本管理。

发布判断：可上线。

## 3. 不影响生产构建的文档 / 研究资产

`ProjectDocs/Operations/**`、`ProjectDocs/AI-Team/**`、`ProjectDocs/CompetitiveProduct/**` 下大量新增文档属于研究和管理沉淀，不进入 `.next/standalone` 运行时。

发布判断：可保留，不影响生产运行。

## 4. 本次不应视为新增大功能

本次发布不是新增新的大型产品模块，也不是开启 pSEO 批量页面。

它实际发布的是：

- 登录稳定性修复。
- SEO 页面到创建路径承接。
- 已批准的 Use Case / Post SEO 结构增强。
- 增长数据抓取稳定性。
- Webhook Topic Cluster 内链配置。

## 5. 发布前必须通过

- `npm test -- growth-content-clusters.test.ts template-use-button.test.ts use-case-landing-pages.test.ts deployment-health.test.ts growth-snapshot.test.ts route.test.ts`
- `npm run build`
- `RELEASE_ALLOW_DIRTY=1 ./scripts/release-preflight.sh --allow-dirty --skip-build`

## 6. 发布后必须验证

- `./scripts/verify-production-seo.sh https://genforms.ai`
- `curl -s -I https://genforms.ai/use-cases/webhook-form-builder-retry-logs`
- `curl -s -L https://genforms.ai/use-cases/webhook-form-builder-retry-logs | grep -E "send-form-submissions-to-webhook|form-builder-with-webhook|feishu-dingtalk-webhook-notification"`
- `curl -s -L "https://genforms.ai/forms/new?template=contact-us&source=usecase_webhook-form-builder-retry-logs&intent=webhook_form" | grep -E "GenForms|form"`

## 7. 发布后观察

上线后 7 天冻结观察：

- `/use-cases/webhook-form-builder-retry-logs`
- `/posts/send-form-submissions-to-webhook`
- `/posts/form-builder-with-webhook`
- `/posts/feishu-dingtalk-webhook-notification`
- `/use-cases/contact-form-builder-for-websites`
- `/use-cases/qr-code-form-builder`
- `/posts/typeform-alternatives`

重点看：

- GSC impressions / clicks / CTR / average position。
- GA4 `forms_new_view`、`template_use_click`、`form_generate`。
- Clarity Google 来源会话是否继续进入 Webhook 相关页面。

## 8. 最终发布判断

如果发布前门禁全部通过，本次可以部署。

不建议再为了 Webhook Cluster 小修单独拆一个干净分支，因为当前 dirty 代码中包含生产登录、创建路径和数据抓取修复；从干净 HEAD 单独部署反而有回滚这些修复的风险。

## 9. 发布执行记录

执行时间：2026-06-25

发布前验证：

- `npm test -- growth-content-clusters.test.ts template-use-button.test.ts use-case-landing-pages.test.ts deployment-health.test.ts growth-snapshot.test.ts route.test.ts`
  - 结果：通过，21 个测试文件，107 个测试。
- `npm run build`
  - 结果：通过，Next.js 生产构建成功。
- `RELEASE_ALLOW_DIRTY=1 ./scripts/release-preflight.sh --allow-dirty --skip-build`
  - 结果：通过，只有 controlled dirty release 的预期警告。

部署命令：

```bash
RELEASE_ALLOW_DIRTY=1 ./scripts/deploy-pm2.sh 43.98.193.104
```

部署结果：

- PM2 `aiform-factory` 启动成功，状态 `online`。
- 部署脚本内置 auth session 检查返回 `200`。
- 生产日志显示 startup guard 通过。
- 生产日志显示 GSC / GA4 / Clarity snapshot 任务已有成功记录。

发布后验证：

- `./scripts/verify-production-seo.sh https://genforms.ai`
  - 结果：通过。
- `https://genforms.ai/use-cases/webhook-form-builder-retry-logs`
  - 结果：HTTP 200，canonical / hreflang 正常。
- Webhook Pillar HTML 已包含：
  - `Related guides`
  - `send-form-submissions-to-webhook`
  - `form-builder-with-webhook`
  - `feishu-dingtalk-webhook-notification`
- `/posts/send-form-submissions-to-webhook` HTML 已包含：
  - `intent=webhook_form`
  - `webhook-form-builder-retry-logs`
  - `FAQPage`
- 服务器本机验证：
  - `http://127.0.0.1:80/api/auth/session` 返回 `200`
  - `http://127.0.0.1:80/zh` 返回 `200`
  - Contact Form 页面包含 `Create a contact form for free`、`intent=contact_form`、`FAQPage`

注意：

- 本地外网 `curl` 在发布后多次出现临时 `000` / DNS 类波动，但同一阶段外网 `/zh` 曾返回 `200`，服务器本机验证稳定通过，PM2 在线，因此不判断为生产服务故障。
