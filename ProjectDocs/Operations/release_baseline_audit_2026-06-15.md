# GenForms.ai 发布基线审计

版本：2026-06-15  
目的：把当前已经上线或应保留的生产能力，从混合工作区中整理成可提交、可部署、可复核的正式发布基线，避免再次发生旧版本覆盖、临时文件入库或脏发布失控。

## 1. 当前判断

当前生产站点已经恢复到可用状态，且发布后巡检通过：

- 首页旧文案 `AI Form SaaS V2.0`、`View Delivery Path` 已消失。
- `/forms/new` 游客态不再被顶部升级提示挤压。
- Admin Growth 相关 API 路由存在，未登录访问返回 403。
- `verify-release-state.sh` 与 `verify-production-seo.sh` 已在生产环境通过。

但本地仓库仍处于高风险混合状态：大量生产代码、文档、一次性脚本、SEOData 导出、截图和 AI-Team 报告同时处于未提交或未跟踪状态。后续不能继续靠 `RELEASE_ALLOW_DIRTY=1` 作为常规发布方式。

## 2. 必须纳入正式发布基线的类别

### 2.1 发布与生产守护

这些文件是防止再次错误部署的第一优先级，应形成独立提交：

- `Code/scripts/deploy-pm2.sh`
- `Code/scripts/production-start-guard.js`
- `Code/scripts/release-preflight.sh`
- `Code/scripts/verify-release-state.sh`
- `Code/scripts/verify-production-seo.sh`
- `ProjectDocs/Operations/release_governance.md`
- `ProjectDocs/Operations/release_baseline_audit_2026-06-15.md`
- `ProjectDocs/Operations/deployment_checklist.md`
- `ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `README.md`
- `.gitignore`

验收标准：

- `./scripts/release-preflight.sh --skip-build` 在干净工作区下可通过。
- `./scripts/deploy-pm2.sh 43.98.193.104` 内部自动调用 preflight。
- 生产启动必须走 `scripts/production-start-guard.js`，不得直接启动 `server.js`。

### 2.2 Admin Growth 数据驾驶舱

这些能力已经成为日常增长经营系统的一部分，应纳入正式产品基线：

- `Code/app/[locale]/(admin)/admin/growth/page.tsx`
- `Code/app/api/admin/gsc/summary/*`
- `Code/app/api/admin/ga4/summary/*`
- `Code/app/api/admin/pagespeed/summary/*`
- `Code/app/api/admin/clarity/summary/*`
- `Code/app/api/admin/growth/daily-brief/*`
- `Code/components/admin/*`
- `Code/services/admin-growth-daily-brief.ts`
- `Code/services/growth-analytics.ts`
- `Code/services/growth-analytics.test.ts`

验收标准：

- 未登录访问后台数据 API 返回 403。
- 配置缺失时后台显示真实错误提示，不使用假数据伪装。
- Daily Brief 能在 GSC、GA4、Clarity、PageSpeed 部分缺失时降级输出可执行摘要。

### 2.3 搜索增长与内容基础设施

这些文件支撑 sitemap、Solution/Use Case 页面、博客 SEO、IndexNow/Bing/GSC 相关治理，应单独整理成 SEO 基线提交：

- `Code/app/sitemap.ts`
- `Code/app/[locale]/(default)/solutions/page.tsx`
- `Code/app/[locale]/(default)/use-cases/page.tsx`
- `Code/app/[locale]/(default)/posts/page.tsx`
- `Code/app/[locale]/(default)/posts/[slug]/page.tsx`
- `Code/app/[locale]/(workspace)/forms/new/page.tsx`
- `Code/lib/localized-path.ts`
- `Code/lib/markdown-sanitizer.ts`
- `Code/services/growth-content-clusters.ts`
- `Code/services/growth-content-clusters.test.ts`
- `Code/services/solution-landing-pages.ts`
- `Code/services/solution-landing-pages.test.ts`
- `Code/services/use-case-landing-pages.ts`
- `Code/services/use-case-landing-pages.test.ts`
- `Code/tests/markdown-security.test.ts`

验收标准：

- 公开 SEO 页面有 canonical、hreflang、合适的结构化数据。
- `/forms/new` 及 query 变体输出 noindex。
- Markdown HTML 渲染必须经过白名单清洗。

### 2.4 产品激活与体验链路

这些文件承载首页 Demo、游客创建页、Clarity mask、GA4/Growth 事件和小桌面断点修复，应作为产品体验基线提交：

- `Code/components/blocks/hero/index.tsx`
- `Code/app/typeform-home.css`
- `Code/components/forms/form-creation-manager.tsx`
- `Code/components/forms/form-generator.tsx`
- `Code/components/forms/form-preview-panel.tsx`
- `Code/components/analytics/microsoft-clarity.tsx`
- `Code/components/analytics/landing-page-tracker.tsx`
- `Code/lib/growth.ts`
- `Code/app/api/growth/events/route.ts`
- `Code/i18n/pages/landing/en.json`
- `Code/i18n/pages/landing/zh.json`

验收标准：

- 首页小桌面 970x565 不再把 suggestions 推出首屏。
- 首页 CTA 进入 `/forms/new` 后，预览内容与入口上下文一致。
- `/forms/new` 可被 Clarity 录制，但 Prompt、Schema、预览答案、登录输入被 mask。
- 事件参数不得包含 prompt、邮箱、姓名、手机号、答案等 PII。

### 2.5 性能、无障碍和登录延迟加载

这些文件支撑 PageSpeed、首屏 JS、第三方脚本延迟加载和无障碍修复：

- `Code/next.config.mjs`
- `Code/public/logo.png`
- `Code/public/logo-64.png`
- `Code/public/og-image.png`
- `Code/components/blocks/header/index.tsx`
- `Code/components/blocks/footer/index.tsx`
- `Code/components/blocks/pricing/index.tsx`
- `Code/components/blocks/cta/index.tsx`
- `Code/components/blocks/template-starter/index.tsx`
- `Code/components/locale/toggle.tsx`
- `Code/components/theme/toggle.tsx`
- `Code/components/markdown/index.tsx`
- `Code/components/markdown/markdown.css`
- `Code/contexts/app.tsx`
- `Code/hooks/useOneTapLogin.tsx`

验收标准：

- Stripe SDK 不进入游客首页首屏 bundle。
- Google One Tap 不在首页自动触发 FedCM token 获取。
- logo 有明确尺寸，静态资源缓存策略符合生产要求。
- PageSpeed SEO 与 Best Practices 保持 100；移动端性能进入可接受区间并继续观察波动。

## 3. 暂不纳入发布基线的类别

以下内容不应进入生产发布提交，除非后续有独立任务说明其用途：

- `SEOData/`
- 根目录截图：`/*.png`
- 一次性调试脚本，如 `Code/scripts/check_*`、`Code/scripts/debug-*`、`Code/scripts/inspect-*`
- 一次性内容写入脚本，如 `Code/scripts/insert-*`、`Code/scripts/insert_*`
- 未经过安全复核的外部推广脚本，如 `Code/scripts/reddit_promoter_agent.py`
- 本地开发数据：`Code/data/dev-*.json`

说明：这些文件可能对分析有用，但不属于稳定产品代码。应保存在本地、报告目录或专门的数据目录，不参与常规发布。

## 4. 建议提交批次

为避免再次把大量无关改动混在一次提交里，建议按以下顺序提交：

1. `chore: add release governance guardrails`
   - 只包含发布门禁、生产启动守护、验证脚本、发布治理文档、ignore 规则。
2. `feat: add admin growth data dashboard integrations`
   - 只包含 GSC、GA4、PageSpeed、Clarity、Daily Brief 后台数据链路。
3. `feat: strengthen seo landing infrastructure`
   - 只包含 Solution、Use Case、Blog、sitemap、markdown 安全、`/forms/new` noindex。
4. `feat: improve visitor activation experience`
   - 只包含首页 Demo、游客创建页、Clarity mask、激活事件、小桌面断点。
5. `perf: improve homepage loading and accessibility`
   - 只包含性能、无障碍、第三方脚本延迟加载、静态资源缓存。
6. `docs: update ai team operating materials`
   - 只包含 AI-Team、Operations、增长计划、经验文档等协作材料。

## 5. Gemini 后续发布约束

Gemini 如果要发布，必须先确认：

1. 当前任务对应哪个提交批次。
2. 是否只包含该批次允许的文件。
3. 是否已运行 `npm run build`。
4. 是否已运行 `./scripts/release-preflight.sh --skip-build`。
5. 如果工作区是 dirty，必须停止并请求 Mike/Codex 是否允许受控脏发布。
6. 部署后必须运行 `verify-release-state.sh` 和 `verify-production-seo.sh`。

如果 Gemini 无法判断某个文件是否属于本次发布范围，应默认不发布，并请求 Codex 复核。

## 6. 下一步

推荐下一步由 Codex 执行：

1. 先提交“发布治理 guardrails”批次。
2. 对 Admin Growth 批次做一次只读 diff 审计。
3. 将 `Code/scripts/` 下的一次性脚本按“保留/删除/文档化”重新分类。
4. 清理或暂缓 `Code/data/dev-*.json` 这类本地数据改动，不让它们进入生产提交。
