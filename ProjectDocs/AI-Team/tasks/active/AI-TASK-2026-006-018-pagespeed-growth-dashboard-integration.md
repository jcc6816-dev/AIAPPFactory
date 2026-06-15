# 任务说明：PageSpeed Insights 增长驾驶舱集成

## 任务元信息

- task_id: AI-TASK-2026-006-018
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-13
- due: 2026-06-15
- permission_level: CODE_SCOPED_WRITE
- code_modification_allowed: true
- language: zh-CN
- dependencies:
  - `PAGESPEED_API_KEY` 已在本地和生产 `.env.local` 配置并由 Codex 验证可用
  - AI-TASK-2026-006-017 可并行执行，但不要互相覆盖同一文件的大段逻辑

## 目标

请 Gemini 将 Google PageSpeed Insights 接入 GenForms.ai Admin Growth 后台，形成可重复使用的“页面性能巡检”能力。

第一阶段只做只读数据展示，不做定时任务、不写数据库、不自动部署。

## 背景

Codex 已经验证 `PAGESPEED_API_KEY` 可用：

```text
本地 mobile PSI:
- Performance: 81
- SEO: 100

生产服务器 desktop PSI:
- Performance: 79
- SEO: 100
```

此前未带 key 调用 PageSpeed API 会返回 429 quota exceeded。现在应该统一通过服务端 API 使用 `process.env.PAGESPEED_API_KEY` 调用，不能把 key 暴露给前端。

PageSpeed / Lighthouse 结果用于补充 GSC、GA4、Clarity：

- GSC：用户是否能搜索发现我们。
- GA4：用户是否进入关键漏斗。
- Clarity：真实用户体验摩擦。
- PageSpeed：页面实验室性能、SEO、可访问性、最佳实践状态。

## 需要读取的文件

请先读取：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-dashboard-shell.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/search-console-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/ga4-funnel-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/clarity-experience-panel.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-actions-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/gsc/summary/route.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/ga4/summary/route.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/clarity/summary/route.ts`
- `/Users/mike/Documents/AIFactory/Code/.env.example`

## 允许修改的文件

只允许修改或新增以下文件：

- `/Users/mike/Documents/AIFactory/Code/app/api/admin/pagespeed/summary/route.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/pagespeed/summary/route.test.ts`
- `/Users/mike/Documents/AIFactory/Code/components/admin/pagespeed-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-dashboard-shell.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-actions-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/.env.example`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-018-execution-report.md`

如果你认为必须修改其他文件，请停止代码修改，在报告中说明原因，等待 Codex 或 Mike 重新授权。

## 禁止触碰的文件和动作

- `.env*` 真实环境文件
- `WorkBuddy/**`
- 支付、认证、账单、数据库迁移文件
- `Code/auth/**`
- `Code/models/**`
- `Code/services/**`，除非只是读取
- 生产部署脚本
- Git commit / git push
- 生产部署
- 删除文件
- 读取或输出任何 API key、token、cookie、secret

## API 设计要求

新增只读 API：

```text
GET /api/admin/pagespeed/summary
```

Query 参数：

- `url`: 可选，默认 `https://genforms.ai/`
- `strategy`: 可选，只允许 `mobile` 或 `desktop`，默认 `mobile`

安全要求：

- 必须复用现有 Admin 鉴权方式，和 GSC/GA4/Clarity 后台 API 一致。
- 未授权返回 `403`。
- 未配置 `PAGESPEED_API_KEY` 返回 `code: 1`，中文提示要可执行。
- Google API 报错返回 `code: 2`，不要透传 key、完整原始错误或敏感信息。
- 内部错误返回 `code: 3`。

缓存要求：

- 使用进程内内存缓存。
- 建议 TTL：12 小时。
- cache key 至少包含：`url`、`strategy`、key 指纹。
- 不写数据库。
- 不引入 Redis。

允许巡检的 URL 白名单：

第一阶段只允许以下 URL，防止后台变成任意 URL 代理：

```text
https://genforms.ai/
https://genforms.ai/templates
https://genforms.ai/posts/typeform-alternatives
https://genforms.ai/forms/new
```

如果传入其他 URL，返回 `code: 1` 或 400，并用中文说明“不在允许巡检范围内”。

建议响应结构：

```json
{
  "code": 0,
  "data": {
    "url": "https://genforms.ai/",
    "strategy": "mobile",
    "scores": {
      "performance": 81,
      "accessibility": 82,
      "bestPractices": 73,
      "seo": 100
    },
    "metrics": {
      "fcp": "1.2 s",
      "lcp": "3.3 s",
      "tbt": "90 ms",
      "cls": "0",
      "tti": "10.5 s",
      "speedIndex": "4.1 s"
    },
    "opportunities": [
      {
        "id": "unused-javascript",
        "title": "Reduce unused JavaScript",
        "displayValue": "Est savings of 411 KiB"
      }
    ],
    "diagnostics": {
      "totalByteWeight": "1,064 KiB",
      "numRequests": 64
    },
    "fromCache": false,
    "lastFetchedAt": "2026-06-13T00:00:00.000Z"
  }
}
```

## 前端展示要求

在 Admin Growth 后台新增一个 Tab：

```text
页面性能 (PageSpeed)
```

要求：

- Admin 中文优先，英文 fallback 可有可无。
- 默认展示 `https://genforms.ai/` + `mobile`。
- 提供 URL 下拉或分段按钮，只能从白名单 URL 选择。
- 提供 `移动端 / 桌面端` 切换。
- 展示四个分数：性能、可访问性、最佳实践、SEO。
- 展示核心指标：FCP、LCP、TBT、CLS、TTI、Speed Index。
- 展示前 5 个机会项 / 诊断项。
- 显示缓存状态和最后更新时间。
- 如果 key 缺失或 API 报错，要显示中文配置提示，不要白屏。

## Growth Actions 联动要求

可以轻量接入 `growth-actions-tab.tsx`：

- 如果 PageSpeed 数据未加载，不要影响 Growth Actions。
- 如果 PageSpeed 数据已加载且：
  - mobile performance < 80，输出“移动端首屏性能需优化”建议。
  - accessibility < 90，输出“可访问性问题影响体验质量”建议。
  - seo < 90，输出“SEO 技术项异常，需优先排查”建议。

如果实现联动会明显增加复杂度，可以先在报告中说明，第一阶段只做独立 Tab。

## 不在本任务内解决

以下只做建议，不要实现：

- 定时巡检 / Cron。
- 把 PageSpeed 结果写入数据库。
- 自动生成历史趋势图。
- 自动创建 GitHub issue 或 AI 任务。
- 修改首页性能问题本身。
- 修改 Stripe、Google Sign-In、Clarity、GTM/GA4 加载策略。

## 验证要求

完成修改后，请至少运行：

```bash
cd /Users/mike/Documents/AIFactory/Code
npx tsc --noEmit
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
npm run build
```

测试至少覆盖：

- 非管理员返回 403。
- 缺少 `PAGESPEED_API_KEY` 返回配置错误。
- URL 不在白名单时返回错误。
- Google API 成功响应被正确映射。
- Google API 报错时不泄露 key。
- 缓存命中。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-018-execution-report.md`

## 报告必须包含

1. 修改文件清单。
2. API 路由设计与鉴权说明。
3. 缓存策略说明。
4. 前端 Tab 展示说明。
5. 是否改变业务逻辑。
6. 是否影响 SEO、登录、支付、埋点。
7. 单元测试结果。
8. `npx tsc --noEmit` 结果。
9. `npm run build` 结果。
10. 下一阶段建议。

## 验收标准

- 不暴露 `PAGESPEED_API_KEY`。
- 不允许任意 URL 代理。
- Admin 后台中文优先。
- 不影响现有 GSC / GA4 / Clarity Tab。
- 不影响登录、支付、表单生成、发布、提交链路。
- TypeScript 类型检查通过。
- 新增 API 单元测试通过。
- 生产构建通过。

