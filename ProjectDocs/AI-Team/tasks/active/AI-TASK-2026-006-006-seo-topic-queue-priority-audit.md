# 任务说明：SEO Topic Queue Priority Audit

## 任务元信息

- task_id: AI-TASK-2026-006-006
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: within 1-2 days
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审计现有 SEO 内容选题队列，选出下一轮最值得写或优化的 5 个主题，并说明排序理由。

## 背景

GenForms.ai 当前缺流量，但必须遵守 Google SEO 质量规则，不能为了数量批量生成低价值文章。需要优先选择“高意图、低重复、能连接产品工作流”的内容主题。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/codex_seo_operations_tracker.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-006-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- production deployment scripts
- payment/auth/billing/database files

## 执行步骤

1. 读取内容选题队列和低竞争关键词地图。
2. 找出已经上线、已经在做、可能重复的主题。
3. 选择下一轮最值得推进的 5 个主题。
4. 对每个主题说明：
   - 搜索意图
   - 为什么适合现在做
   - 应链接到哪个 Template / Solution / Use Case
   - 是否更适合写博客、Solution 页、Use Case 页，还是优化已有页面
5. 输出中文执行报告。

## 验证要求

- 不要建议一天批量上线大量页面。
- 不要建议重复创建与已有页面高度相似的页面。
- 明确区分“新写内容”和“优化已有内容”。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-006-execution-report.md`

## 验收标准

- 报告给出排序后的 5 个主题。
- 每个主题都有明确产品落点。
- 建议符合 Google SEO 质量规则。

