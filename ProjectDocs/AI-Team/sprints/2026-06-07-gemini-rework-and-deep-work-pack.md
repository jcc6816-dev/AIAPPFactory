# Gemini 返工与深度执行工作包 - 2026-06-07

## 工作包目标

本工作包用于替代“几分钟完成”的浅层总结式产出。Gemini 必须把前一轮 T1-T7 产物返工成可发布、可执行、可复核的高质量材料。

今日目标不是继续写策略，而是形成以下四类真实交付：

1. Mike 可直接在后台发布的博客字段包。
2. Mike 可执行或可判断的外部推广规则核验表。
3. Codex 恢复后可直接实现的、去重后的工程任务清单。
4. 与当前 MVP 能力完全一致的内容数据包。

预计工作量：

- Gemini：4-6 小时等效深度工作。
- Mike：1-2 小时发布、外部账号核验、GSC/GA4 数据提供。

## 必读文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/operations/codex-limited-mode-playbook.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/2026-06-07-gemini-full-day-work-pack-review.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/production-ready-post-webhook-logs-retries-2026-06-07.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/production-ready-post-ai-lead-capture-2026-06-07.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/codex-return-top-8-implementation-queue-2026-06-07.md`

## 允许读取的代码文件

本任务授权 `CODE_READ_SCOPED`，仅限读取以下文件：

- `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`
- `/Users/mike/Documents/AIFactory/Code/services/form-templates.ts`
- `/Users/mike/Documents/AIFactory/Code/services/solution-landing-pages.ts`
- `/Users/mike/Documents/AIFactory/Code/services/use-case-landing-pages.ts`
- `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts`
- `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts`

禁止读取：

- `.env*`
- 认证、支付、数据库迁移、生产部署脚本
- 任何用户隐私数据或 secrets

## 任务 R1：返工 Webhook 博客为后台发布字段包

输入：

- `production-ready-post-webhook-logs-retries-2026-06-07.md`
- Codex 复核报告

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/reworked-post-webhook-logs-retries-admin-payload-2026-06-07.md`

必须包含：

- slug
- title
- description
- excerpt
- tags
- category
- language
- canonical path
- full markdown body
- internal links list
- GSC request-index URL
- fact-check table

返工要求：

- 保留最多 4 次尝试、1s/5s/15s、5xx retry、generic HMAC signature 等事实。
- 区分 generic webhook signature 和飞书/钉钉机器人签名。
- 若无法确认控制台是否支持 manual retry button，必须使用保守表述。
- 删除所有绝对收益措辞，例如“确保不会丢失任何线索”。

## 任务 R2：返工 AI Lead Capture 博客，降低关键词竞争度

输入：

- `production-ready-post-ai-lead-capture-2026-06-07.md`
- Codex 复核报告

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/reworked-post-ai-lead-capture-admin-payload-2026-06-07.md`

要求：

- 标题从宽泛 `Best AI Form Builders...` 改为更低竞争长尾方向。
- 正文必须更贴近 GenForms 当前 MVP：prompt-to-form、single-question flow、template、publish/share、webhook。
- 不要把 GenForms 描述成已覆盖所有竞品高级能力。
- 添加“适合谁 / 不适合谁”段落，增强可信度。

## 任务 R3：修订模板 FAQ JSON，删除超出 MVP 的能力暗示

输入：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json`
- 允许读取的模板、solution、use-case 代码文件

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/template-faq-v2-fact-check-report-2026-06-07.md`

要求：

- 每条 FAQ 必须标记 `factStatus`：
  - `confirmed`
  - `conservative`
  - `needs_codex_or_mike_verification`
- 删除或降级以下不确定表述：
  - success page direct download link
  - limit seats
  - 已完整 ATS 对接
  - 未确认的自动邮件发送能力
- 保留用户价值，但用更诚实的产品语言表达。

## 任务 R4：重写 Codex 恢复后 Top 8 为真实排期

输入：

- `codex-return-top-8-implementation-queue-2026-06-07.md`
- Codex 复核报告
- 允许读取代码文件

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/codex-return-implementation-queue-v2-2026-06-07.md`

要求：

- 每项任务必须标记：
  - `needs_build`
  - `already_built_needs_verification`
  - `content_only`
  - `defer`
- 删除或降级已实现项：
  - sitemap 已遍历 solution/use-case 的任务，应改为生产验证。
  - template_used 参数补强已部分实现，应改为 payload/GA4 映射验证。
- 保留真正值得 Codex 做的 5-8 个工程任务。

## 任务 R5：外部推广当前规则核验表

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/external-discovery-rules-checklist-2026-06-07.md`

要求：

- 对 BetaList、Indie Hackers、AlternativeTo 分别列出：
  - 当前提交入口
  - 是否需要账号
  - 是否允许带链接
  - 是否需要截图或产品图
  - 是否免费
  - 审核周期是否明确
  - 是否有明显反推广规则
  - 推荐执行 / 暂缓 / 需要 Mike 判断
- 如果 Gemini 无法联网核验，必须明确写 `UNVERIFIED_CURRENT_RULES`，并把任务改成 Mike 手动核验清单，不能伪装成已核验。

## 任务 R6：新增两个高价值内容题材，不写水文

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/next-two-content-briefs-2026-06-07.md`

要求：

- 每个题材必须包含：
  - 目标关键词
  - 搜索意图
  - 为什么现在做
  - 对应已有页面或模板
  - 与已发布文章如何避免重复
  - 标题 3 个备选
  - H2 大纲
  - 内链计划
  - 不应宣传的未实现能力
- 优先围绕：
  - QR code form builder
  - webhook form builder retry logs
  - lead magnet download form
  - Google Forms alternative with AI

## 最终日报

输出文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/daily-summary-2026-06-07-rework.md`

日报必须包含：

- 哪些内容 Mike 可以今天发布。
- 哪些内容只能作为草稿。
- 哪些需要 Codex 恢复后实现。
- 哪些需要 Mike 外部账号操作。
- 剩余风险，禁止写“风险无”。

## 完成标准

本工作包只有在以下条件满足时才算完成：

- 不是只列文件名，而是每个输出文件都有可执行内容。
- 每个可发布内容都有后台字段级 payload。
- 每个事实性主张都有确认来源或保守标记。
- 每个外部动作都明确当前规则是否已核验。
- 每个 Codex 实现项都去掉已实现/重复项。
