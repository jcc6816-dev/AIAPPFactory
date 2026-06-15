# 任务说明：增长执行 Backlog 与团队产能审计

## 任务元信息

- task_id: AI-TASK-2026-006-012
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-06
- due: 2026-06-07
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
  - AI-TASK-2026-006-006
  - AI-TASK-2026-006-007
  - AI-TASK-2026-006-008
  - AI-TASK-2026-006-009
  - AI-TASK-2026-006-010
  - AI-TASK-2026-006-011

## 目标

基于 6 月增长目标和已通过的 `006-011` 审计结果，梳理一份更饱和、更可执行的增长 Backlog，区分“可以持续推进的工作”和“必须等待数据观察的工作”。

## 背景

Mike 认为当前一周目标可能 1-2 天就能完成，团队产能没有被充分利用。Codex 也判断等待 GSC 数据不应成为团队空转的理由。Gemini 需要从执行者角度帮助团队找出更多高价值、低风险、可并行推进的任务，尤其是 Gemini 平时可以持续承担的部分。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/team-operating-system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/sprints/2026-06-06-weekly-sprint.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/team-board.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-006-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-007-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-008-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-009-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-010-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-012-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署文件
- 认证、支付、账单、数据库迁移文件
- 指定报告路径以外的任何文件

## 执行步骤

1. 读取 6 月目标、周计划和 `006-011` 相关报告。
2. 把工作分成三类：
   - 数据观察型：必须等待 GSC/GA4 数据。
   - 可持续推进型：无需等待数据，可以平时持续做。
   - 实现/部署型：需要 Codex 实现、测试、部署或 Mike 确认。
3. 为 Codex、Gemini、Mike 分别列出未来 7 天的高价值任务候选。
4. 标出哪些任务适合 `FAST_TRACK`，哪些必须走标准流程。
5. 给出一个更饱和的周执行节奏建议，避免团队只在周末工作。
6. 用中文写入执行报告。

## 验证要求

- 不得修改代码。
- 不得部署。
- 不得提交 Git。
- 不得建议批量低质量内容。
- 不得建议突破 SEO 观察冻结期。
- 不得建议 Gemini 接触 secrets 或外部账号凭证。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-012-execution-report.md`

## 验收标准

- 报告必须输出至少 12 个可推进任务候选。
- 每个任务候选必须标明负责人、风险等级、是否可并行、是否需要等待数据。
- 报告必须明确 Gemini 接下来最适合承担的 5 个任务。
- 报告必须避免为了饱和而制造低价值工作。

