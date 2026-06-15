# 任务说明：GA4 Event Taxonomy Audit

## 任务元信息

- task_id: AI-TASK-2026-006-008
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: within 1-2 days
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审计当前增长事件埋点设计，判断是否足以支持“流量来源 -> 点击创建 -> 注册 -> 创建/发布表单”的增长复盘。

## 背景

Mike 反馈 GA4 目前事件还少，且还没有点击。我们需要确认代码侧事件命名、参数、漏斗含义是否清晰，后续才能判断流量增长是否有效。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/codex_seo_operations_tracker.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_analytics_setup_guide.md`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-008-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- production deployment scripts
- payment/auth/billing/database files

## 执行步骤

1. 阅读增长事件相关代码和 GA4 指南。
2. 列出当前已能看到或应能上报的事件名称。
3. 判断每个事件是否有足够参数支持来源归因。
4. 找出 3-5 个缺口或命名不清的地方。
5. 给出一版推荐事件字典，但不要修改代码。
6. 输出中文报告。

## 验证要求

- 不要编造 GA4 后台真实数据。
- 只能基于代码和文档判断事件设计。
- 不要修改代码。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-008-execution-report.md`

## 验收标准

- 报告列出当前事件与推荐事件。
- 报告指出漏斗追踪缺口。
- 建议能支持后续 Codex 低风险实现。

