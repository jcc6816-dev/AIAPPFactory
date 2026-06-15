# 任务说明：Gemini 每日执行例程机制验证与固化

## 任务元信息

- task_id: AI-TASK-2026-006-029
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-15
- due: 下次 Gemini 开工时（立即生效）
- permission_level: REPORT_ONLY
- language: zh-CN
- 关联机制文件: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_DAILY_EXECUTION_ROUTINE.md`

## 背景

Mike 已明确要求调整 Gemini 的工作机制：

1. Gemini 不再重复做 Codex 的全量增长经营巡检。
2. Gemini 每次开工前执行轻量启动检查（读取两个文件，确认上下文）。
3. 有指派任务 → 直接执行；无指派任务 → 提 1–3 个候选，等 Codex / Mike 确认。
4. 禁止在没有明确指令时自行拉取 GSC / GA4 / PageSpeed 数据做全站分析。

`GEMINI_DAILY_EXECUTION_ROUTINE.md` 已于 2026-06-15 创建，需要通过本任务正式落地验证，确认：
- 流程文件是否有歧义或遗漏；
- 与 `GEMINI_START_HERE.md` / `AI_EXECUTION_CHECKLIST.md` / `AGENTS.md` 是否存在冲突；
- 是否需要同步更新 `team-board.md` 中 Gemini 的职责描述。

## 目标

1. 按 `GEMINI_DAILY_EXECUTION_ROUTINE.md` 规定的开工流程，完整执行一次启动检查（读取两个文件）。
2. 对照以下四个文件，检查是否存在表述冲突或逻辑矛盾：
   - `AGENTS.md`
   - `AI_EXECUTION_CHECKLIST.md`
   - `GEMINI_START_HERE.md`
   - `ProjectDocs/AI-Team/protocol.md`
3. 检查 `team-board.md` 中 Gemini 的职责描述是否需要同步更新。
4. 如发现冲突或遗漏，输出具体修改建议（不直接修改，由 Codex 批准后再改）。

## 需要读取的文件

```
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_DAILY_EXECUTION_ROUTINE.md
/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md
/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md
/Users/mike/Documents/AIFactory/AGENTS.md
/Users/mike/Documents/AIFactory/AI_EXECUTION_CHECKLIST.md
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/team-board.md
```

## 允许修改的文件

```
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-029-execution-report.md
```

（报告文件由 Gemini 新建写入，其他文件均不允许在本任务中直接修改）

## 禁止触碰的文件

- `.env*`
- `Code/**`
- `WorkBuddy/**`
- 生产部署文件
- 支付 / 认证 / 数据库迁移文件

## 执行步骤

### STEP 1：执行一次标准启动检查

按 `GEMINI_DAILY_EXECUTION_ROUTINE.md` 第一步的要求，读取以下两个文件并提炼：

- `growth_data_operating_system.md`：当前项目总目标、四条主线状态描述
- `user_action_tracker.md`：Mike 当前待办事项、是否有指派任务待执行

记录：读取了哪些内容、识别到哪些当前状态。

### STEP 2：检查机制文件内部一致性

对照 `AGENTS.md`、`AI_EXECUTION_CHECKLIST.md`、`GEMINI_START_HERE.md`、`protocol.md`，逐项检查：

- `GEMINI_DAILY_EXECUTION_ROUTINE.md` 中的禁止行为是否与其他文件的要求一致；
- 四条主线定义是否与 `GEMINI_START_HERE.md` 一致；
- 任务复杂度判断标准是否与 `AGENTS.md` 三步法对齐；
- 执行报告格式是否与 `protocol.md` 中的要求对齐。

### STEP 3：检查 team-board.md

读取 `team-board.md` 中 Gemini 的职责描述，判断是否需要更新以反映新的执行例程规则。如需更新，在报告中写出建议的具体修改文案（不直接修改文件）。

### STEP 4：输出候选任务（基于启动检查结果）

基于 STEP 1 的上下文确认结果，按 `GEMINI_DAILY_EXECUTION_ROUTINE.md` 第四步格式，提出 1–3 个候选执行任务，等待 Codex / Mike 确认。

## 报告路径

```
/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-029-execution-report.md
```

## 验收标准（供 Codex 复核）

- [ ] 启动检查流程被完整执行了一次（有记录）
- [ ] 识别出的冲突或遗漏有具体条目（如无冲突，明确说明"已检查，无冲突"）
- [ ] team-board.md 是否需要更新有明确结论
- [ ] 候选任务格式符合 `GEMINI_DAILY_EXECUTION_ROUTINE.md` 第四步要求
- [ ] 报告全程中文
- [ ] 没有主动修改任何机制文件

## 给 Codex 的预期复核重点

1. 候选任务是否合理（是否真正属于 Gemini 执行范围，而非 Codex 判断范围）；
2. 机制冲突检查结论是否准确；
3. team-board.md 修改建议是否可以批准；
4. 本任务完成后是否可以将 `GEMINI_DAILY_EXECUTION_ROUTINE.md` 标记为"稳定生效"状态。
