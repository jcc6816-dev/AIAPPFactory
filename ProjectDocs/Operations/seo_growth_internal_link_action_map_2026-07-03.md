# GenForms SEO Growth Internal Link Action Map — 2026-07-03

> 状态：Audited / Gate Ready  
> Owner：Codex  
> 范围：Typeform、Webhook、Lead、QR / Event Cluster  
> 原则：冻结期内只审计和准备；没有 P0 死链时不提前修改生产页面。

## 1. 结论

当前 Typeform、Webhook、Lead 三个 Cluster 的 owner 与支撑内容已形成可用闭环，不需要为了“做内链”再次改动。唯一明确的信息架构缺口在 QR / Event：已有专门的 QR 线下收集文章，但两个 Use Case 当前都只把飞书/钉钉通知文章作为 Related Guide。

因此，本轮不修改代码。把 QR / Event 内链修正作为 `JUL-B01` 的附属 Gate Action：只有 2026-07-05 QR GSC Gate 通过并打开 Build Batch，才与 QR Visual Proof 单变量一起进入受控发布；Gate 未通过则继续 Hold。

## 2. 当前生产图与判断

| Cluster | Owner | 当前主要支撑内容 | 生产检查 | 结论 |
|---|---|---|---|---|
| Typeform | `/posts/typeform-alternatives`、`/use-cases/typeform-alternative-webhooks` | Google Forms comparison、Lead、Webhook | Owner 与 Use Case 双向可达；CTA 使用 `typeform_alternative + typeform_style` | Healthy / Freeze |
| Webhook | `/use-cases/webhook-form-builder-retry-logs` | send-to-webhook、form-builder-with-webhook、Feishu/DingTalk | 三篇支撑内容均从 Use Case 可达，并回链 owner | Healthy / Hold to 07-08 intent review |
| Lead | `/use-cases/ai-lead-capture-form-builder` | AI lead capture、SaaS lead capture、Typeform alternatives | CTA、支撑文章、相邻 Typeform/Webhook Use Case 均可达 | Healthy / Frozen to 07-11 |
| QR / Event | `/use-cases/qr-code-form-builder`、`/use-cases/event-registration-form-builder` | 当前仅 Feishu/DingTalk；专门文章 `/posts/qr-code-forms-offline-data-collection` 未纳入 Cluster | 专门文章为 200；旧 `/use-cases/ai-event-registration-form-builder` 为 308 到现 owner，不是 404 | Gap / Gate Ready |

## 3. QR / Event 通过 Gate 后的唯一动作包

仅在 `JUL-B01` Build Gate 通过后执行：

1. 在 `Code/services/growth-content-clusters.ts` 中，将 `qr-code-forms-offline-data-collection` 加入 QR Cluster，并放在 Feishu/DingTalk 文章之前。
2. Event Cluster 同样加入该文章，使“活动报名 -> QR 扫码填写 -> 群通知”成为连续路径；不把它描述为票务、核销或 check-in 系统。
3. 在 `Code/components/blocks/blog-detail/post-action-config.ts` 中为该文章增加专属 CTA：
   - template：`event-registration`
   - source：`post_qr-code-forms-offline-data-collection`
   - intent：`qr_form`
   - related owner：`/use-cases/qr-code-form-builder`
4. 保留旧 Event URL 的 308 重定向，不创建新同义 URL。

## 4. 本轮明确不做

- 不给 Typeform、Webhook、Lead Cluster 再堆同义锚文本或新 URL。
- 不在冻结期修改 title、正文、FAQ、CTA 和内链的多个变量。
- 不把 QR 意图扩写成 ticket、payment、admission 或 attendance verification。
- 不因专门文章存在就绕过 2026-07-05 GSC Gate。

## 5. 验证与观测

若 QR Action 获准发布，验证项为：

- 新增链接全部返回 200；旧 Event URL 保持 308 到唯一 owner。
- QR 文章 CTA 打开 `event-registration` 创建路径，并带完整 source / intent。
- QR 与 Event Use Case 均能在首个 Related Guide 位置看到专门文章。
- 发布后冻结 7 天；观察 QR owner 与文章的 GSC page × query、CTA click、attributed create counts。
- U-062 质量门禁通过前，不报告由小样本推导的 conversion rate。

## 6. Gate

| 日期 | 输入 | Pass | Hold |
|---|---|---|---|
| 2026-07-05 | QR 7d/28d GSC page × query | 相关 impressions 仍存在且 owner 位于 11-30，允许并入 `JUL-P01` | 无相关信号、owner 漂移或意图偏票务/核销，保持不改 |

