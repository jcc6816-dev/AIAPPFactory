# 候选任务卡片：P1 级 Google Forms 替代品对比 Solution 页面草稿设计

## 任务元信息

- proposed_id: PROPOSED-2026-006-005
- status: PROPOSED
- proposer: Gemini
- proposed_at: 2026-06-06
- suggested_assignee: Gemini
- suggested_reviewer: Codex
- priority: P1
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- source_task_or_evidence: low_competition_keyword_map.md (P2关键词: Google Forms alternative with AI)
- target_goal_or_milestone: goals/2026-06-growth-goals.md (里程碑3:第一批优化)

## 提案目标

围绕中/低竞争、高意图的关键词 `Google Forms alternative with AI`，设计一页高质量的解决方案对比（Solution）页面文案与结构大纲草稿（英文，建议 slug: `google-forms-alternative-ai`），用于吸引并转化那些觉得 Google Forms 太丑、交互单一、不支持 AI 生成和即时自动化的泛表单搜索用户。

## 背景与证据

- 发现来源：在低竞争关键词清单中，`Google Forms alternative with AI` 被列为重点承接对比的流量方向。
- 相关页面或文档：`ProjectDocs/Operations/low_competition_keyword_map.md`。
- 影响：提供一个强有力的横向对比，重点突出 GenForms 的 “AI一句话生成”、“精致单题流体验” 和 “自动多次重试 Webhook” 特性，帮助寻找替代品的用户快速决策并创建表单。
- 如果不做的风险：流失这部分意图极为明确、极易转化为免费和付费用户的泛表单工具升级流量。

## 建议读取范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`

## 建议允许修改范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/PROPOSED-2026-006-005-execution-report.md`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 对比 Google Forms 与 GenForms 核心物理差异（颜值低 vs 拟真精美、长表单 vs 单题流、无自动推送 vs 支持 Webhook 重试日志）。
2. 设计对比页面首屏 H1、横向核心对比表格大纲。
3. 撰写页面英文正文和 SEO Metadata。
4. 设定清晰的 CTA，引导用户直接开始 AI 创建。
5. 将中文执行报告写入指定路径。

## 建议验证方式

- 检查页面内容是否遵守 Google 结构化数据与对比规则，不包含任何对竞品的虚假负面捏造，保持客观真实。

## 风险等级

- 低：内容设计，不触碰业务代码。

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
