# 任务说明：`/forms/new` 创建页索引治理

## Metadata

- task_id: AI-TASK-2026-006-024
- title: `/forms/new` 创建页索引治理
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-14
- priority: P0
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-024-execution-report.md`

## 背景

Codex 分析 Mike 导出的 GSC 数据后发现，7 天页面维度中出现了不应作为 SEO 落地页进入搜索的创建工作台参数页：

`https://genforms.ai/forms/new?template=waitlist&source=usecase_waitlist-form-builder-indie-hackers`

`/forms/new` 及其带参数版本是产品创建入口，不是内容页。它可以被公开 CTA 链接访问，但不应被 Google 作为可索引页面收录，否则会稀释模板页、Solution 页、Use Case 页和博客页的搜索语义。

## 核心目标

1. 明确 `/forms/new`、`/zh/forms/new`、`/en/forms/new` 以及所有 query 参数变体的 SEO 策略。
2. 确保创建页不进入 Google 索引，且不影响真实用户从首页、模板页、Solution 页、Use Case 页、博客页跳转进入创建流程。
3. 不破坏游客免登录预览、模板参数传递、prompt 参数传递、移动端默认预览等现有体验。
4. 不修改 Auth、数据库、支付、发布、表单提交等核心链路。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(workspace)/forms/new/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(workspace)/layout.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts`
- `/Users/mike/Documents/AIFactory/Code/app/robots.ts`
- `/Users/mike/Documents/AIFactory/Code/middleware.ts`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-creation-manager.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`

如果某个文件不存在，需在报告中说明，不要为了读取不存在文件而扩大搜索范围。

## Allowed Files To Modify

Codex 已复核第一阶段实施计划，允许进入低风险代码实现阶段。

只允许修改以下文件。如发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(workspace)/forms/new/page.tsx`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-024-execution-report.md`

## Codex 复核结论与执行授权

Codex 复核 Gemini 的第一版计划后，结论如下：

1. 批准在 `Code/app/[locale]/(workspace)/forms/new/page.tsx` 增加页面级 `metadata.robots`：
   - `index: false`
   - `follow: false`
2. 暂不批准修改 `Code/public/robots.txt` 增加 `/forms/new` 的 `Disallow`。
   - 原因：如果 Google 已经发现或部分索引了该 URL，robots.txt 禁止抓取可能导致 Google 看不到页面内的 `noindex`，反而不利于从索引中清除。
   - 当前阶段应先允许 Google 抓取页面并读取 `noindex`。
3. 暂不做 canonical 修改。
   - 原因：创建工作台不是内容页，`noindex` 已足够明确；canonical 容易和带参数创建体验产生不必要语义混淆。
4. 如代码中发现 `redirect` 或 `callbackUrl` 等现有未使用变量，本任务不做清理，除非 TypeScript/build 明确失败。

## 禁止事项

- 禁止修改 `Code/public/robots.txt`。
- 禁止删除首页、模板页、Solution 页、Use Case 页、博客页到 `/forms/new` 的 CTA。
- 禁止把 `/forms/new` 从用户可访问路径中移除。
- 禁止增加登录前强制拦截。
- 禁止修改表单生成、保存、发布、提交、Webhook、订阅权限逻辑。
- 禁止把问题归因到“Google 惩罚”或“网站崩盘”，除非有明确证据。
- 禁止提交 Git 或部署生产环境。

## 代码实现要求

Gemini 需要：

1. 在 `forms/new/page.tsx` 中增加 Next.js App Router 页面级 metadata。
2. 保持页面现有参数解析、游客预览、模板初始化、Skill 初始化逻辑不变。
3. 不改 UI、不改路由、不改登录逻辑。
4. 执行验证：
   - `npx tsc --noEmit`
   - `npm run build`
5. 如果条件允许，启动本地服务后用 `curl` 检查 `/forms/new?template=waitlist&source=test` HTML 是否包含 `noindex`。

## 验收目标

本阶段验收代码实现：

- 页面 HTML 能输出 `noindex`。
- 不影响真实用户从 SEO 页面进入创建流程。
- 不误伤公开模板页、Solution 页、Use Case 页、博客页。
- 不修改 robots.txt。
