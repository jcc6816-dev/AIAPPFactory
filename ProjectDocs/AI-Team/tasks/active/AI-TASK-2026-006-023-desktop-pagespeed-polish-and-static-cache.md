# 任务说明：桌面 PageSpeed 细节优化与静态资源缓存治理

## Metadata

- task_id: AI-TASK-2026-006-023
- title: 桌面 PageSpeed 细节优化与静态资源缓存治理
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-13
- priority: P2
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-023-execution-report.md`

## 背景

Mike 在 Google PageSpeed 网页端补充了桌面版性能诊断数据。桌面端整体 Performance 已经较高，本任务不应大动页面架构，只做低风险、可验证的细节优化。

PageSpeed 提示包括：

1. 渲染阻塞 CSS 请求，预计影响约 190ms。
2. 静态资源缓存生命周期偏短：
   - `/logo.png` 约 4 小时。
   - `/masks/circle.svg` 约 4 小时。
   - Cloudflare email decode 和 beacon 由第三方/Cloudflare 控制。
   - Clarity `clarity.js` TTL 约 1 天，站点不可直接控制。
3. Logo 图片传送不够精细：
   - 页面显示尺寸约 32x32。
   - 当前 `/logo.png` 为 256x256，传输约 10.4 KiB。
4. 旧版 JavaScript/polyfill 约 11 KiB：
   - 来自 Next shared chunk。
   - 包括 `Array.prototype.at/flat/flatMap`、`Object.fromEntries/hasOwn`、`String.trimStart/trimEnd` 等。

## Codex 初步判断

- 桌面端已经不是主要瓶颈，不应为追求 1-2 分做高风险改动。
- 优先级最高的是静态资源缓存与 logo 传送，这两项低风险、容易验证。
- 渲染阻塞 CSS 属于 Next/Tailwind 构建产物，预计收益有限，暂不建议大改。
- Clarity、Cloudflare beacon 的 TTL 不可由应用代码直接控制，不应强行处理。
- 旧版 JS 11 KiB 不是当前主要问题，除非能确认 `browserslist`/Next 配置低风险调整，否则暂不处理。

## 核心目标

1. 形成一份实施计划，明确哪些 PageSpeed 桌面建议值得做，哪些不值得做。
2. 优先处理低风险项：
   - Logo 小尺寸资源或响应式图片方案。
   - Cloudflare / Next 静态资源缓存策略建议。
3. 不破坏现有 SEO、Header、视觉、部署流程。
4. 不引入新的依赖。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-021-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-022-homepage-accessibility-touch-target-fix.md`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/next.config.mjs`
- `/Users/mike/Documents/AIFactory/Code/public/logo.png`
- `/Users/mike/Documents/AIFactory/Code/public/masks/circle.svg`
- `/Users/mike/Documents/AIFactory/Code/package.json`

## Allowed Files To Modify

实施计划已由 Codex 复核通过，允许进入低风险代码实现阶段。

只允许修改以下文件。如发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/next.config.mjs`
- `/Users/mike/Documents/AIFactory/Code/public/logo-64.png`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-023-implementation-plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-023-execution-report.md`

## 禁止事项

- 禁止直接修改代码。
- 禁止修改 Auth、支付、数据库、Admin API、环境变量、部署脚本。
- 禁止为了 PageSpeed 分数删除 Clarity、GA4、Cloudflare 统计脚本。
- 禁止大改 Next/Tailwind 构建配置，除非计划中证明收益明显且风险可控。
- 禁止修改 SEO 文案、结构化数据、canonical、hreflang。
- 禁止删除、禁用或代理 Clarity、GA4、Cloudflare 统计脚本。
- 禁止修改 `Code/public/logo.png` 原文件；本任务只允许新增派生小图 `logo-64.png`。
- 禁止对非指纹文件配置超过 30 天的浏览器缓存。若未来更换 logo，应通过新文件名发布。
- Cloudflare 缓存建议必须以 `genforms.ai` 域名为准，不得使用仓库名、项目名或旧环境名作为规则目标。

## 执行授权说明

Codex 已复核 Gemini 输出的 `AI-TASK-2026-006-023-implementation-plan.md`，结论为：

- 批准立即处理 `logo-64.png` 派生资源与 Header/Footer 引用切换。
- 批准在 `next.config.mjs` 中为明确的本地静态资源路径增加中长期缓存头。
- 暂不处理第三方脚本 TTL、渲染阻塞 CSS、旧版 JavaScript/polyfill。
- Cloudflare Cache Rules 只输出人工操作建议，不由 Gemini 自动配置。

## 计划要求

Gemini 先输出实施计划，必须包括：

1. 每条 PageSpeed 建议是否值得处理。
2. 对每条建议的处理方式：
   - 立即处理。
   - 暂缓观察。
   - 不建议处理，并说明原因。
3. 如果处理 logo，说明推荐方案：
   - 新增 32/64/96 小尺寸 logo 文件；
   - 或使用 `next/image`；
   - 或保持现状。
4. 如果处理缓存，说明：
   - 应通过 Cloudflare Cache Rules 处理，还是应用代码 headers 处理；
   - 哪些路径可长缓存；
   - 哪些路径不能长缓存。
5. 验证方式：
   - PageSpeed Desktop 复测；
   - curl headers 检查；
   - 视觉检查 Header logo。

## 验收目标

本任务的第一阶段只验收计划：

- 计划清楚区分“值得做”和“不值得做”的建议。
- 不把 Clarity/Cloudflare 第三方 TTL 当成代码问题。
- 不把桌面端 190ms CSS 阻塞误判为 P0。
- 给出低风险、可落地的下一步。
