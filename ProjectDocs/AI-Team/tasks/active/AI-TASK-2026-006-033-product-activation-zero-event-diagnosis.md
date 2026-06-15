# 任务说明：产品激活关键事件为 0 的漏斗诊断

## Metadata

- task_id: AI-TASK-2026-006-033
- title: 产品激活关键事件为 0 的漏斗诊断
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-15
- priority: P0
- permission_level: REPORT_ONLY
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-033-execution-report.md`

## 背景

Codex 从生产 Growth Snapshot 读取到 GA4 数据：

```text
2026-06-12  sessions 30, newUsers 25, eventCount 159
2026-06-13  sessions 15, newUsers 10, eventCount 94
2026-06-14  sessions 29, newUsers 26, eventCount 138
```

但关键产品激活事件仍然为 0：

```text
demo_start = 0
demo_complete = 0
template_use_click = 0
form_generate = 0
form_publish = 0
form_submit = 0
```

这说明：网站有访问，但用户没有进入可衡量的产品价值路径，或者埋点触发/命名存在问题。

## 核心目标

诊断为什么有 sessions 但关键激活事件为 0。区分以下几类原因：

1. 用户真实没有点击；
2. 首页 CTA / Suggestions 不够可见；
3. `/forms/new` 首屏不清楚；
4. 登录拦截过早；
5. GA4 事件名与站内事件映射不一致；
6. Clarity 被排除或 mask 后无法观察关键交互；
7. 事件白名单或 API 上报失败。

## Allowed Files To Read

必须先读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_june_growth_battle_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md`

可读取：

- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/google-analytics.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/microsoft-clarity.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-creation-manager.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-preview-panel.tsx`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-027-execution-report.md`

可只读访问生产首页和 `/forms/new`，不得登录用户后台，不得读取提交数据或用户数据。

## Allowed Files To Modify

只允许写报告：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-033-execution-report.md`

本任务不允许修改代码、数据库、Git 或生产环境。

## 禁止事项

- 不得将 Mike 自测当作真实用户证据。
- 不得输出任何用户隐私、表单答案、Prompt 原文、邮箱、姓名。
- 不得修改 Clarity mask。
- 不得改事件白名单或埋点代码。
- 不得直接部署。

## 输出要求

报告必须中文，包含：

1. **当前漏斗判断**
   - 哪个节点最可能断了；
   - 是体验问题还是埋点问题。
2. **代码链路核对**
   - 首页点击是否触发 `demo_start`；
   - Demo 完成是否触发 `demo_complete`；
   - 模板使用是否触发 `template_use_click`；
   - 创建页是否触发 `forms_new_view` / `template_context_loaded` / `workspace_preview_ready`；
   - 站内事件 API 是否白名单放行。
3. **体验链路核对**
   - 首页 3 秒内价值是否清楚；
   - Suggestions 是否可见；
   - `/forms/new` 是否匹配入口上下文；
   - 登录拦截是否过早。
4. **建议动作**
   - 不超过 5 个；
   - 按 P0/P1/P2 排序；
   - 每个动作必须对应漏斗节点和指标。
5. **需要 Mike 做什么**
   - 是否需要提供 Clarity 录屏编号、截图或 GA4 DebugView。
6. **需要 Codex 做什么**
   - 是否需要复核埋点代码或安排修复任务。
7. **给 Codex 的复核摘要**

## 验收目标

- 明确为什么 GA4 有访问但关键产品事件为 0。
- 输出下一步产品激活修补任务的优先级。
- 不进行任何未授权代码修改。
