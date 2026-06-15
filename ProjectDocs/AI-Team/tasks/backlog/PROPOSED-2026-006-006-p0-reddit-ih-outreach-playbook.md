# 候选任务卡片：P0 级外部推广 Reddit 与 Indie Hackers 引流回复规范设计

## 任务元信息

- proposed_id: PROPOSED-2026-006-006
- status: PROPOSED
- proposer: Gemini
- proposed_at: 2026-06-06
- suggested_assignee: Gemini
- suggested_reviewer: Codex
- priority: P0
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- source_task_or_evidence: goals/2026-06-growth-goals.md (工作流F:团队产能利用)
- target_goal_or_milestone: goals/2026-06-growth-goals.md (阶段2:发布与外链)

## 提案目标

针对 Reddit 和 Indie Hackers 上关于 `Typeform alternative`、`webhook form logs` 等高关联度提问贴，设计一份高转化、非垃圾（non-spam）、注重解决问题的引流回复话术规范与模板草案，协助 Mike 进行高效、精准的外部社区曝光与高质量外链搭建。

## 背景与证据

- 发现来源：在 `genforms_traffic_growth_plan.md` 的“阶段2”中，Reddit、Indie Hackers 和 LinkedIn 的回复被定义为积累初始流量与外链的重要手段，强调“以真正解决问题为主”。
- 相关页面或文档：`ProjectDocs/Operations/genforms_traffic_growth_plan.md`。
- 影响：提供合规引流的标准脚本（例如如何在不被版主删贴的前提下插入 GenForms 链接），降低 Mike 在外部推广时的心理和操作门槛，提高外链转化率。
- 如果不做的风险：盲目在 Reddit 贴链接容易被封号或判定为垃圾信息（Spam），产生严重的品牌负面声誉。

## 建议读取范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`

## 建议允许修改范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/PROPOSED-2026-006-006-execution-report.md`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 审计 Reddit（如 r/SaaS, r/indiehackers, r/nocode）对推广贴和引流链接的版规容忍度。
2. 设计 “痛点解答 ➔ 场景对照 ➔ 免费工具推荐（引入 GenForms） ➔ 利益点呈现” 的四步法回复框架。
3. 产出针对 3 个典型场景（Typeform 嫌贵、Webhook 投递失败需要日志、Indie Hacker 急需建 Waitlist）的英文回复模板草稿。
4. 整理 Mike 外部推广时的防封号自查清单。
5. 将中文执行报告写入指定路径。

## 建议验证方式

- 检查话术草稿是否具备高实用性，是否能够自然插入 GenForms 的 UTM 跟踪链接。

## 风险等级

- 低：纯外部营销话术，零代码风险。

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
