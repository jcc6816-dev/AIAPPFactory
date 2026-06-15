# 候选任务卡片：P1 级模板详情页专属 FAQ 配置文案包

## 任务元信息

- proposed_id: PROPOSED-2026-006-002
- status: PROPOSED
- proposer: Gemini
- proposed_at: 2026-06-06
- suggested_assignee: Gemini
- suggested_reviewer: Codex
- priority: P1
- permission_level: CONTENT_WRITE_SCOPED
- code_modification_allowed: false
- source_task_or_evidence: AI-TASK-2026-006-015 (模板详情页审计通过)
- target_goal_or_milestone: goals/2026-06-growth-goals.md (里程碑3:第一批优化)

## 提案目标

针对 `AI-TASK-2026-006-015` 中审计通过的 5 个重点模板详情页（`content-download`、`job-application`、`nps-survey`、`lead-capture`、`event-registration`），在指定只读或临时文案文件中输出其定制化 FAQ 的英文和中文 JSON/Markdown 文案包，为 Codex 后续的扩展与整合提供免处理、格式规范的内容输入。

## 背景与证据

- 发现来源：在 015 模板详情页审计中，发现详情页当前渲染的是全局通用 FAQ。Codex 复核通过了对这 5 个详情页设计场景 FAQ 的提议。
- 相关页面或文档：`ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-015-execution-report.md`。
- 影响：让 5 个高曝光模板详情页拥有高度有用的 SEO FAQ，提升搜索引擎富摘要（Rich Results）抓取关联与转化说服力。
- 如果不做的风险：页面停留时间短，或因为 FAQ 信息泛化导致跳出率偏高。

## 建议读取范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-015-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`

## 建议允许修改范围

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json`

## 建议禁止触碰范围

- `.env*`
- `WorkBuddy/**`
- `Code/**`，除非后续激活任务明确允许
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- secrets、tokens、cookies、API keys

## 建议执行步骤

1. 读取 015 报告中关于这 5 个模板的专属 FAQ 设计。
2. 构造一个标准的 JSON 结构，包含各模板 ID 的中文和英文 `faq` 配套（如 `faqZh` 与 `faqEn`，包括 `question` 与 `answer` 字段）。
3. 将该结构写入临时允许的文案路径 `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json` 中。
4. 撰写中文执行报告。

## 建议验证方式

- 检查生成的 JSON 文件是否满足 JSON 语法标准，并且与 015 的具体 FAQ 业务定义一致。

## 风险等级

- 低：只修改 `ProjectDocs/AI-Team/tmp/` 下的静态 JSON，不直接碰 `Code/` 逻辑。

## 激活条件

该任务必须由 Mike 或 Codex 审阅后，复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`，才能正式执行。
