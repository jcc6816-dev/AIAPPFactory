# 任务说明：Internal Link Cluster Audit

## 任务元信息

- task_id: AI-TASK-2026-006-007
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: within 1-2 days
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审计 GenForms.ai 当前 Template / Solution / Use Case / Blog 之间的内链结构，找出 5 个最值得补强的内链机会。

## 背景

我们正在用“一个产品核心 + 多个高意图入口页 + 同一激活路径”的方式增长流量。内链质量会影响 Google 对内容簇的理解，也会影响访客从阅读进入创建表单的转化。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/codex_seo_operations_tracker.md`
- `/Users/mike/Documents/AIFactory/Code/services/form-templates.ts`
- `/Users/mike/Documents/AIFactory/Code/services/solution-landing-pages.ts`
- `/Users/mike/Documents/AIFactory/Code/services/use-case-landing-pages.ts`
- `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-007-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- production deployment scripts
- payment/auth/billing/database files

## 执行步骤

1. 阅读相关 service 文件，理解模板、Solution、Use Case、博客之间的关系。
2. 找出目前可能缺少双向链接或上下游链接的内容簇。
3. 提出 5 个最值得补强的内链机会。
4. 每个机会说明：
   - 从哪个页面链接到哪个页面
   - 推荐 anchor text
   - 为什么这条链接有 SEO 或转化价值
   - 是否有重复/doorway 风险
5. 输出中文报告，不修改代码。

## 验证要求

- 必须引用实际文件路径或页面 slug。
- 不要建议为了 SEO 强塞无关链接。
- 不要修改代码。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-007-execution-report.md`

## 验收标准

- 报告包含 5 条具体内链建议。
- 每条建议有来源页、目标页和 anchor text。
- 建议符合 SEO 内容质量规则。

