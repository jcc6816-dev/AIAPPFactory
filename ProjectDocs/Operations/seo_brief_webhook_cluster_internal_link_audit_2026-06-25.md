# Webhook Cluster Internal Link Audit Brief

> 创建日期：2026-06-25
> 适用范围：`/use-cases/webhook-form-builder-retry-logs`、`/posts/send-form-submissions-to-webhook`、`/posts/form-builder-with-webhook`、`/posts/feishu-dingtalk-webhook-notification`
> 决策：只做 Webhook Cluster 内链和内容簇配置小修，不重写已冻结页面正文。

## 1. 背景

Webhook Form 是当前 GenForms.ai 已进入主线的 P0 Topic Cluster。

现有资产包括：

- Pillar Page：`/use-cases/webhook-form-builder-retry-logs`
- 教程 Cluster：`/posts/send-form-submissions-to-webhook`
- 支撑 Post：`/posts/form-builder-with-webhook`
- 集成通知 Cluster：`/posts/feishu-dingtalk-webhook-notification`

Clarity 已经出现 Google 来源访问进入 Webhook 相关页面，GSC 历史数据也显示 `/posts/form-builder-with-webhook` 和 `/use-cases/webhook-form-builder-retry-logs` 有小样本高排名信号。因此当前优先动作不是新增内容，而是把已有 Webhook 资产连接成清晰主题簇。

## 2. 审计结论

### 2.1 已通过

`/posts/send-form-submissions-to-webhook` 的博客侧边栏 CTA 已经符合 Webhook Post 标准：

- 主入口指向 `/use-cases/webhook-form-builder-retry-logs`
- 创建入口包含 `intent=webhook_form`
- 创建入口包含 `source=post_send-form-submissions-to-webhook`
- 创建入口使用 `contact-us` 作为实际可承接模板
- FAQPage JSON-LD 已存在，且与页面可见 FAQ 保持一致

`/use-cases/webhook-form-builder-retry-logs` 本身也已具备：

- `intent=webhook_form` 创建上下文
- payload 示例
- delivery status / retry visibility 说明
- FAQPage / SoftwareApplication / BreadcrumbList 结构化数据

### 2.2 发现的问题

代码中的 Topic Cluster 配置没有完整体现 Webhook Cluster。

此前 `growth-content-clusters.ts` 中：

```text
webhook-form-builder-retry-logs -> only feishu-dingtalk-webhook-notification
```

这会导致 Webhook Pillar 页的 Related guides 只稳定展示 Feishu/DingTalk 通知文章，而不会优先展示两篇更直接的 Webhook 支撑资产：

- `/posts/send-form-submissions-to-webhook`
- `/posts/form-builder-with-webhook`

这不利于 Google 理解：

```text
Webhook Pillar
  <- send form submissions to webhook tutorial
  <- form builder with webhook support post
  <- Feishu/DingTalk webhook notification integration article
```

## 3. 本轮执行动作

### 3.1 代码配置

更新 `Code/services/growth-content-clusters.ts`：

```text
webhook-form-builder-retry-logs
  -> send-form-submissions-to-webhook
  -> form-builder-with-webhook
  -> feishu-dingtalk-webhook-notification
```

效果：

- Webhook Use Case 页的 Related guides 会优先展示这 3 篇 Webhook 支撑文章。
- Pillar Page 自动形成更清晰的主题簇入口。
- 不需要改数据库文章正文，避免破坏冻结观察归因。

### 3.2 测试

更新 `Code/services/growth-content-clusters.test.ts`：

- 增加 Webhook Cluster 顺序测试。
- 确保 Webhook Pillar 优先返回 `send-form-submissions-to-webhook`、`form-builder-with-webhook`、`feishu-dingtalk-webhook-notification`。

## 4. 不做什么

本轮不做：

- 不重写 `/posts/send-form-submissions-to-webhook` 正文。
- 不重写 `/posts/form-builder-with-webhook` 正文。
- 不继续大改 `/posts/feishu-dingtalk-webhook-notification`。
- 不新增 Webhook 文章。
- 不改 Webhook Pillar 的 title/meta/H1。

原因：

- 多个页面处于冻结观察期。
- 当前证据支持“内链和主题簇增强”，还不支持“大内容改造”。
- Webhook 主题已有足够页面资产，优先让 Google 更清楚地理解这些页面之间的关系。

## 5. 上线后观察指标

观察窗口：上线后 7 天。

重点看：

- `/use-cases/webhook-form-builder-retry-logs` 的 impressions / average position 是否扩大。
- `/posts/form-builder-with-webhook` 是否从小样本高排名扩大展示量。
- `/posts/send-form-submissions-to-webhook` 是否开始出现 `send form submissions to webhook` / `form webhook` query。
- Clarity 是否继续出现 Google 来源访问进入 Webhook 相关页面。
- GA4 是否出现 `intent=webhook_form` 的 `forms_new_view`、`template_use_click`、`form_generate`。

## 6. 下一步条件

如果 7-14 天后：

- Webhook Pillar 有 impressions 但排名 11-30：进入 Golden Tuning，补 FAQ、payload 示例或操作步骤的小范围信息增益。
- Webhook 支撑 Post 排名 1-10 但 CTR 仍为 0：进入 CTR Rescue，只改 title/meta/摘要相关元素。
- 页面仍有排名但展示太小：优先做外链和相关页面自然提及，不继续频繁改正文。
- 没有任何 GSC 信号但 Clarity/GA4 有 Google 来源：继续等 GSC 回补，不用当天判断失败。

## 7. 当前判断

Webhook Cluster 本轮最正确的动作是：

> 把已被市场和数据验证过的 Webhook 页面连接成清晰内容簇，而不是继续新增页面或重写冻结页面。
