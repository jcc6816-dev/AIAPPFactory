# 任务说明：待发布博客 SEO 审计

## 任务元信息

- task_id: AI-TASK-2026-006-001
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-06
- due: 当天完成优先
- permission_level: DB_READ_SANITIZED
- language: zh-CN

## 目标

审计后台当前两篇待发布博客草稿，判断它们从 SEO 质量角度是否可以发布。

## 背景

GenForms.ai 正处于 SEO 增长阶段。团队需要发布少量高质量、高意图文章，而不是批量发布低价值内容。Codex 已初步确认这两篇文章不是薄内容，且内链可访问，但仍需要 Gemini 独立审计内容质量、搜索意图和风险。

草稿 slug：

- `waitlist-form-demand-validation`
- `qr-code-forms-offline-data-collection`

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/blog_content_agent_playbook.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`

## 允许读取的数据

本任务允许按 `DB_READ_SANITIZED` 规则读取 `posts` 表中指定草稿。

允许范围：

- 表：`posts`
- 字段：`title`、`slug`、`locale`、`status`、`description`、`content`
- 过滤条件：`slug in (waitlist-form-demand-validation, qr-code-forms-offline-data-collection)`

禁止范围：

- `users`
- `orders`
- `credits`
- `billing`
- `auth/session/account`
- `form submissions`
- `webhook logs`
- `webhook secrets/tokens`
- `api keys`
- 未列出的任何表或字段

不得请求或输出 secrets、API keys、连接串、cookies、tokens 或完整 `.env*` 内容。

如需临时脚本，只能放在：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/`

不得在 `Code/**` 下创建或修改脚本。

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-001-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件

## 执行步骤

1. 读取 AI-Team 协议和 Google SEO 质量规则。
2. 如有必要，只读取任务允许的 `posts` 表字段。
3. 分别审计两篇草稿：
   - 搜索意图是否清晰。
   - 内容是否有真实信息增益。
   - 是否夸大产品能力。
   - 是否存在重复或主题互相吞噬。
   - 内链和 CTA 是否合理。
   - title 和 description 是否清晰。
4. 给每篇文章一个发布建议：
   - `publish_now`
   - `publish_after_minor_edit`
   - `hold`
5. 如果需要修改，写出具体建议。
6. 用中文写入执行报告。

## 验证要求

- 必须说明哪些 SEO 质量规则影响了判断。
- 必须说明是否读取了后台或生产数据。
- 不得修改文章本身。
- 报告必须中文。
- 如使用 `DB_READ_SANITIZED`，必须列出数据来源、读取表、读取字段、过滤条件，并确认未输出 secrets。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-001-execution-report.md`

## 验收标准

- 报告给出两篇文章的明确发布结论。
- 报告说明风险和建议发布顺序。
- 未获得生产访问时，不得声称已访问生产。
- 如使用数据库内容，必须遵守 `DB_READ_SANITIZED`。
- 报告必须中文。

