# 决策记录：Backlog 自主提案与 Codex Token 受限兜底机制

## 日期

2026-06-06

## 背景

6 月增长目标进入 `ACTIVE` 后，团队需要提高吞吐。Mike 反馈 Codex 一周 token 限制可能影响持续复核，希望在 Codex 受限时仍能由 Mike + Gemini 推进每日或每周目标。

Gemini 建议：

- Gemini 可以自主发现系统 Gap，并生成候选任务卡片。
- 候选任务写入 `ProjectDocs/AI-Team/tasks/backlog/`。
- Gemini 只能提案，不能自发激活、自发执行或自评通过。
- Codex 只做复核与精准实现，比 Codex 从零探索更省 token。

## 决策

采纳该建议，但加上硬边界：

1. Gemini 可以创建 `PROPOSED` 候选任务卡片。
2. 候选任务必须写入 `ProjectDocs/AI-Team/tasks/backlog/`。
3. 候选任务不能自动进入 `ASSIGNED`。
4. 候选任务必须由 Codex 或 Mike 审阅后，才能改写为正式 active task。
5. Gemini 不得执行自己刚提出但未激活的候选任务。
6. Gemini 不得把候选任务标记为通过。
7. Codex token 受限时，Mike 可以临时激活低风险 `REPORT_ONLY` 或文档型任务。
8. Mike 临时激活不能覆盖代码实现、生产部署、数据库、认证、支付、secrets、账单、生产脚本等高风险任务。
9. 若 Mike 临时复核了低风险任务，后续 Codex 恢复后应补充复核记录或决策记录。

## 原因

这个机制可以让 Gemini 承担更多发现、拆解、草稿和审计工作，同时保留任务激活闸门，避免 AI 自我循环、刷任务或扩大权限。

## 后续动作

- 更新 `protocol.md`。
- 新增 `templates/proposed-task-card.md`。
- 新增 `tasks/backlog/` 候选队列。
- 在 `AI-TASK-2026-006-012` 后续 Backlog 扩容中试点。
