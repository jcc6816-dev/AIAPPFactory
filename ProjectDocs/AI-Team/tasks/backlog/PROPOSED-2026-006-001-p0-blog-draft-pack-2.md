# 候选任务卡片：P0 级第二批英文博客草稿包

## 任务元信息

- proposed_id: PROPOSED-2026-006-001
- status: PROPOSED
- proposer: Gemini
- proposed_at: 2026-06-06
- suggested_assignee: Gemini
- suggested_reviewer: Codex
- priority: P0
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- source_task_or_evidence: AI-TASK-2026-006-006 (SEO选题审计结果)
- target_goal_or_milestone: goals/2026-06-growth-goals.md (里程碑3:第一批优化)

## 提案目标

围绕低竞争、高意图的即时通讯群组表单通知场景（如 `Feishu form notification` 与 `DingTalk form webhook`），撰写 1 篇高质量的英文博客文章草稿（字数约 800-1200 字），帮助技术运营与团队管理员实现表单数据实时同步。

## 背景与证据

- 发现来源：在低竞争关键词清单（low_competition_keyword_map.md）中，`Feishu form notification` 和 `DingTalk form webhook` 均被定义为第一优先级（P0）的低竞争词。
- 相关页面或文档：`ProjectDocs/Operations/low_competition_keyword_map.md`。
- 影响：利用 MVP 现成支持的“飞书/钉钉 webhook 推送”特色功能，形成流量至产品的自然激活路径。
- 如果不做的风险：流失这部分极易转化为活跃用户的开发者与团队协作流量。

## 建议读取范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md`

## 建议允许修改范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/PROPOSED-2026-006-001-execution-report.md`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 读取运营文档，确认与飞书/钉钉推送相关的产品落点和术语。
2. 撰写 1 篇 800-1200 字的英文正文草稿（建议 slug: `send-form-submissions-feishu-dingtalk`）。
3. 为草稿设计推广元数据（SEO 标题、描述、关键词、内链、CTA、大纲与 FAQ）。
4. 对文章进行 Google SEO 质量规则（无 doorway 页面、无虚构夸大、内容高度有用）自查。
5. 将中文执行报告写入指定路径。

## 建议验证方式

- 检查文章的 Slug、内链（指向 /templates/contact-us）和 CTA（指向 /use-cases/feishu-dingtalk-form-notifications）是否准确。
- 确保内容与 GenForms 当前飞书/钉钉预设的 Webhook 能力一致（最多尝试 4 次，包含日志诊断）。

## 风险等级

- 低：不涉及代码修改，纯内容草稿，经人工审核后方可上线。

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
