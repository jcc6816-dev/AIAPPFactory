# Codex 低可用模式协作手册

## 适用场景

当 Codex 因 token、上下文或时间限制，预计 1 天以上无法持续复核和实现时，Mike 与 Gemini 按本手册推进工作。

当前适用窗口：

- 预计 5 天左右。
- 目标仍以 `2026-06-growth-goals.md` 的 `ACTIVE` 增长目标为准。

## 核心原则

1. 不停工，但不越权。
2. Gemini 多做提案、审计、草稿、检查和低风险内容准备。
3. Mike 只做激活、发布、外部账号动作和低风险人工复核。
4. 高风险代码、部署、数据库、认证、支付、secrets、生产脚本必须等 Codex。
5. 所有动作必须留在 AI-Team 文件系统里，方便 Codex 恢复后追溯。

## Gemini 可以继续做的工作

### 1. 返工任务

优先完成已有 `REVIEW_REJECTED` 的任务：

- `AI-TASK-2026-006-014`

要求：

- 按 Codex 复核报告修正。
- 不新增未授权代码读取。
- 不直接发布到后台。

### 2. 候选任务提案

Gemini 可以把新发现的增长任务写入：

```text
ProjectDocs/AI-Team/tasks/backlog/
```

状态必须是：

```text
PROPOSED
```

必须使用模板：

```text
ProjectDocs/AI-Team/templates/proposed-task-card.md
```

Gemini 不能自行激活、执行或标记通过。

### 3. 低风险审计与草稿

Mike 可以临时激活以下类型任务：

- SEO 内容草稿。
- 博客质量审计。
- 模板页 CTA / FAQ / 内链审计。
- GSC 数据解读。
- 目录提交材料审计。
- ProductHunt / 外部发布材料草稿。
- Growth / GA4 事件方案设计。
- 用户行动清单更新。

建议权限：

- `REPORT_ONLY`
- `CODE_READ_SCOPED`
- `CONTENT_WRITE_SCOPED`，仅限 AI-Team 文档或内容草稿。
- `SANDBOX_VERIFY`，仅限明确列出的只读脚本。

## Mike 可以临时批准的范围

Mike 可以临时批准：

- `PROPOSED` 候选任务进入 `ASSIGNED`。
- 低风险 `REPORT_ONLY` 审计任务。
- 明确列出具体文件的 `CODE_READ_SCOPED` 任务。
- AI-Team 文档、报告、候选任务卡片等 `CONTENT_WRITE_SCOPED` 任务。
- GSC / GA4 / 后台中需要人工账号操作的数据导出或截图。

Mike 不应批准：

- 生产部署。
- Git commit。
- 数据库迁移。
- 认证、支付、账单相关修改。
- `.env*`、secrets、tokens、cookies。
- 用户数据、订单数据、表单提交明文、Webhook secrets。
- 泛目录 `Code/**` 读取或写入。

## 临时激活任务格式

如果 Mike 决定把 Gemini 的候选任务激活，应在任务文件或看板备注里写：

```text
临时激活人：Mike
临时激活原因：Codex 低可用；任务为低风险 REPORT_ONLY / CODE_READ_SCOPED。
后续要求：Codex 恢复后补充复核。
```

## 每日节奏

### 每天开始

1. Gemini 读取：
   - `protocol.md`
   - `team-board.md`
   - `goals/2026-06-growth-goals.md`
   - 本手册
2. Mike 告诉 Gemini 当天可处理的外部数据，例如 GSC 曝光、点击、Top 查询词。
3. Gemini 选择 1-2 个低风险任务推进，或提出 `PROPOSED` 候选任务。

### 每天结束

Gemini 写一份简短日结到：

```text
ProjectDocs/AI-Team/reports/gemini/
```

建议文件名：

```text
daily-summary-YYYY-MM-DD.md
```

日结必须包含：

- 今天完成了什么。
- 哪些任务需要 Mike 决策。
- 哪些任务需要 Codex 恢复后复核。
- 是否有安全或 SEO 质量风险。
- 明天建议做什么。

## 5 天窗口建议目标

在 Codex 低可用期间，Mike + Gemini 应争取完成：

1. 修正并重新提交 `AI-TASK-2026-006-014`。
2. 产出 5-10 个 `PROPOSED` 候选任务。
3. 完成 2-4 篇博客或外部材料草稿，但不直接发布。
4. 完成 1-2 轮 GSC 数据解读。
5. 完成模板页或 solution 页的低风险优化建议清单。
6. 形成一份 Codex 恢复后的优先复核清单。

## 生产增长冲刺计划

Codex 低可用期间的具体每日生产推进计划见：

```text
ProjectDocs/AI-Team/sprints/2026-06-07-codex-limited-production-growth-sprint.md
```

该计划优先于泛泛的候选任务扩容。每天必须至少有一个生产可见动作，或一个可由 Mike 当天发布的生产准备动作。

## 满负荷工作包

当 Mike 认为当天还有充足时间，需要 Gemini 持续高强度推进时，使用：

```text
ProjectDocs/AI-Team/sprints/2026-06-07-gemini-full-day-production-work-pack.md
```

该工作包按 6-8 小时 Gemini 等效工作量设计，优先产出可发布内容、可执行外部动作、数据检查清单和 Codex 恢复后的实现队列。

## Codex 恢复后的第一件事

Codex 恢复后先看：

1. `team-board.md`
2. `tasks/backlog/`
3. 最近 5 天的 `daily-summary-*.md`
4. 所有 `REVIEW_REJECTED` 和 Mike 临时激活任务

然后做三件事：

1. 复核 Gemini 输出。
2. 把高价值候选任务转成正式实现任务。
3. 清理不值得推进的候选任务，避免 Backlog 膨胀。
