# GSC 点击到产品激活追踪表

> 生成时间：2026-07-09T14:35:11.538Z  
> 数据来源：Supabase `growth_metric_snapshots` + `growth_events`  
> 说明：当前 GSC 快照为单维度 `query` / `page`，不是精确 query×page 联合维度；“是否进入产品”使用同日/近 7 日站内事件做弱关联。

> 注意：GSC 可能因隐私阈值隐藏部分 query；因此会出现 pages 有点击、queries 仍为 0 click 的情况。

## GSC 汇总

| Range |Snapshot date |Fetched at |Clicks |Impressions |CTR |Avg position |
| --- | --- | --- | --- | --- | --- | --- |
| 1d | 2026-07-07 | 2026-07-09T01:00:03.897+00:00 | 0 | 0 | 0.00% | 0.0 |
| 7d | 2026-07-07 | 2026-07-09T01:00:07.098+00:00 | 0 | 976 | 0.00% | 43.5 |
| 28d | 2026-07-07 | 2026-07-09T01:00:09.661+00:00 | 5 | 3,289 | 0.15% | 45.3 |

## 产品激活弱关联

| Window |/forms/new sessions |forms_new_view |CTA viewed |CTA clicked |login started |login returned |form_created |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-07 | 17 | 17 | 17 | 3 | 1 | 0 | 1 |
| 2026-07-01..2026-07-07 | 31 | 48 | 17 | 3 | 1 | 0 | 6 |

## 1d Top queries

| Query |Clicks |Impressions |CTR |Avg position |处理建议 |
| --- | --- | --- | --- | --- | --- |

## 1d Top landing pages

| Landing page |Clicks |Impressions |CTR |Avg position |是否进入产品 |
| --- | --- | --- | --- | --- | --- |

## 7d Top queries

| Query |Clicks |Impressions |CTR |Avg position |处理建议 |
| --- | --- | --- | --- | --- | --- |
| contact form builder | 0 | 26 | 0.00% | 49.7 | 观察 |
| demo request form | 0 | 24 | 0.00% | 51.0 | 观察 |
| demo form | 0 | 19 | 0.00% | 68.3 | 观察 |
| demo request | 0 | 17 | 0.00% | 72.7 | 观察 |
| free typeform alternative | 0 | 17 | 0.00% | 69.5 | 观察 |
| "live demo form initiated." "winstonhelper.genaddlivedemoemail" | 0 | 16 | 0.00% | 10.1 | 近页机会；暂不大改，观察 CTR |
| automated dispatching software demo request form | 0 | 16 | 0.00% | 48.4 | 观察 |
| form generator | 0 | 15 | 0.00% | 78.6 | 观察 |
| forms generator | 0 | 11 | 0.00% | 68.9 | 观察 |
| free typeform alternatives | 0 | 11 | 0.00% | 72.6 | 观察 |

## 7d Top landing pages

| Landing page |Clicks |Impressions |CTR |Avg position |是否进入产品 |
| --- | --- | --- | --- | --- | --- |
| / | 0 | 157 | 0.00% | 55.4 | 无点击，暂不判断 |
| /posts/lark-feishu-form-webhook-bot | 0 | 137 | 0.00% | 9.0 | 无点击，暂不判断 |
| /templates/demo-request | 0 | 117 | 0.00% | 62.0 | 无点击，暂不判断 |
| /use-cases/demo-request-form-builder | 0 | 94 | 0.00% | 43.6 | 无点击，暂不判断 |
| /posts/typeform-alternatives | 0 | 87 | 0.00% | 63.0 | 无点击，暂不判断 |
| /use-cases/contact-form-builder-for-websites | 0 | 85 | 0.00% | 49.2 | 无点击，暂不判断 |
| /use-cases/ai-lead-capture-form-builder | 0 | 42 | 0.00% | 53.0 | 无点击，暂不判断 |
| /solutions/law-firm-client-intake-form-template | 0 | 34 | 0.00% | 77.7 | 无点击，暂不判断 |
| /posts/feishu-dingtalk-webhook-notification | 0 | 33 | 0.00% | 10.9 | 无点击，暂不判断 |
| /use-cases/qr-code-form-builder | 0 | 28 | 0.00% | 15.5 | 无点击，暂不判断 |

## 28d Top queries

| Query |Clicks |Impressions |CTR |Avg position |处理建议 |
| --- | --- | --- | --- | --- | --- |
| contact form builder | 0 | 121 | 0.00% | 47.2 | 观察 |
| course form | 0 | 33 | 0.00% | 69.2 | 观察 |
| demo request form | 0 | 32 | 0.00% | 49.3 | 观察 |
| demo form | 0 | 27 | 0.00% | 67.1 | 观察 |
| demo request | 0 | 25 | 0.00% | 73.6 | 观察 |
| automated dispatching software demo request form | 0 | 24 | 0.00% | 41.8 | 观察 |
| contact form generator | 0 | 22 | 0.00% | 65.7 | 观察 |
| "live demo form initiated." "winstonhelper.genaddlivedemoemail" | 0 | 20 | 0.00% | 10.0 | 近页机会；暂不大改，观察 CTR |
| client intake for law firms | 0 | 19 | 0.00% | 85.4 | 观察 |
| contact form software | 0 | 19 | 0.00% | 61.5 | 观察 |

## 28d Top landing pages

| Landing page |Clicks |Impressions |CTR |Avg position |是否进入产品 |
| --- | --- | --- | --- | --- | --- |
| / | 1 | 365 | 0.27% | 52.3 | 用 growth_events / Clarity 复核是否进入 /forms/new |
| /zh | 1 | 17 | 5.88% | 27.5 | 用 growth_events / Clarity 复核是否进入 /forms/new |
| /posts/form-builder-with-webhook | 1 | 7 | 14.29% | 7.7 | 用 growth_events / Clarity 复核是否进入 /forms/new |
| /solutions/expense-reimbursement-form-template | 1 | 2 | 50.00% | 34.0 | 用 growth_events / Clarity 复核是否进入 /forms/new |
| /use-cases/ai-event-registration-form-builder | 1 | 1 | 100.00% | 21.0 | 用 growth_events / Clarity 复核是否进入 /forms/new |
| /use-cases/contact-form-builder-for-websites | 0 | 419 | 0.00% | 52.9 | 无点击，暂不判断 |
| /posts/typeform-alternatives | 0 | 417 | 0.00% | 70.6 | 无点击，暂不判断 |
| /posts/lark-feishu-form-webhook-bot | 0 | 401 | 0.00% | 12.4 | 无点击，暂不判断 |
| /posts/feishu-dingtalk-webhook-notification | 0 | 279 | 0.00% | 12.5 | 无点击，暂不判断 |
| /solutions/law-firm-client-intake-form-template | 0 | 158 | 0.00% | 73.5 | 无点击，暂不判断 |

## 点击级人工复盘台账

| 日期 |Query |Landing page |国家 |设备/语言线索 |Click |Impression |Avg position |是否进入 /forms/new |后续动作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-09 | Mike 在 GSC UI 观察到 1 个点击，query 待补 | 待 GSC 快照追上后补 landing page | 待补充 | 疑似非中英；先记录不行动 | 1 | 待补充 | 排名上升，数值待补 | 待按点击发生日期关联 growth_events | 等待下一次 GSC 快照；不新增西语页面 |
| 2026-07-07 | 待从 GSC 单次点击行补充 | 待从 Top landing page / GSC UI 补充 | 待补充 | 如西语/非中英，先记录不行动 | 1 | 待补充 | 待补充 | 近 7 日有 /forms/new 事件，需按时间窗口复核 | 样本 <3：只记录；不新增西语页面 |

## 判定规则

- 单个非中英 query/click：只记录，不开新语言版本。
- 7 天内同类 query ≥3 次曝光上升或 ≥2 次点击：进入关键词/市场复核。
- 点击页同日或近窗进入 `/forms/new`：检查 CTA 与模板承接。
- 点击页未进入产品：优先看页面 CTA、首屏意图匹配和内链，不先扩 SEO 页面。
- `/forms/new` 有 CTA click 但无创建：交给 G2 激活链路继续诊断。
