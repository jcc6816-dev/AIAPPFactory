# 任务说明：高曝光低点击页面 SERP 点击救援包

## Metadata

- task_id: AI-TASK-2026-006-032
- title: 高曝光低点击页面 SERP 点击救援包
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-15
- priority: P0
- permission_level: REPORT_ONLY
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-032-execution-report.md`

## 背景

GSC 单日数据表明 GenForms.ai 的自然曝光主要由少数页面贡献，且点击为 0。当前阶段的目标不是盲目新增大量内容，而是让已有曝光页面更容易获得点击。

重点页面：

1. `https://genforms.ai/posts/feishu-dingtalk-webhook-notification`
2. `https://genforms.ai/posts/lark-feishu-form-webhook-bot`
3. `https://genforms.ai/posts/typeform-alternatives`
4. 可选观察：`https://genforms.ai/solutions/job-application-form-builder`
5. 可选观察：`https://genforms.ai/solutions/website-contact-form-template`

## 核心目标

为 3 个核心页面输出“克制、可信、可点击”的 SERP 救援包：

- title 建议；
- meta description 建议；
- 首屏 TL;DR 建议；
- 首屏 CTA 建议；
- 内链补强建议；
- 冻结观察周期。

## Allowed Files To Read

必须先读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_june_growth_battle_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_compliance_rules.md`

可读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-025-webhook-serp-ctr-optimization.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-025-execution-report.md`
- `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/blog-detail/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/posts/[slug]/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/solutions/[slug]/page.tsx`

可以只读访问上述公开 URL 的生产 HTML。

## Allowed Files To Modify

只允许写报告：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-032-execution-report.md`

不得修改代码、数据库、后台文章、脚本或 Git。

## 禁止事项

- 禁止标题党。
- 禁止承诺“免费”“5分钟”“官方集成”“无中间件”等未经页面事实支撑的卖点。
- 禁止大幅重写正文。
- 禁止修改 URL、canonical、发布日期、结构化数据主体。
- 禁止把 `form_generate` 或付费转化能力写成已经被数据证明的结果。

## 输出要求

报告必须中文，按页面逐项输出：

1. 当前页面搜索意图判断。
2. 当前点击问题假设。
3. 建议 title：
   - 保守版；
   - 稍强转化版。
4. 建议 meta description：
   - 保守版；
   - 稍强转化版。
5. 建议首屏 TL;DR 或第一段微调。
6. 建议 CTA。
7. 建议内链：
   - 链到哪个 template；
   - 链到哪个 solution；
   - 链到哪个 related blog。
8. 风险与观察周期。
9. 给 Codex 的复核摘要。

## 验收目标

- 产出可以由 Codex/Mike 审核后直接写入后台或脚本的 SERP 文案。
- 每个建议都克制、可信、符合 Google SEO 质量规则。
- 明确哪些改动属于“小幅 CTR 优化”，哪些属于“应冻结观察”。
