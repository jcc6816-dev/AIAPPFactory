# 任务说明：首页第三方脚本延迟加载优化

## Metadata

- task_id: AI-TASK-2026-006-019
- title: 首页第三方脚本延迟加载优化
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-13
- priority: P0
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-019-execution-report.md`

## 背景

Codex 使用 Lighthouse / PageSpeed 对 `https://genforms.ai/` 做性能审计后发现：首页性能瓶颈不在 SEO 基础项，而在首屏加载和第三方脚本。当前页面会涉及 Stripe、Google 登录、GA4/GTM、Clarity 等第三方能力，其中 Stripe 与 Google 登录不应在游客首页首屏主动承担主要加载成本。

本任务服务于产品体验与激活主线：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate -> form_publish -> form_submit
```

目标是降低 `page_view -> demo_start` 之前的首屏性能阻力，避免用户在还没看到价值前因为加载慢离开。

## 目标

在不破坏支付、登录、GA4 关键事件、Clarity 体验观察的前提下，完成第三方脚本加载策略优化：

1. Stripe 前端 SDK 只在用户触发支付/订阅动作时加载，不进入首页首屏 bundle。
2. Google 登录相关脚本不要在首页首屏主动触发 token 获取；只有用户点击登录、打开登录弹窗、或进入明确需要登录的动作时再加载或触发。
3. Clarity 和 GA4 保持可用，但不得阻塞首屏关键渲染；如调整加载策略，必须说明对数据完整性的影响。
4. 修复或降低 Google Sign-In FedCM console error 对游客首页的影响。
5. 所有后台/admin文案必须中文优先。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/layout.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/**`
- `/Users/mike/Documents/AIFactory/Code/contexts/app.tsx`
- `/Users/mike/Documents/AIFactory/Code/hooks/useOneTapLogin.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/sign/**`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
- `/Users/mike/Documents/AIFactory/Code/package.json`

## Allowed Files To Modify

仅允许修改以下范围。若发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/sign/form.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/sign/modal.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/sign/user.tsx`
- `/Users/mike/Documents/AIFactory/Code/contexts/app.tsx`
- `/Users/mike/Documents/AIFactory/Code/hooks/useOneTapLogin.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/google-analytics.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/microsoft-clarity.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/layout.tsx`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-019-execution-report.md`

## 禁止事项

- 禁止修改 `.env*`、secrets、数据库 schema、支付服务端 API、Stripe webhook、订单模型、认证服务端配置。
- 禁止移除 GA4、Clarity 或 Growth Tracking，只能优化加载时机。
- 禁止让 `form_generate`、`form_publish`、`form_submit` 等关键事件丢失。
- 禁止用假数据证明性能提升。
- 禁止部署生产、提交 Git。

## 实施要求

### 1. Stripe 前端 SDK

检查 `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`。

要求：

- 移除或避免顶层 `import { loadStripe } from "@stripe/stripe-js"` 导致首页首屏 bundle 提前包含 Stripe 代码。
- 在用户点击具体支付/订阅按钮后，再通过动态 `import("@stripe/stripe-js")` 加载 `loadStripe`。
- 保留原有异常处理与支付跳转逻辑。
- 不修改服务端 checkout API。

### 2. Google 登录 / One Tap

检查登录入口和用户菜单相关组件。

要求：

- 首页首屏不得主动触发 Google token 获取。
- 如果当前存在 Google One Tap 或自动弹窗逻辑，必须从源头控制触发条件，改为用户打开登录弹窗、进入登录页、或点击 Google 登录按钮后再触发。
- 禁止通过 `layout.tsx` 注入全局 monkey patch、禁止劫持 `window.google`、禁止拦截第三方 SDK 原型或全局属性。
- 如需改动 One Tap，优先改 `contexts/app.tsx` 与 `hooks/useOneTapLogin.tsx`，避免在全局 layout 中放不可维护脚本。
- 不破坏普通 Google 登录按钮。
- 如 `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED` 已控制该能力，优先复用环境变量开关，不新增复杂状态机。

### 3. GA4 / Clarity

要求：

- GA4 关键事件仍然可以在用户行为触发后上报。
- Clarity 仍能记录公开页面体验，但不得录制 `/forms/new`、`/forms/`、`/f/`、`/admin` 等敏感路径。
- 如调整 `next/script` strategy，需使用 Next.js 推荐策略，并在报告里说明为什么不会阻塞首屏。

### 4. 验证

必须执行：

```bash
npx tsc --noEmit
npm run build
```

建议执行：

```bash
npx vitest run
```

如果全量测试耗时过长，可至少运行与修改文件相关的测试，并在报告中说明未运行全量测试的原因。

## 验收标准

- 首页首屏不再因为 Stripe 前端 SDK 顶层导入而增加不必要客户端 JS。
- Google 登录不会在游客首页首屏主动触发 FedCM token 获取。
- 登录、支付、GA4、Clarity 功能不被破坏。
- `npm run build` 通过。
- 报告必须包含：
  - 修改文件清单
  - 每类第三方脚本的加载策略变化
  - 风险与回滚方式
  - 实际执行的验证命令及结果
