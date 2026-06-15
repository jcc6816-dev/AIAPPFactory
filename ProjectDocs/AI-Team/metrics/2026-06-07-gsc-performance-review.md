# 2026-06-07 GSC Performance Review

> 数据源：`SEOData/https___genforms.ai_-Performance-on-Search-2026-06-07.xlsx`
> 时间范围：过去 24 小时
> 搜索类型：Web

## 1. 总体判断

2026-06-07 的 GSC 数据比 2026-06-06 更健康：

- 总展示：`101`，前一日为 `53`，约增长 `90.6%`。
- 总点击：`1`，首次出现自然搜索点击。
- 查询词数量：`47`，前一日为 `21`，说明 Google 正在扩大试探词面。
- 页面数量：`26`，前一日为 `19`，说明更多页面开始进入搜索曝光池。

注意：查询词表中点击为 `0`，但图表、网页、国家/地区、设备表均显示 `1` 次点击。这通常是 Search Console 对低量查询词做隐私/匿名化处理导致，不是数据矛盾。

## 2. 查询词观察

### 已接近可追踪机会

| 查询词 | 展示 | 平均排名 | 判断 |
| --- | ---: | ---: | --- |
| `genforms` | 2 | 11.00 | 品牌词开始出现，需保证首页 title/description 清晰。 |
| `lead form ai` | 2 | 25.50 | 非品牌 AI 线索表单词，值得继续围绕 lead capture/lead magnet 做内容簇。 |
| `customizable application forms in ats` | 2 | 29.50 | 招聘申请表相关长尾词，说明 job application 方向有机会。 |

### 展示增长但排名偏低

| 查询词 | 展示 | 平均排名 | 判断 |
| --- | ---: | ---: | --- |
| `contact form builder` | 5 | 54.20 | 官网联系表单 / Contact Form Builder 页面需要作为后续内容簇重点。 |
| `ai testimonial collection` | 5 | 78.40 | Testimonial 方向被 Google 试探，但当前排名很弱，不宜急改，先看 3-7 天。 |
| `typeform alternative(s)` 相关词 | 约 25+ | 74-81 | 搜索量方向对，但当前权重不足，不应继续频繁改同一篇文章。 |

## 3. 页面观察

### 已有点击或接近第一页

| 页面 | 点击 | 展示 | 平均排名 | 判断 |
| --- | ---: | ---: | ---: | --- |
| `/` | 1 | 5 | 6.00 | 首页首次拿到点击，说明品牌/首页搜索结果有吸引力。 |
| `/posts/feishu-dingtalk-webhook-notification` | 0 | 4 | 9.75 | 稳定在第一页边缘，进入观察冻结期，不要频繁改。 |
| `/posts/form-builder-with-webhook` | 0 | 1 | 4.00 | 样本小，但排名很好，继续观察。 |
| `/use-cases/ai-lead-capture-form-builder` | 0 | 2 | 25.50 | 有机会作为 AI lead form 内容簇承接页。 |

### 展示高但排名弱

| 页面 | 展示 | 平均排名 | 判断 |
| --- | ---: | ---: | --- |
| `/posts/typeform-alternatives` | 28 | 78.46 | 方向有需求，但竞争强。短期不要再大改，靠外链/相关内容簇提权。 |
| `/solutions/customer-testimonial-collection-form` | 13 | 74.77 | Testimonial 方向开始有曝光，适合后续做内容支撑页，但不要立即重复改页面。 |
| `/use-cases/contact-form-builder-for-websites` | 8 | 70.75 | Contact form 方向开始被试探，应规划专门内容或模板支撑。 |
| `/solutions/job-application-form-builder` | 7 | 45.43 | 招聘表方向排名较上一日有所改善，可继续观察。 |
| `/posts/google-forms-vs-typeform-vs-genforms` | 6 | 37.83 | Google Forms 对比方向有潜力，距离前 30 不远。 |

## 4. 国家与设备

- 美国展示 `66`，英国展示 `14`，说明主要发现流量来自英语市场。
- 点击来自移动设备，移动端展示 `11`、点击 `1`；桌面展示 `90`、点击 `0`。
- 后续页面首屏和搜索摘要应继续偏向英语市场，同时保证移动端落地页体验。

## 5. 建议动作

### 今日不要做的事

- 不要大幅改 `/posts/typeform-alternatives`。它展示最多但排名很低，说明是权重问题，不是单纯文案问题。
- 不要连续改 `/posts/feishu-dingtalk-webhook-notification`。它排名稳定在第一页边缘，应冻结观察。
- 不要一次性发布大量相似博客。当前 Google 正在扩大试探词面，质量优先。

### 今日应该做的事

1. 发布或准备 Webhook 相关高质量文章，继续加强已经有第一页信号的 Webhook 内容簇。
2. 继续保留 AI Lead Capture 长尾博客为草稿或延迟发布，避免同日发布过多相近增长内容。
3. 优先规划 `contact form builder` 与 `testimonial collection` 两个支撑方向，但先做内容 brief 或草稿，不急于上线。
4. 让 Gemini 基于本数据做下一轮内容优先级判断，但必须遵守观察冻结规则。
5. Mike 继续补充 GA4 事件/流量来源截图，用于判断这 1 次自然点击是否产生了站内行为。

## 6. 下一次检查口径

建议 2026-06-08 或 2026-06-09 再看：

- 总展示是否继续高于 `100`。
- 点击是否从 `1` 变成 `2+`。
- `/posts/feishu-dingtalk-webhook-notification` 是否保持前 10。
- `/posts/google-forms-vs-typeform-vs-genforms` 是否靠近前 30。
- `lead form ai` 或 AI lead capture 相关词是否继续出现。
