# 任务说明：P0 增长博客英文草稿包

## 任务元信息

- task_id: AI-TASK-2026-006-014
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-06
- due: 2026-06-08
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
  - AI-TASK-2026-006-006
  - AI-TASK-2026-006-013
- observation_pages:
  - `/posts/form-builder-with-webhook`
  - `/en/posts/feishu-dingtalk-webhook-notification`
  - `/solutions/lead-magnet-download-form`

## 目标

请 Gemini 基于已通过复核的 SEO 选题优先级，产出 2 篇英文博客草稿方案，服务 GenForms.ai 的高意图搜索流量增长。

本任务不是直接发布文章，而是产出可供 Codex 和 Mike 审核、修改、再发布的内容草稿包。

## 背景

6 月增长目标已进入 `ACTIVE`。当前最重要的内容方向不是泛泛写 “AI form builder”，而是围绕低竞争、高意图、可转化的工作流主题建立内容资产。

优先主题来自 `AI-TASK-2026-006-006`：

- Webhook logs and retries for form automation
- Best AI form builders for lead capture automation
- Waitlist form demand validation
- QR code forms for offline data collection
- Beta feedback form template

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-006-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-006-review-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-014-execution-report.md`

## 禁止触碰的文件和动作

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- Git commit
- 生产部署
- secrets、tokens、cookies、API keys
- 不得把文章直接发布到 GenForms 后台

## 执行步骤

1. 读取指定文件，确认已通过的 SEO 规则和选题方向。
2. 从候选主题中选择 2 个最适合本周推进的英文博客主题。
3. 为每篇文章输出：
   - 推荐 slug
   - SEO title
   - meta description
   - primary keyword
   - secondary keywords
   - search intent
   - target reader
   - outline
   - 800-1200 字英文正文草稿
   - 内链建议，至少链接到 1 个模板页、1 个 solution/use-case 页和 1 篇相关文章
   - CTA 文案，必须指向真实可用的 GenForms 创建或模板路径
   - 结构化数据建议
   - 质量风险自检
4. 明确说明哪些内容不能发布前直接使用，需要 Codex 或 Mike 审核。
5. 将中文执行报告写入指定路径。英文正文草稿可以放在中文报告内。

## 验证要求

- 不要修改代码。
- 不要部署。
- 不要提交 Git。
- 不要访问数据库或外部账号。
- 不得虚构评分、客户案例、产品能力或发布日期。
- 不得制造相似词堆砌的 doorway 页面。
- 报告必须使用中文，英文草稿正文除外。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-014-execution-report.md`

## 验收标准

- 输出 2 篇可审核的英文博客草稿方案。
- 每篇文章都有明确搜索意图和商业转化路径。
- 每篇文章符合 Google SEO 质量规则。
- 不包含虚假事实、虚假客户案例、虚假评分或夸大能力。
- 结论可被 Codex 复核，并可进入后台发布前审稿流程。
