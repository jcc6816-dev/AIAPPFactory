# Codex 恢复后工程实现清单 (v2 - Reworked)

本清单已根据 Codex 复核意见进行了排重、归类和降级处理。去除了已实现的冗余开发项，并准确区分了“需要开发 (needs_build)”、“已实现需验证 (already_built_needs_verification)”以及“可延期 (defer)”项目。

---

## 一、 核心任务清单 (Top 8 Queue)

### 任务 1：动态挂载并渲染模板详情页 FAQ
*   **状态分类**: `needs_build` (需要工程开发)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
*   **具体改动**: 移除 `page.tsx` 中硬编码的 `templateFaqs` 变量，改为在构建/渲染时导入并读取 [/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json)，按 `templateId` 进行中英文映射渲染。
*   **重要性**: 提升 5 个核心页面的有用信息密度，使 Google 索引能够抓取到最新的 `FAQPage` 结构化数据。

### 任务 2：详情页 CTA 按钮微文案个性化渲染
*   **状态分类**: `needs_build` (需要工程开发)
*   **物理路径**: 
    *   `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
    *   `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
*   **具体改动**: 修改 `page.tsx` 中传递给 `TemplateUseButton` 的 `label` 参数，使其优先从 v2 JSON 的 `ctaMicrocopyEn` / `ctaMicrocopyZh` 字段中加载个性化微文案，若无则回退到 `i18n.use` 默认值。
*   **重要性**: 用更具针对性的按钮文案（如 "Request Early Access" 或 "立即免费获取资料"）引导用户点击，拉高页面转化。

### 任务 3：详情页自然锚文本内链动态注入
*   **状态分类**: `needs_build` (需要工程开发)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
*   **具体改动**: 在 `page.tsx` 页面底部或侧边，新增一个内链组件，读取 v2 JSON 中定义的 `internalLinks` 数组，动态渲染出带有特定锚文本的 `<Link>` 组件。
*   **重要性**: 借用已排名第一页的高权重模板页（如 `content-download`）将权重自然引导至相应的 Solutions 页，防止孤岛页面。

### 任务 4：流量追踪 Referrer 搜索引擎与推广来源纠偏
*   **状态分类**: `needs_build` (需要工程开发)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
*   **具体改动**: 补强 `trackGrowthEvent` 中自执行归因函数的 `source` 提取逻辑，当 UTM 参数缺失时，能够识别出 hostname 中的 `indiehackers.com`, `betalist.com`, `alternativeto.net` 等来源，将其作为流量来源上报给事件接口，防范归入 `direct`。
*   **重要性**: 为 Mike 接下来的外部推广提供准确的渠道效果回溯。

### 任务 5：Webhook 重试失败日志 response_body 自动截取
*   **状态分类**: `needs_build` (需要工程开发)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`
*   **具体改动**: 在 `runMockWebhookSkill` 中的重试失败 catch 块以及 5xx 状态码失败分支中，截取失败返回体的前 200 个字符：
    ```typescript
    lastBody.slice(0, 200)
    ```
    将其作为 `error_message` 存入数据库 `finalizeWebhookLog`，以在控制台日志面板展示具体的服务端错误信息。
*   **重要性**: 提升技术用户排查 Webhook 失败的效率，坐实“带推送日志”的可靠性卖点。

### 任务 6：验证生产环境 Sitemap 动态输出正确性
*   **状态分类**: `already_built_needs_verification` (已实现，仅需验证)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts`
*   **具体说明**: 代码中已具备遍历 `solutionLandingPages` 和 `useCaseLandingPages` 的动态生成逻辑。
*   **验证动作**: Codex 恢复后，直接通过只读命令或浏览器访问生产环境 `/sitemap.xml`，校验输出的 XML 节点中是否包含新上线的 `/solutions/saas-lead-capture-form-builder` 且返回 200，确认无收录遗漏。

### 任务 7：验证 `template_used` 事件 Preference 参数上报
*   **状态分类**: `already_built_needs_verification` (已实现，仅需验证)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
*   **具体说明**: 代码中已实现了将 `sessionStorage` 中缓存的用户偏好设置（如 `theme`, `layout`, `device`）取出并传递至 `trackGrowthEvent("template_used", ...)`。
*   **验证动作**: 本地或生产测试点击 "Use Template" 按钮，在网络拦截器中观察 `/api/growth/events` 的 payload 字段，验证 metadata 中确实包含用户的视觉配置参数，确认 GA4 正常接收。

### 任务 8：本地 SEO 验证自动化脚本补强
*   **状态分类**: `defer` (建议延期到下个冲刺)
*   **物理路径**: `/Users/mike/Documents/AIFactory/Code/scripts/verify-production-seo.sh`
*   **具体改动**: 随着我们逐步把 `solutions` 目录下的新页面部署生产，在脚本中追加对新发布 URL 的 canonical 和 alternate hreflang 的状态校验。
*   **重要性**: 确保未来本地构建时能自动化防御 SEO 路由退化。
