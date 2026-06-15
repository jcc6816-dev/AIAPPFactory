# 任务说明：团队目标共识审计

## 任务元信息

- task_id: AI-TASK-2026-006-011
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-06
- due: 2026-06-07
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审阅新的 AI-Team 操作系统和 6 月增长目标草案，并输出中文可行性与目标共识报告。

## 背景

Mike 指出团队目标不能只是 Codex 单方面写出，而必须获得团队成员认可。Codex 已创建团队操作系统和 6 月增长目标草案，但目标在 Mike、Codex 和 Gemini 认可前不能进入 `ACTIVE`。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/team-operating-system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/sprints/2026-06-06-weekly-sprint.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_growth_operating_guideline.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-011-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署文件
- 认证、支付、账单、数据库迁移文件
- 指定报告路径以外的任何文件

## 执行步骤

1. 读取上面列出的文件。
2. 判断团队操作系统对 Gemini 是否清晰、可执行。
3. 判断 6 月增长目标是否现实、可衡量，并符合 GenForms.ai 当前阶段。
4. 找出正式激活前需要修改的目标措辞、里程碑、指标或责任边界。
5. 明确说明 Gemini 是否认可目标可执行，或是否要求修改后再认可。
6. 用中文写入执行报告。

## 验证要求

- 不得修改代码或项目文档。
- 不得部署或提交。
- 不得访问 secrets、数据库或生产系统。
- 报告必须明确写出以下结论之一：
  - `认可目标，可以执行`
  - `需要修改后再认可`
  - `无法认可，并说明原因`

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-011-execution-report.md`

## 验收标准

- 报告必须中文。
- 报告包含范围检查、可行性检查、风险和建议修改点。
- 报告明确写出 Gemini 的认可状态。
- 报告不包含 secrets 或无关实现内容。
