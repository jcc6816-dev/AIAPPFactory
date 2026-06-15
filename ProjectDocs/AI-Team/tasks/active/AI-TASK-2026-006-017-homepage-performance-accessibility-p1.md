# 任务说明：首页 P1 性能与可访问性小修

## 任务元信息

- task_id: AI-TASK-2026-006-017
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-13
- due: 2026-06-14
- permission_level: CODE_SCOPED_WRITE
- code_modification_allowed: true
- language: zh-CN
- dependencies:
  - 2026-06-13 Lighthouse mobile/desktop audit by Codex

## 目标

请 Gemini 基于 Codex 的 Lighthouse 审计结果，对 GenForms.ai 首页做第一轮低风险性能与可访问性修复，目标是提升移动端首屏体验、Accessibility、Best Practices，并避免影响登录、支付、埋点、SEO 结构和生产稳定性。

本任务只做“小修复”，不要重构首页，不要改业务流程。

## 背景

Codex 在 2026-06-13 使用 Lighthouse 对 `https://genforms.ai/` 进行了移动端与桌面端审计。由于 PageSpeed Insights API 返回 429 quota exceeded，本轮用 Lighthouse 作为同源替代。

当前主要结果：

```text
Mobile:
- Performance: 76
- Accessibility: 82
- Best Practices: 73
- SEO: 100
- FCP: 4.1s
- LCP: 4.1s
- TBT: 90ms
- CLS: 0
- TTI: 10.5s

Desktop:
- Performance: 79
- Accessibility: 82
- Best Practices: 73
- SEO: 100
- FCP: 1.9s
- LCP: 2.2s
- TBT: 0ms
- CLS: 0
- TTI: 2.2s
```

Lighthouse 明确指出的问题包括：

- `logo.png` 图片缺少显式 `width` / `height`。
- 部分按钮缺少 accessible name，例如移动端菜单按钮、语言选择按钮或图标按钮。
- Footer 邮件链接缺少可访问名称。
- 首页 mockup 主题色圆点按钮点击区域太小，且缺少清晰 `aria-label`。
- 部分文字颜色对比不足，例如 `Suggestions:`、mockup indicator、深色卡片中的编号文字。
- 首页存在第三方脚本造成的 Best Practices 扣分，但本任务暂不修改 Stripe、Google Sign-In、Clarity、GTM/GA4 的加载策略。

## 需要读取的文件

请先读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`

可按需只读：

- `/Users/mike/Documents/AIFactory/Code/components/sign/user.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/layout.tsx`

## 允许修改的文件

只允许修改以下文件：

- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-017-execution-report.md`

如果你认为必须修改其他文件，请停止代码修改，在报告中说明原因，等待 Codex 或 Mike 重新授权。

## 禁止触碰的文件和动作

- `.env*`
- `WorkBuddy/**`
- 支付、认证、账单、数据库迁移文件
- `Code/app/api/**`
- `Code/auth/**`
- `Code/models/**`
- `Code/services/**`
- `Code/scripts/deploy-pm2.sh`
- 生产部署
- Git commit / git push
- 删除文件
- 修改 GA4/GTM/Clarity/Stripe/Google Sign-In 的加载逻辑
- 修改 sitemap、robots、canonical、hreflang、JSON-LD 等 SEO 结构

## 执行范围

请优先完成以下低风险修复：

1. 为首页 header / footer / hero 中使用的 `logo.png` 图片补充明确的 `width` 和 `height` 属性，避免 CLS 和 Lighthouse unsized image 警告。
2. 为移动端菜单按钮、语言选择按钮、主题色圆点按钮等图标或纯视觉控件补充 `aria-label`。
3. 扩大 mockup 主题色圆点按钮的真实点击区域，视觉圆点可以保持小，但 button hit area 不应小于 32px，移动端尽量接近 44px。
4. 修复 Lighthouse 指出的明显低对比度文案，优先修：
   - `Suggestions:` 相关文本颜色。
   - mockup header indicator / slide number。
   - 深色卡片上的编号文字。
5. 修复 footer 邮件链接缺少可访问名称的问题。
6. 如果发现 button 内嵌 a、或 a 内嵌 button 造成 target-size / accessibility 问题，只能在允许文件内做局部语义修正，不能改变跳转目标和业务逻辑。

## 不在本任务内解决

以下问题只做观察和报告，不允许本任务直接修改：

- Stripe 脚本延迟加载。
- Google Sign-In / FedCM console error。
- Clarity/GTM/GA4 延迟加载或 consent gating。
- 首页大规模组件拆分、dynamic import、服务端组件重构。
- Cloudflare 缓存策略。
- Next.js cache-control / no-store / bfcache 相关策略。

请在报告中单独列出这些问题的下一步建议，但不要实现。

## 验证要求

完成修改后，请至少运行：

```bash
cd /Users/mike/Documents/AIFactory/Code
npx tsc --noEmit
npm run build
```

如果时间允许，可运行：

```bash
npx lighthouse https://genforms.ai/ --chrome-flags='--headless=new --no-sandbox' --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/private/tmp/genforms-lighthouse-after-gemini.json --quiet --preset=desktop
```

注意：如果只在本地修改未部署，线上 Lighthouse 分数不会变化。此时请在报告中明确写出“Lighthouse 线上分数需部署后由 Codex 复测”。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-017-execution-report.md`

## 报告必须包含

1. 修改文件清单。
2. 每个修改对应解决的 Lighthouse 问题。
3. 是否改变业务逻辑。
4. 是否影响 SEO、登录、支付、埋点。
5. `npx tsc --noEmit` 结果。
6. `npm run build` 结果。
7. 未解决但建议下一阶段处理的问题。
8. 风险判断和回滚建议。

## 验收标准

- 不修改禁止文件。
- 不改变首页核心业务链路。
- 不影响登录、支付、GA4/GTM/Clarity 埋点。
- TypeScript 类型检查通过。
- 生产构建通过。
- 报告中文、克制、可复核。

