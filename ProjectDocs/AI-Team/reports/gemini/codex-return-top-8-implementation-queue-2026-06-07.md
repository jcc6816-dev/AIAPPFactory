# Codex 恢复后 Top 8 优先实现任务清单 (2026-06-07)

本清单由 Gemini 梳理，基于今日 `CODE_READ_SCOPED` 权限对代码库核心文件的审计结果。Codex 恢复后，可直接按此清单安排实现任务，大幅缩短排期和节省 Token 消耗。

---

## 1. 任务一：动态挂载并渲染模板 FAQ 问答对
*   **任务描述**: 将目前硬编码在 `page.tsx` 中的 `templateFaqs` 静态变量移除，改为从 `/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json` 中动态读取对应 `templateId` 与当前 `locale` 的中英文 FAQ。
*   **为什么重要**: 该文案包新增了 `content-download`, `job-application`, `nps-survey` 的高度相关搜索意图解答，上线后可在 GSC 中触发富媒体 FAQ 卡片，大幅提升 CTR。
*   **关联目标**: 里程碑 3（第一批优化与内容簇增强）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
*   **测试建议**: 本地启动 `npm run dev`，访问 `/templates/job-application` 与 `/zh/templates/job-application`，确认页面底部渲染正确的 FAQ，并检查页面源码中 `@type: FAQPage` 的 JSON-LD 结构化数据是否输出正确。
*   **是否需要部署**: 是
*   **是否能延后**: 否，应第一优先实现以尽快重新提交 GSC 抓取。

---

## 2. 任务二：模板页 CTA 按钮微文案个性化定制
*   **任务描述**: 将 `page.tsx` 中默认传递给 `TemplateUseButton` 的固定 `i18n.use`（"Use This Template"）更改为可自定义的微文案。根据我们写入的 JSON 文件中的 `ctaMicrocopyEn` 和 `ctaMicrocopyZh` 进行匹配渲染。
*   **为什么重要**: 相比于通用的“立即使用”，类似“Request Early Access”（早期申请）或“立即免费获取资料”能让用户心理预期与当前模板高度对齐，极大提升转化率。
*   **关联目标**: 访客激活路径优化（工作流 C）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
*   **测试建议**: 确认各个模板详情页渲染出定制的 CTA 按钮，并确认点击该按钮时，传递给 `trackTemplateUse` 事件的 `cta_text` 参数也是个性化文案。
*   **是否需要部署**: 是
*   **是否能延后**: 否，与 FAQ 渲染配合一并修改。

---

## 3. 任务三：模板详情页关联内链的动态渲染
*   **任务描述**: 在 `page.tsx` 的相关用例/解决方案（Related Solutions / Related Use Cases）卡片上方，增加一个纯文本的、包含高权重锚文本的内链组件，渲染我们在 JSON 中定义的 `internalLinks` 数组，使其自然融入详情页面。
*   **为什么重要**: 目前模板页（如 `content-download` 排名第 7）权重高，需要利用内链（锚文本: `AI Lead Magnet Download Form`）将权重传递给对应的 Solutions 入口页，拉升 Solutions 页排名。
*   **关联目标**: 增强内链内容簇（工作流 B）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
*   **测试建议**: 验证页面展示的内链是否带有 `rel="dofollow"`，且链接完全正确。
*   **是否需要部署**: 是
*   **是否能延后**: 可稍微延后，但建议本周完成。

---

## 4. 任务四：GA4 模板使用事件 (`template_used`) 深度参数补强
*   **任务描述**: 补强 `TemplateUseButton` 中的 `trackGrowthEvent("template_used")` 参数，除了目前的 `template_id`，需要将当前的 `preferences`（如 `theme`, `layout`, `device`, `visualDirection`）以及按钮上展示的 `cta_text` 全部作为 metadata 一并发送至埋点后台。
*   **为什么重要**: 目前 GSC 曝光开始起量，我们必须有更精细的漏斗数据来识别：用户偏爱什么类型的主题（Dark/Light/Minimal），从何种屏幕（Mobile/Desktop）进入，从而优化表单播放器的默认配置。
*   **关联目标**: 数据衡量（工作流 D / AI-TASK-2026-006-016）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
*   **测试建议**: 在浏览器控制台中触发点击，拦截 Beacon 请求，确认 `/api/growth/events` 的 payload 包含新增的 JSON 参数。
*   **是否需要部署**: 是
*   **是否能延后**: 可延后，但建议在下周流量爆发前完成。

---

## 5. 任务五：GA4 归因纠偏与 Referral 来源自适应修正
*   **任务描述**: 优化 `growth.ts` 中的 `source: (() => { ... })` 归因逻辑，当用户未携带 UTM 标签但携带有 `document.referrer` 时，更精准地过滤并匹配常见的搜索引擎（Google/Bing/Baidu）和推广社区（Indie Hackers, V2EX, Reddit, BetaList）的 hostname，避免其全部滑入 `direct`。
*   **为什么重要**: 随着 Mike 今日开始手动执行外部提交与 IH 发帖，我们需要准确知道哪一个外部链接为我们带来了表单创建量（`template_used`），以评估推广效果。
*   **关联目标**: 数据衡量（工作流 D）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
*   **测试建议**: 伪造 `document.referrer`（如 `https://www.indiehackers.com/`），测试事件触发后的 payload 中 `source` 字段是否归因为 `indiehackers.com`。
*   **是否需要部署**: 是
*   **是否能延后**: 否，发布前夕必须保障归因精准。

---

## 6. 任务六：自动生成 Sitemap 时包含全新 Solution 页面
*   **任务描述**: 检查代码库中动态生成 `sitemap.xml` 的模块，确认所有在 `solution-landing-pages.ts` 和 `use-case-landing-pages.ts` 中定义的 `slug` 是否已被完全遍历并渲染。
*   **为什么重要**: 保证任何新加入的场景页面无需 HR/运营人员手动添加即可被 Googlebot 发现。
*   **关联目标**: 保持 sitemap 和 canonical 健康（工作流 A）。
*   **风险等级**: 低风险 (Low)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts` (或 sitemap.xml 动态生成逻辑文件)
*   **测试建议**: 访问 `/sitemap.xml`，核对输出的 XML 节点中是否包含了 `/solutions/saas-lead-capture-form-builder` 等核心链接。
*   **是否需要部署**: 是
*   **是否能延后**: 否。

---

## 7. 任务七：在本地 SEO 验证脚本中补充新页面校验
*   **任务描述**: 在本地自动化 SEO 校验脚本中，补充对我们已曝光的 5 个页面以及即将发布博客的 Canonical URL、多语言 `hreflang` 和 x-default 的正则检查项。
*   **为什么重要**: 保证我们在下一次项目构建或改码时，不会无意间破坏现有的 SEO 第一页成果。
*   **关联目标**: 本地构建质量关卡。
*   **风险等级**: 极低风险 (Minimal)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/scripts/verify-production-seo.sh`
*   **测试建议**: 本地直接运行 `bash scripts/verify-production-seo.sh`，确认输出全部为 `PASS`，且测试能拦截故意写错的 canonical 路径。
*   **是否需要部署**: 否 (仅限本地开发脚本)
*   **是否能延后**: 可以延后。

---

## 8. 任务八：Webhook 异常状态日志的结构化日志增强
*   **任务描述**: 在 `runMockWebhookSkill` 或 webhook 推送主函数中，当重试 4 次均告失败（或出现 4xx 级别的 Bad Request）时，在 `finalizeWebhookLog` 的 `error_message` 字段中自动截取前 200 个字符的 `response_body` 详情，以作为结构化报错日志保存。
*   **为什么重要**: 方便开发者在控制台日志面板中一眼看出是“Header token 过期”还是“JSON 字段定义错误”，彻底坐实“带重试日志的可靠 Webhook 自动化”这一商业卖点。
*   **关联目标**: Webhook 重试与日志审计（工作流 D）。
*   **风险等级**: 中低风险 (Low-Medium)。
*   **需要修改的文件**:
    *   `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`
*   **测试建议**: 编写 Mock 测试或让 Webhook 推送至一个返回 400 的测试地址，确认控制台的日志表中完整抓取了 response 报错正文。
*   **是否需要部署**: 是
*   **是否能延后**: 可延后。
