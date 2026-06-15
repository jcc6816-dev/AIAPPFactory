# 候选任务卡片模板

## 任务元信息

- proposed_id:
- status: PROPOSED
- proposer:
- proposed_at:
- suggested_assignee:
- suggested_reviewer:
- priority:
- permission_level:
- code_modification_allowed:
- source_task_or_evidence:
- target_goal_or_milestone:

## 提案目标

说明这个候选任务要解决什么问题，以及为什么值得进入 Backlog。

## 背景与证据

- 发现来源：
- 相关页面或文档：
- 影响：
- 如果不做的风险：

## 建议读取范围

- `/absolute/path`

## 建议允许修改范围

- `/absolute/path`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 
2. 
3. 

## 建议验证方式

- 

## 风险等级

- 低 / 中 / 高：
- 风险说明：

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
