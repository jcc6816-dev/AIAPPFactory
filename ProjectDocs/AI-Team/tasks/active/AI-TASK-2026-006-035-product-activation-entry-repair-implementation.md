# 任务说明：产品激活入口修补第一批代码实现

## Metadata

- task_id: AI-TASK-2026-006-035
- title: 产品激活入口修补第一批代码实现
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-17
- priority: P0
- permission_level: CODE_ALLOWED_SCOPED
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-035-execution-report.md`

## 背景

Mike 已确认：关键产品激活事件为 0 **不是 GA4 丢事件，而是真实用户没有触发关键动作**。

Gemini 已完成 `AI-TASK-2026-006-034` 实施方案。Codex 复核后接受其核心方向，但做以下收敛：

1. **不批准把 PC 端首页退回 skeleton CTA 初始态**。大屏访客应该继续直接看到真实 Mockup，不要牺牲首屏产品感知。
2. **批准强化真实 Mockup Slide 0 的可点击性和主 CTA**。当前 Slide 0 选项卡可点击，但缺少强主按钮，用户可能把它当静态图。
3. **批准修复 `/forms/new` 承接不匹配问题**。带 `prompt` 但无 `template` 时，游客不应看到无关的“快速体验演示表单”，而应看到基于 prompt 规则映射出的沙盒模板预览。

本任务目标是让以下漏斗先动起来：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate
```

## 必须先读取

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_june_growth_battle_map.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-034-execution-report.md`

## Allowed Files To Modify

只允许修改以下文件：

- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-035-execution-report.md`

不得修改其他源码、数据库、环境变量、后台文章或部署脚本。

## 必做改动

### 1. 首页真实 Mockup Slide 0 增加明确主 CTA

文件：`Code/components/blocks/hero/index.tsx`

要求：

- 保持当前非移动端 `shouldRenderMockup=true` 的直接真实 Mockup 初始态。
- 在真实 Mockup 的 Slide 0 选项列表下方增加一个明确按钮：
  - 中文：`直接体验 AI 演示`
  - 英文：`Start Demo Instantly`
- 按钮点击逻辑：
  - 若当前已有 `selectedOption`，使用该选项；
  - 若没有选中项，默认使用 `event-registration`；
  - 调用现有 `handleOptionSelect(templateId, "homepage_hero_mockup")`；
  - 触发现有 `demo_started` 事件，不新增事件名。
- 不要把按钮点击记录为 `form_generate`。

### 2. 强化 Mockup 选项卡可点击性

文件：`Code/app/typeform-home.css`

要求：

- 保留现有 `.mockup-option` 样式；
- 可以增强 hover：轻微上移 / scale / shadow；
- 不要引入复杂动画或重型 CSS；
- 不要影响移动端 LCP 和 CLS；
- 不要破坏 768-1023px 小桌面修复。

### 3. `/forms/new` prompt-only 入口自动套用沙盒模板

文件：`Code/components/forms/form-generator.tsx`

要求：

- 当存在 `initialPrompt`，但没有有效 `initialTemplateId`，且当前尚未生成 `generated`，在游客态也要基于 prompt 进行轻量模板映射并加载模板草稿。
- 映射规则应与首页保持一致或兼容：
  - event / ticket / booking / 活动 / 报名 / 门票 / 科技峰会 -> `event-registration`
  - lead / capture / SaaS / 潜客 / 线索 -> `lead-capture`
  - feedback / survey / satisfaction / 满意度 / 反馈 / 调研 -> `satisfaction-survey`
  - job / resume / hire / 招聘 / 简历 / 求职 -> `job-application`
  - webhook / lark / feishu / dingtalk / 飞书 / 钉钉 -> `contact-us`
- 注意：`webhook-form-builder-retry-logs` 是 Use Case slug，不是 `form-templates.ts` 中可加载的模板 ID。不得把它作为 `handleApplyTemplate()` 的 templateId 传入；如当前代码已有该错误映射，应在本任务中修正为 `contact-us`，避免游客进入 `/forms/new` 后模板加载失败。
- 如果完全无法匹配，不要触发 AI API，不要自动生成；可以保持当前 DEMO_FIELDS，但提示文案必须更诚实，不能让用户以为已经按 prompt 生成。
- 自动套用模板必须：
  - 不调用付费 AI 生成接口；
  - 不保存数据库；
  - 不触发表单发布；
  - 可以触发 `template_context_loaded` / `workspace_preview_ready`，但 metadata 不得包含 prompt 原文。
- 对桌面端默认 `desktop`、移动端默认 `phone` 的逻辑保持不变。

## 禁止事项

- 不得改 GA4/Growth Events 事件名。
- 不得新增数据库字段。
- 不得新增依赖。
- 不得引入全站视觉重构或暗黑霓虹主题。
- 不得移除 Clarity mask。
- 不得修改 SEO 文章、metadata、sitemap、robots。
- 不得部署生产。

## 验证要求

必须运行：

```bash
npx tsc --noEmit
npm run build
```

建议补充手动验证：

1. 首页桌面端加载后，右侧真实 Mockup Slide 0 可见，并有明确 `Start Demo Instantly` 按钮。
2. 点击该按钮后进入生成 loading / Slide 2，并触发 `demo_started`。
3. 点击左侧 Suggestions 后，右侧 Mockup 进入同样 Demo 流程。
4. 未登录访问 `/forms/new?prompt=Design%20a%20SaaS%20lead%20capture%20form`，右侧预览应是 lead capture 相关模板，而不是“快速体验演示表单”。
5. 未登录访问无法匹配的 prompt，不得调用 AI API，不得误导用户已经生成。

## 输出报告要求

报告必须中文，包含：

1. 修改文件清单。
2. 每个文件具体改了什么。
3. 是否触发或修改事件名。
4. 是否涉及数据库/环境变量/生产部署。
5. `tsc` 和 `build` 结果。
6. 手动验证结果。
7. 给 Codex 的复核摘要。
