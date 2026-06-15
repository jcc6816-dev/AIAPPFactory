# 2026-06-07 Gemini 满负荷生产增长工作包

## 适用日期

- 日期：2026-06-07
- 状态：Codex 低可用前的交接工作包
- 执行主力：Gemini
- 临时调度：Mike
- 目标：今天必须产生足够的可发布内容、可执行发布动作、外部发现准备和 Codex 恢复后的实现输入。

## 今日工作原则

1. 今天不是“写建议”，而是产出可被 Mike 直接发布、提交、检查或执行的材料。
2. Gemini 工作量按 6-8 小时等效工作安排。
3. Mike 工作量按 2-4 小时安排，主要处理后台发布、GSC、GA4、外部提交和人工确认。
4. 每个任务必须绑定生产动作：公开 URL、待发布 slug、GSC 请求索引、GA4 检查、外部提交或 Codex 恢复后的实现入口。
5. Gemini 可以使用 `CODE_READ_SCOPED` 只读核验低风险产品事实，但不能泛读 `Code/**`。
6. Gemini 可以使用 `CONTENT_WRITE_SCOPED` 写入 AI-Team 临时内容包、草稿包、JSON 文案包，但不能写业务代码。
7. 禁止部署、禁止 Git commit、禁止读取 secrets、禁止触碰认证/支付/账单/数据库迁移/生产脚本。

## 今日总目标

今天结束前，至少完成：

- 2 篇后台可发布英文博客整理包。
- 1 份模板 FAQ / CTA / 内链本地 JSON 文案包。
- 1 份外部目录/社区推广执行包。
- 1 份 GSC/GA4 数据收集与解读任务说明。
- 1 份 Codex 恢复后 Top 8 实现清单。
- 1 份日结。

## 今日任务列表

### T1：整理 Webhook 博客为后台可发布版本

来源：

- `AI-TASK-2026-006-014`

权限：

- `REPORT_ONLY`
- 如需核验产品事实，可使用 `CODE_READ_SCOPED` 只读查看：
  - `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`
  - `/Users/mike/Documents/AIFactory/Code/services/use-case-landing-pages.ts`
  - `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/production-ready-post-webhook-logs-retries-2026-06-07.md`
- 必须包含：
  - slug
  - SEO title
  - meta description
  - excerpt
  - tags/categories
  - full body markdown
  - FAQ
  - CTA
  - internal links
  - 发布后 URL
  - GSC 请求索引提醒
  - 发布前风险自检

Mike 工作：

- 把内容复制到 Admin Posts 发布。
- 发布后打开生产 URL 检查。
- GSC 请求索引。

验收：

- Mike 能直接拿 Gemini 输出发布，不需要再整理格式。

### T2：整理 AI Lead Capture 博客为后台可发布版本

来源：

- `AI-TASK-2026-006-014`

权限：

- `REPORT_ONLY`
- 可使用 `CODE_READ_SCOPED` 只读查看：
  - `/Users/mike/Documents/AIFactory/Code/services/solution-landing-pages.ts`
  - `/Users/mike/Documents/AIFactory/Code/services/form-templates.ts`
  - `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/production-ready-post-ai-lead-capture-2026-06-07.md`
- 必须包含：
  - slug
  - SEO title
  - meta description
  - excerpt
  - tags/categories
  - full body markdown
  - FAQ
  - CTA
  - internal links
  - 与 Webhook 博客的差异化说明，避免内容相似
  - 发布后 URL
  - GSC 请求索引提醒

Mike 工作：

- 如果今天已发布 T1，则可先创建草稿，间隔 24-48 小时再发布。
- 若确认内容差异足够，也可今天晚些时候发布。

验收：

- 第二篇文章达到可发布状态，而不是停留在审计报告。

### T3：执行模板 FAQ / CTA / 内链文案包

来源：

- `AI-TASK-2026-006-015`
- `PROPOSED-2026-006-002`

权限：

- `CONTENT_WRITE_SCOPED`

允许修改：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/template-faq-cta-link-pack-2026-06-07.md`

禁止：

- 不得修改 `Code/**`

Gemini 交付：

- JSON 必须包含 5 个模板：
  - `content-download`
  - `job-application`
  - `nps-survey`
  - `lead-capture`
  - `event-registration`
- 每个模板包含：
  - `faqEn`
  - `faqZh`
  - `ctaMicrocopyEn`
  - `ctaMicrocopyZh`
  - `internalLinks`
  - `targetKeywords`
  - `observationFreezeRequired`

Mike 工作：

- 人工确认文案是否符合产品事实。
- 标记最想优先落地的 2 个模板。

验收：

- Codex 恢复后可以直接把 JSON 内容映射到代码实现，不需要重新让 Gemini 整理。

### T4：外部目录与社区推广执行包

来源：

- `directory_submission_pack.md`
- `PROPOSED-2026-006-006`

权限：

- `REPORT_ONLY`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/external-discovery-action-pack-2026-06-07.md`
- 必须包含：
  - 今日最适合 Mike 执行的 3 个外部动作
  - 每个动作的目标网站/社区
  - URL
  - 提交文案
  - UTM 链接
  - 分类建议
  - 风险提示
  - 是否需要账号
  - 是否建议今天执行

要求：

- Reddit / Indie Hackers 相关内容必须强调先看版规，避免垃圾推广。
- 工具目录提交必须使用低调、真实、不夸大的文案。

Mike 工作：

- 今天至少执行 1 个外部目录提交或社区低风险动作。
- 截图或记录提交结果。

验收：

- 至少 1 个外部发现动作进入真实执行。

### T5：GSC / GA4 今日数据采集与解读说明

权限：

- `REPORT_ONLY`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/gsc-ga4-data-request-and-analysis-plan-2026-06-07.md`
- 必须包含：
  - Mike 今天需要在 GSC 截哪些图
  - Mike 今天需要在 GA4 截哪些图
  - 每张图看什么指标
  - 如何判断是否继续发内容
  - 如何判断是否该优化某个页面
  - 哪些页面处于 3-7 天冻结期不能动

Mike 工作：

- 按清单提供截图或导出。

验收：

- 晚上能基于真实数据判断明天优先级，而不是凭感觉。

### T6：Codex 恢复后 Top 8 实现清单

权限：

- `REPORT_ONLY`
- 可使用 `CODE_READ_SCOPED` 只读查看：
  - `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
  - `/Users/mike/Documents/AIFactory/Code/components/forms/form-edit-manager.tsx`
  - `/Users/mike/Documents/AIFactory/Code/components/forms/form-runner.tsx`
  - `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
  - `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
  - `/Users/mike/Documents/AIFactory/Code/scripts/verify-production-seo.sh`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/codex-return-top-8-implementation-queue-2026-06-07.md`
- 必须包含：
  - Top 8 实现任务
  - 为什么重要
  - 关联目标
  - 风险等级
  - 需要修改的候选文件
  - 测试建议
  - 是否需要部署
  - 是否能延后

优先包含：

- GA4 P0 参数补强。
- 模板 FAQ 渲染。
- 模板 CTA microcopy。
- 模板/solution 内链实现。
- SEO Gate 增强。
- 首页激活路径增强。
- 发布后检查自动化。
- 外部目录 UTM 追踪检查。

验收：

- Codex 恢复后能直接按这份清单开工。

### T7：今日 Gemini 日结

权限：

- `REPORT_ONLY`

Gemini 交付：

- 写入：`ProjectDocs/AI-Team/reports/gemini/daily-summary-2026-06-07.md`
- 必须包含：
  - 今天完成了哪些生产可见动作。
  - 今天完成了哪些可发布准备动作。
  - Mike 完成了什么。
  - 哪些还没上线。
  - 哪些需要 Codex 恢复后复核。
  - 明天建议做什么。
  - 今日是否有 SEO 质量风险或安全风险。

## 今日禁令

- 不允许只写新的战略文档。
- 不允许只新增候选任务。
- 不允许发布未经事实核验的博客。
- 不允许修改代码。
- 不允许部署。
- 不允许提交 Git。
- 不允许读取认证、支付、账单、数据库迁移、secrets、生产脚本。

## 今日成功标准

今天结束时，必须能回答：

- 哪 1-2 篇文章已经可以发布或已经发布？
- Mike 今天要做哪 3 个动作？
- 哪些内容已经变成可复制到后台的生产材料？
- 哪些外部发现动作可以今天执行？
- Codex 恢复后前 8 个实现任务是什么？

如果这些问题答不上来，说明今天工作量仍然不饱和，或者没有围绕生产增长目标推进。
