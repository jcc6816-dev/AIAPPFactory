# 任务说明模板

## 任务元信息

- task_id:
- status:
- assignee:
- reviewer:
- priority:
- created_at:
- due:
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
- observation_pages:

## 目标

用 1-2 句话说明本任务要达成什么结果。

## 背景

说明为什么要做这个任务，以及它服务哪个目标、里程碑或周计划。

## 需要读取的文件

- `/absolute/path`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/<task-id>-execution-report.md`

## 禁止触碰的文件和动作

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- Git commit
- 生产部署
- secrets、tokens、cookies、API keys

## 执行步骤

1. 读取任务允许的文件。
2. 按任务目标完成审计、调研、草稿或分析。
3. 明确列出发现、判断、风险和后续建议。
4. 将中文执行报告写入指定路径。

## 验证要求

- 不要修改代码。
- 不要部署。
- 不要提交 Git。
- 不要访问任务未授权的数据。
- 报告必须使用中文。

## 报告路径

请将执行报告写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/<task-id>-execution-report.md`

## 验收标准

- 报告完整回答任务目标。
- 结论可被 Codex 复核。
- 建议具体、可执行、不过度扩大范围。
- 不包含 secrets 或敏感数据。

