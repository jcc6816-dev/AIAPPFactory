# 任务说明：首页移动端 LCP 专项诊断与修复

## Metadata

- task_id: AI-TASK-2026-006-021
- title: 首页移动端 LCP 专项诊断与修复
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-13
- priority: P0
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-021-execution-report.md`

## 背景

18/19/20 已经完成：

- 18：PageSpeed Insights 接入 Admin Growth。
- 19：Stripe SDK 动态加载、Google One Tap 不再首页首屏自动触发。
- 20：首页非首屏重组件做了动态加载。

部署后 Codex 对生产首页做 PageSpeed 复测：

| 端 | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 60 | 82 | 96 | 100 | 7.3s | 230ms | 0 |
| Desktop | 100 | 82 | 100 | 100 | 0.7s | 30ms | 0 |

移动端主要机会项：

- `unused-javascript`：约 418 KiB。
- `unused-css-rules`：约 20 KiB。

结论：桌面端已经很好，SEO 稳定；移动端 LCP 是当前性能主瓶颈。本任务不再做泛泛优化，而是专门定位并修复移动端 LCP。

本任务服务于产品体验与激活主线：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate -> form_publish -> form_submit
```

目标是让移动端用户更快看到首屏核心价值，并降低进入 `demo_start` 之前的等待成本。

## 核心目标

1. 明确移动端首页的 LCP 元素是谁。
2. 判断 LCP 慢的主要原因：服务端响应、字体、CSS、Hero 文案、Hero Mockup、动画、第三方脚本，还是客户端水合。
3. 在小范围内做可回滚修复，优先提升移动端 LCP，不牺牲 SEO 和首屏转化。
4. 保持桌面端体验稳定。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-019-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-020-execution-report.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/google-analytics.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/microsoft-clarity.tsx`
- `/Users/mike/Documents/AIFactory/Code/package.json`

## Allowed Files To Modify

只允许修改以下文件。如发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-021-execution-report.md`

## 禁止事项

- 禁止修改 Auth、支付、数据库、Admin API、环境变量、部署脚本。
- 禁止删除首页 Hero 的核心价值表达：标题、描述、Prompt、建议场景、主 CTA。
- 禁止为了分数隐藏移动端核心 Demo 入口。
- 禁止把首页 SEO 文本模块客户端化。
- 禁止修改 GA4/Clarity/GSC/PageSpeed API。
- 禁止提交 Git、部署生产。
- 禁止编造 PageSpeed 分数；如果无法实际复测，必须如实说明。

## 实施步骤

### 第 1 步：诊断 LCP 元素

必须先完成诊断，再改代码。

建议方法：

- 如果可以运行 Lighthouse：

```bash
npx lighthouse https://genforms.ai/ --preset=desktop --only-categories=performance --output=json --output-path=/tmp/genforms-lighthouse.json
```

并尽量使用移动端配置或 PageSpeed API 数据查看：

- `largest-contentful-paint-element`
- `network-requests`
- `render-blocking-resources`
- `unused-javascript`
- `total-byte-weight`

如果无法联网或无法调用 Lighthouse，请基于现有 PageSpeed 结果和源码结构进行静态诊断，但必须在报告中标明置信度。

报告中必须写：

- LCP 元素候选是什么。
- 判断依据是什么。
- 置信度：高 / 中 / 低。

### 第 2 步：优先考虑的修复方向

只允许做小范围、可回滚修复，优先级如下：

1. **移动端 Hero 首屏减负**
   - 检查 Hero 在移动端是否首屏同时渲染过重 Mockup、动画、阴影、渐变、复杂列表。
   - 如果右侧 Mockup 在移动端位于首屏下方，考虑让其移动端延后渲染或使用更轻的静态首屏占位，但不能删除 Demo 入口。
   - 首屏必须保留建议场景按钮和进入 Demo 的路径。

2. **减少移动端首屏动画与定时器成本**
   - 检查 Hero 初始加载时是否启动不必要的动画、定时器、重绘。
   - 只有用户点击 Demo 后，才应启动 Demo 相关动画、步骤计时器。

3. **字体与 CSS**
   - 检查移动端 Hero 是否使用过多超大字重、复杂阴影或导致慢绘制的 CSS。
   - 只能做局部 CSS 优化，不能重写全站样式体系。

4. **导入清理**
   - 检查首页 `page.tsx` 中是否仍有未使用的静态 import 进入构建图。
   - 可删除真正未使用的 import。
   - 不要删除当前页面实际使用的 SEO 入口模块。

### 第 3 步：功能和 SEO 安全

必须确保：

- 移动端首页仍能看到核心标题、描述、Prompt/建议场景、生成按钮。
- 免输入 Demo 仍可触发 `demo_started`。
- 不影响 `template_used` / `template_use_click` 口径。
- 桌面端 Hero Mockup 不退化。
- 首页 Structured Data、Use Case、Solution、Blog、FAQ 保持服务端可读。

### 第 4 步：验证

必须执行：

```bash
npx tsc --noEmit
npm run build
```

建议执行：

```bash
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
```

如可行，执行一次本地或线上 Lighthouse/PageSpeed 复测，并记录：

- Mobile Performance
- Mobile LCP
- Mobile TBT
- Mobile CLS
- Desktop Performance

如果不能复测，必须说明原因，并给出 Codex 复测清单。

## 验收标准

- 报告明确说明 LCP 元素候选与证据。
- 代码修改范围小，不破坏首页核心体验和 SEO。
- `npx tsc --noEmit` 通过。
- `npm run build` 通过。
- 首页 `/[locale]` First Load JS 与 Page Size 记录在报告中。
- 若有 PageSpeed 复测，移动端 LCP 应比 7.3s 有改善；若没有改善，必须解释原因并提出下一步。

## 输出要求

报告必须为中文，并写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-021-execution-report.md`

报告结构必须包含：

1. LCP 诊断结论
2. 修改文件清单
3. 具体修复内容
4. 对移动端体验的影响
5. 对 SEO 的影响
6. 验证命令与结果
7. 是否需要 Codex 线上复测

