# 候选任务卡片：P1 级 QR 码表单 Solution 页面草稿设计

## 任务元信息

- proposed_id: PROPOSED-2026-006-003
- status: PROPOSED
- proposer: Gemini
- proposed_at: 2026-06-06
- suggested_assignee: Gemini
- suggested_reviewer: Codex
- priority: P1
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- source_task_or_evidence: low_competition_keyword_map.md (P0关键词: QR code form builder)
- target_goal_or_milestone: goals/2026-06-growth-goals.md (里程碑3:第一批优化)

## 提案目标

围绕低竞争关键词 `QR code form builder`，为 GenForms.ai 设计一页高质量的 Solution (解决方案) 页面内容与结构草稿（英文，建议 slug: `qr-code-forms-offline-data-collection`），用于承接线下活动扫码、现场问卷和门店扫码收集的高意图搜索流量。

## 背景与证据

- 发现来源：在低竞争关键词清单（low_competition_keyword_map.md）中，`QR code form builder` 属于 P0/P1 的重点获客方向，且在 015 审计中已被建议链接到 `/use-cases/qr-code-form-builder`。
- 相关页面或文档：`ProjectDocs/Operations/low_competition_keyword_map.md`。
- 影响：提供相比泛 AI 表单更契合“线下扫码填单”场景的专业方案介绍，通过首屏 CTA 直接引导访客生成带二维码的活动表单。
- 如果不做的风险：缺乏专用的线下场景 Solution 承接页，流失相关商业词检索流量。

## 建议读取范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`

## 建议允许修改范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/PROPOSED-2026-006-003-execution-report.md`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 确认线下扫码场景的用户核心诉求（如移动端适配度、纸质打印清晰度、提交确认页面）。
2. 规划页面首屏、核心痛点解析、GenForms 二维码创建步骤、特定 FAQ。
3. 撰写完整的英文页面草稿（包含标题、Description、页面文本）。
4. 设定清晰的 CTA，引导用户去 `/templates/event-registration` 并尝试生成。
5. 将中文执行报告写入指定路径。

## 建议验证方式

- 检查内容是否符合 Google SEO 质量合规，不涉及夸大未上线能力（如不支持的离线数据暂存），且结构化数据建议与内容一致。

## 风险等级

- 低：不涉及代码修改，纯内容草稿，经人工审核后方可上线。

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
