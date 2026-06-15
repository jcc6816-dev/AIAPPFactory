# 任务说明：GSC 单日曝光下滑归因与搜索增长行动建议

## Metadata

- task_id: AI-TASK-2026-006-031
- title: GSC 单日曝光下滑归因与搜索增长行动建议
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-15
- priority: P0
- permission_level: REPORT_ONLY
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-031-execution-report.md`

## 背景

GenForms.ai 已上线并接入 GSC / GA4 / Clarity / PageSpeed / Growth Snapshot。Codex 已在生产环境回补并读取了 GSC 单日快照，发现曝光下滑不是轻微波动，而是明确的搜索展示下滑。

GSC 单日数据：

```text
2026-06-08  impressions 157, clicks 0, position 37.97
2026-06-09  impressions 184, clicks 0, position 36.68
2026-06-10  impressions 198, clicks 0, position 34.63
2026-06-11  impressions 160, clicks 0, position 50.53
2026-06-12  impressions 72,  clicks 0, position 55.36
2026-06-13  impressions 62,  clicks 0, position 51.47
2026-06-14  API 返回 0，因 GSC API 延迟，暂不作为最终判断
```

主要掉量页面：

```text
/posts/feishu-dingtalk-webhook-notification
6/10 impressions 85, position 9.79
6/11 impressions 47, position 8.38
6/12 impressions 3,  position 9.00
6/13 impressions 1,  position 10.00

/posts/typeform-alternatives
6/09 impressions 41, position 64.49
6/11 impressions 47, position 77.15
6/12 impressions 20, position 80.60
6/13 impressions 7,  position 70.57

/posts/lark-feishu-form-webhook-bot
6/09 impressions 22, position 8.32
后续未进入 Top pages
```

Codex 初步判断：当前不是全站技术灾难，更像少数内容页短期展示回落 + 页面主题权重还不稳定 + CTR 为 0 导致 Google 继续探索意愿下降。但需要 Gemini 做更细的归因。

## 核心目标

1. 基于上述数据，判断曝光下滑主要来自哪些页面、哪些主题、哪些关键词。
2. 区分：
   - 全站技术问题；
   - 内容页短期波动；
   - 页面被频繁改动后重新评估；
   - 搜索意图不匹配；
   - CTR 为 0 导致展示探索减少；
   - 参数页 / canonical / noindex 治理带来的正常流量清洗。
3. 输出 3-5 个高杠杆行动，不要泛泛建议。
4. 明确哪些页面必须冻结观察，哪些页面可以微调，哪些页面需要新内容支撑。

## Allowed Files To Read

必须先读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_june_growth_battle_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_compliance_rules.md`

可读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-025-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-024-forms-new-index-hygiene.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-025-webhook-serp-ctr-optimization.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/posts/[slug]/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/blog-detail/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`
- `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts`
- `/Users/mike/Documents/AIFactory/Code/public/robots.txt`

如需线上 HTML，只能用只读网络请求读取公开页面源码，不得读取密钥。

## Allowed Files To Modify

只允许写报告：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-031-execution-report.md`

本任务不允许修改代码、数据库、后台文章、Git 或生产环境。

## 禁止事项

- 不得编造 GSC / GA4 / Clarity 数据。
- 不得建议大规模重写已经有曝光的文章。
- 不得为了恢复曝光而取消 `/forms/new` noindex。
- 不得把 2026-06-14 API 返回 0 当作确定事实。
- 不得发布文章或修改后台内容。

## 输出要求

报告必须中文，包含：

1. **结论先行**
   - 这次下滑是全站问题、内容页问题、数据延迟，还是组合问题？
2. **数据归因**
   - 按日期说明曝光下滑；
   - 按页面说明掉量贡献；
   - 按查询词说明主题变化。
3. **风险判断**
   - 是否需要紧急技术修复；
   - 是否需要冻结页面；
   - 是否需要 GSC / Bing 手动检查。
4. **行动建议**
   - 今天做什么；
   - 未来 3 天做什么；
   - 未来 7 天做什么。
5. **需要 Mike 做什么**
   - 如 GSC URL Inspection、Bing URL Inspection、请求重新抓取等。
6. **需要 Codex 做什么**
   - 如复核、部署、观察、补接口等。
7. **给 Codex 的复核摘要**
   - 用 5-8 条列出最终建议。

## 验收目标

- 明确解释从 198 曝光下降到 62 曝光的主要原因假设。
- 输出可执行的搜索增长恢复动作。
- 不产生未经授权的代码或生产改动。
