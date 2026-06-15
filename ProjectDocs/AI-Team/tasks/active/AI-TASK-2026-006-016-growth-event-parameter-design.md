# 任务说明：Growth / GA4 关键事件参数补强设计

## 任务元信息

- task_id: AI-TASK-2026-006-016
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: 2026-06-08
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
  - AI-TASK-2026-006-008
  - AI-TASK-2026-006-013
- observation_pages:
  - homepage
  - template detail pages
  - blog detail pages
  - form creation flow
  - publish flow

## 目标

请 Gemini 基于已通过复核的 GA4 / Growth 事件审计，设计第一批关键事件参数补强方案，为 Codex 后续实现埋点提供清晰输入。

## 背景

当前流量增长不只看曝光，还要看访客是否进入创建、注册、发布和提交链路。`AI-TASK-2026-006-008` 已发现若干缺口，例如注册、发布、公开表单提交、澄清问答和 checkout 链路参数不足。本任务只做设计，不改代码。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-008-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-008-review-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/roadmap/2026-06-growth-execution-capacity-plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-016-execution-report.md`

## 禁止触碰的文件和动作

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- Git commit
- 生产部署
- secrets、tokens、cookies、API keys
- 不得访问 GA4 后台或外部账号

## 执行步骤

1. 读取指定报告和增长计划。
2. 列出第一批最重要的 5-8 个事件。
3. 对每个事件定义：
   - event_name
   - 触发时机
   - 必填参数
   - 可选参数
   - 参数示例
   - 是否适合作为转化事件
   - 是否涉及隐私或敏感数据风险
4. 明确哪些事件本周必须优先实现，哪些可以延后。
5. 给 Codex 一份实现注意事项，包括不应采集的字段。
6. 将中文执行报告写入指定路径。

## 验证要求

- 不要修改代码。
- 不要部署。
- 不要提交 Git。
- 不要访问 GA4、数据库或外部账号。
- 不得建议采集用户隐私、表单提交明文内容、邮箱、手机号等敏感字段。
- 报告必须使用中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-016-execution-report.md`

## 验收标准

- 至少定义 5 个关键事件。
- 每个事件具备触发时机和参数设计。
- 明确本周优先级。
- 明确隐私边界。
- 输出能被 Codex 转为代码实现任务。
