# 任务说明：产品激活入口修补实施方案

## Metadata

- task_id: AI-TASK-2026-006-034
- title: 产品激活入口修补实施方案
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-16
- priority: P0
- permission_level: REPORT_ONLY
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-034-execution-report.md`

## 背景

Codex 从生产 Growth Snapshot 读取到：

```text
2026-06-14 GA4:
sessions = 29
newUsers = 26
eventCount = 138
demo_start = 0
demo_complete = 0
template_use_click = 0
form_generate = 0
form_publish = 0
form_submit = 0
```

Mike 已在 2026-06-16 人工确认：**这不是 GA4 丢事件，而是真实没有触发关键产品激活事件**。

因此，本任务不再优先诊断 GA4 上报链路，而是围绕产品体验修补：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate
```

核心问题是：访客到站后没有产生可衡量的产品动作。

## 核心目标

输出一个可执行、低风险、分阶段的产品激活入口修补方案，重点回答：

1. 首页访客为什么没有触发 `demo_start`？
2. 首屏是否清楚、可信、可点击？
3. Suggestions / Demo / Generate Form CTA 是否足够明显？
4. 用户从首页进入 `/forms/new` 后，是否立刻看到与入口一致的表单预览？
5. 游客是否知道下一步该做什么？
6. 哪些改动能在不大改架构、不影响 SEO、不明显拖慢 PageSpeed 的前提下提升激活？

## 必须先读取

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_june_growth_battle_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-033-execution-report.md`

## Allowed Files To Read

可读取以下源码和样式文件：

- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-creation-manager.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-preview-panel.tsx`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`

可只读访问生产首页和 `/forms/new`，但不得登录后台、不得读取用户提交数据、不得读取敏感表单答案。

## Allowed Files To Modify

本任务只允许写报告：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-034-execution-report.md`

## 禁止事项

- 不得修改代码。
- 不得部署。
- 不得修改数据库。
- 不得发布或修改文章。
- 不得把 Mike 的人工测试当成真实用户转化证据。
- 不得提出全站换皮或大规模视觉重构。
- 不得建议移除 Clarity 隐私 mask。
- 不得把暗黑霓虹高级主题作为本任务核心方案；该主题目前仍在 `U-047` 待决策。

## 输出要求

报告必须中文，包含：

1. **当前激活断点判断**
   - 哪个节点最可能断裂；
   - 是首页首屏、CTA、Demo、还是 `/forms/new` 承接问题。
2. **首页修补方案**
   - 不超过 3 个 P0 改动；
   - 每个改动必须说明服务哪个指标：`demo_start`、`demo_complete` 或 `template_use_click`。
3. **`/forms/new` 承接修补方案**
   - 说明如何让入口 prompt/template 与右侧预览一致；
   - 说明游客模式下下一步按钮、保存/发布登录拦截如何更清楚；
   - 说明桌面/移动端默认预览模式如何处理。
4. **验证方案**
   - 本地手动验证步骤；
   - 生产验证步骤；
   - Clarity 观察点；
   - GA4 / Growth Events 观察点。
5. **风险控制**
   - SEO 风险；
   - PageSpeed 风险；
   - 移动端风险；
   - 隐私风险；
   - 登录/付费边界风险。
6. **建议实施批次**
   - 第一批必须低风险、少文件、能快速上线验证；
   - 第二批可以是更强 WOW Moment 或视觉增强，但不得默认批准开发。
7. **给 Codex 的复核摘要**
   - 本次建议改哪些文件；
   - 是否涉及数据库；
   - 是否涉及生产环境变量；
   - 是否建议进入代码实现；
   - 需要 Mike 配合什么。

## 验收目标

- 输出能直接进入 Plan -> Code -> Verify 的实施方案。
- 将优化动作明确绑定到激活漏斗，而不是泛泛美化页面。
- 不扩大范围到全站设计重构或商业化大改。
