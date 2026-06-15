# GSC / GA4 今日数据采集与解读说明书

为确保我们在 Codex 低可用期间能够科学地衡量流量波动，并使下一步的内容和 SEO 调整拥有精准的数据支撑，Mike 今天需要协助进行以下数据的导出或截图。

---

## 一、 Mike 今日数据采集清单 (GSC & GA4 截图/导出步骤)

### 1. Google Search Console (GSC) 性能分析
*   **截图/导出页面**: 效果 (Performance) -> 搜索结果 (Search Results)
*   **筛选条件**:
    *   日期：过去 24 小时（或最新可用日期，通常有 1-2 天延迟）。
    *   搜索类型：网页 (Web)
*   **需要导出的具体表格**:
    1.  **查询词 (Queries) 列表**: 按展示次数 (Impressions) 从高到低排序，需要前 50 个查询词的：点击数、展现数、点击率和平均排名。
    2.  **网页 (Pages) 列表**: 按展示次数排序，需要前 20 个 URL 的点击与展现数据。
*   **看什么指标**:
    *   **大盘总展现 (Impressions)**: 对比 2026-06-05 的 50+ 次，确认总展现是否呈现周环比或日环比增长。
    *   **核心关键词的平均排名 (Average Position)**: 特别关注 `lead form ai download`, `job application builder`, `typeform alternatives` 的排名漂移情况。

### 2. Google Analytics 4 (GA4) 流量与事件分析
*   **截图/导出页面**: 报告 (Reports) -> 参与度 (Engagement) -> 事件 (Events)
*   **筛选条件**:
    *   日期：过去 7 天 (由于冷启动期刚开始，按周颗粒度看大势)。
*   **要看的事件与指标**:
    *   `page_view`: 确认主站总流量。
    *   `cta_click` 或 `form_create_intent`（如果已布设）: 统计有多少访客点击了各页面的 "Use Template" 或 "Create Form" 按钮。
    *   通过流量获取 (Traffic Acquisition) 报告，确认是否有来自 `Direct` 以外的自然搜索流量（Organic Search）或外部引流渠道流量（如 `referral` 来自 Indie Hackers 或 BetaList）。

---

## 二、 关键决策判断标准

### 1. 如何判断是否需要继续发新内容？
*   **继续发新的标准**:
    *   现有博客的展示量 (Impressions) 在持续上升，但查询词数量（Search Queries）开始遇到天花板（说明当前词簇已基本被 Google 收录完毕，需要开辟新的选题方向）。
    *   我们已有的 P0 级博客已在第一页稳定（如 `/posts/feishu-dingtalk-webhook-notification` 排名 9.8），我们需要通过发布第二批相关博客（如飞书/钉钉群推送进阶用法）来构建“内容簇”传递权重。
*   **暂停发新、聚焦提权的信号**:
    *   大盘展现量开始停滞或下滑。此时说明主站权威度（Domain Authority）不足以支撑新内容收录，应暂停高频发新，将精力 100% 放在向外部目录（BetaList, AlternativeTo）提交项目以换取 Backlinks 上。

### 2. 如何判断是否应该优化某个页面？
*   **优化网页的黄金判断法则**:
    *   **展现量高，但排名在第 2-3 页 (Rank 11 - 30)**: 这是最值得微调优化的黄金页面。说明 Google 对该页感兴趣，只需微调标题中的点击诱饵词、增稠 FAQ 并重新提交 GSC 重新抓取，极易将其推入第 1 页。
    *   **排名已在第 1 页 (Rank 1 - 10)，但点击率 (CTR) 低于 2%**: 该页面标题和描述对用户缺乏吸引力。需要立即优化 Meta Title/Description，增加“免费、3步、2026最新”等吸引点击的字眼。
    *   **展现高、排名低 (Rank 70+)**: 此时不要频繁改动网页正文，说明是站点权重问题，频繁修改正文反而容易被 Google 判定为不稳定，应通过外链提权。

---

## 三、 SEO 观察冷冻期名单 (3-7天绝对禁动)

根据 2026-06-05 及今日的 GSC 表现，以下 5 个页面表现活跃，**已进入 3-7 天观察冷冻期**。今日起 **Mike 与 Gemini 严禁对这些页面的 URL 路径、TDK (Title/Desc/Keywords)、正文及 Canonical 作任何改动**：

1.  `/templates/content-download` (Google 展现排名第 7)
2.  `/use-cases/google-forms-alternative-ai` (Google 展现排名第 9)
3.  `/posts/feishu-dingtalk-webhook-notification` (Google 展现排名第 9.8)
4.  `/solutions/lead-magnet-download-form` (Google 展现排名第 12)
5.  `/templates/job-application` (已做 FAQ/Schema 注入，进入观测期)

*冷冻到期日：2026-06-12 至 2026-06-14。到期后，我们将根据最新的 GSC 展现漂移数据，决定是否启动第二轮微调。*
