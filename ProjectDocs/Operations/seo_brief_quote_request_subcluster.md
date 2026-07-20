# SEO Architect Brief: Quote Request Form 子集群

> 版本：2026-06-27  
> Loop 阶段：Validate -> Architect  
> Architect 状态：已完成；2026-06-27 Build、Ship 与 Production Gate 已通过  
> Parent Topic：Lead Capture  
> Gemini 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Quote_Request.md`  
> Codex 复核：`ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Client_Quote_review.md`

## 1. Architect 结论

Quote Request 可以进入 GenForms.ai SEO 主线，但必须定位为：

> AI quote request form for collecting service needs, project scope, budget range, timeline, and contact details, with public-link and QR sharing, response dashboard, CSV export, and webhook-ready follow-up.

中文定位：

> 用 AI 创建询价需求收集表，收集服务类型、项目范围、预算、时间和联系方式，通过公开链接或二维码发布，并在数据面板、CSV 或 Webhook 后续流程中处理询价线索。

它是 Lead Capture 的商业服务子场景，不是自动报价、估价计算、CPQ、报价单、支付或派单系统。

### 1.1 Go / No-Go

| 判断项 | 结论 |
|---|---|
| Validate 是否通过 | 通过，带 SERP 数据完整性 caveat |
| Architect 是否通过 | 通过 |
| 是否进入 Build | Go，第一批只做一个主承接页和一个真实模板 |
| 是否新建多个 Service Quote 页面 | No-Go |
| 是否做 `estimate request form` 页面 | No-Go，意图混杂且偏政府/退休估算 |
| 是否启动 pSEO | No-Go，等待主页面和模板真实数据 |

## 2. 证据与限制

Google US 研究覆盖：

- `quote request form`
- `request a quote form`
- `quote request form template`
- `price quote request form`
- `estimate request form`
- `service quote request form`

原始证据有真实 Google HTML、`gl=us&hl=en&pws=0` 参数且无 CAPTCHA。Track B 共保存 58 条自然样本，不是每词完整 Top 10；截图均为 756x469 首屏，部分只显示 AI Overview 或图片区。

另有两条视频结果把浏览量文本误当 URL，多条 `/goto?url=` 只还原到泛目录。证据足够支持 Topic 和页面类型判断，但不能声称完整 URL 100% 准确。

## 3. 关键词与页面所有权

| 关键词 | Owning URL | 页面角色 | 决策 |
|---|---|---|---|
| `quote request form` | `/use-cases/quote-request-form-builder` | 主承接页 | P1 |
| `request a quote form` | 同一主承接页 | 同义创建意图 | P1 |
| `service quote request form` | 同一主承接页的场景/FAQ | 服务型细分 | P1/P2 |
| `quote request form template` | `/templates/quote-request` | 真实模板 | P1 |
| `price quote request form` | 当前不设 owning URL | RFQ/邮件/采购混合 | P2 |
| `estimate request form` | 不创建页面 | 退休金、政府、行业估价混合 | Reject |

不创建：

- `/solutions/lead-capture/quote-request-form`
- `/templates/service-quote-request`
- `/templates/free-quote-request-form`
- `/use-cases/request-a-quote-form`
- `/use-cases/estimate-request-form`

## 4. Topic 资产包

| Layer | 资产 | 角色 | 第一批动作 |
|---|---|---|---|
| Parent Pillar | `/use-cases/ai-lead-capture-form-builder` | 通用获客母 Topic | 与 Quote Request 互链，不抢 quote 词 |
| Quote Sub-Pillar | `/use-cases/quote-request-form-builder` | quote / request a quote 主意图 | 第一批 Build |
| Template | `/templates/quote-request` | quote request form template | 第一批 Build，必须是真实模板 ID |
| Support Post | 复用 Lead Capture Post | 解释线索收集与资格筛选 | 第一批只做相关内链，不新写 Post |
| Technical support | `/use-cases/webhook-form-builder-retry-logs` | 询价后的可靠流转 | 高级后续路径 |

第二阶段只有出现真实 query 后，才考虑 `quote request form fields` 或 `how to create a request a quote form` Post。

## 5. 真实模板定义

Template ID：`quote-request`

推荐字段：

1. Name
2. Work email or preferred contact
3. Company / organization
4. Service needed
5. Project or request summary
6. Budget range
7. Desired timeline
8. Location or service area（可选）
9. Preferred response method
10. Additional notes
11. Follow-up consent

不能包含或暗示：

- 文件、照片、图纸上传
- 自动计算价格
- 正式报价单或 PDF 生成
- 支付、订金、订单和发票
- 现场预约、估价排班或派单

## 6. 主页面结构

### 6.1 首屏

- H1：`AI Quote Request Form Builder`
- 描述：`Create a mobile-friendly request-a-quote form for service needs, project scope, budget, timeline, and contact details. Share it by link or QR code, review responses, export CSV, and route qualified requests through webhook-ready follow-up.`
- 主 CTA：`Create a quote request form`
- 中文 CTA：`创建询价表单`
- 二级 CTA：`Preview recommended fields`
- Badge：`AI Ready • Share link / QR`

右侧预览必须是询价表单，不使用 Contact Us 或泛 Lead Capture 预览：

- Service needed: Website redesign
- Budget range: $5k-$10k
- Desired timeline: 6-8 weeks
- Project summary
- Preferred response method

### 6.2 任务说明

页面需要清楚解释：

```text
Describe the service inquiry
-> AI drafts quote-request fields
-> Publish a public link or QR code
-> Prospect submits scope, budget, and timing
-> Team reviews responses or exports CSV
-> Optional webhook/bot follow-up
```

### 6.3 FAQ

1. Can I create a quote request form with AI?
2. What fields should a quote request form include?
3. Can customers open the form from a QR code?
4. Where can I review and export quote requests?
5. Can quote requests be sent to a webhook or team bot?
6. Does GenForms calculate prices or generate formal quotes?
7. Can customers upload plans or photos?

最后两项必须明确当前不支持自动报价、正式报价单和文件上传。

## 7. CTA 创建上下文

### 7.1 Use Case

```text
/forms/new?template=quote-request
  &source=usecase_quote-request-form-builder
  &intent=quote_request
  &prompt=Create a quote request form that collects contact details, service needed, project scope, budget range, desired timeline, preferred response method, notes, and follow-up consent.
```

### 7.2 Template

```text
template=quote-request
source=template_quote-request
intent=quote_request
```

从 Use Case 进入 Template 时必须保留上游 source、intent 和 prompt。

## 8. 内链架构

| From | To | 任务型锚文本 |
|---|---|---|
| Lead Capture Pillar | Quote Sub-Pillar | `create a quote request form` |
| Quote Sub-Pillar | Lead Capture Pillar | `AI lead capture form builder` |
| Quote Sub-Pillar | Quote Template | `start with the quote request template` |
| Quote Template | Quote Sub-Pillar | `quote request form builder` |
| Quote Sub-Pillar | Webhook Pillar | `route new quote requests through a webhook` |
| 相关 Lead Capture Post | Quote Sub-Pillar | `qualify service inquiries with a quote request form` |

## 9. Schema

| 页面 | Schema |
|---|---|
| Quote Use Case | `SoftwareApplication` + 可见 `FAQPage` + `BreadcrumbList` |
| Quote Template | `SoftwareApplication` + 可见 `FAQPage` + `BreadcrumbList` |

不添加 Review、AggregateRating、虚构报价金额、完成率或用户数量。FAQ JSON-LD 必须与可见问答一致。

## 10. 产品边界

### 10.1 已支持

- AI 生成表单
- 移动端单题流
- 公开分享链接和二维码
- 提交收集与数据面板
- CSV 导出
- Webhook 配置、日志和失败重试
- Feishu / DingTalk / WeCom / Slack Bot 路径

### 10.2 部分支持

- Lead qualification：通过字段收集预算、范围和时间，不是自动评分引擎。
- Team follow-up：通过数据面板、CSV 或 Webhook/Bot 流转，不是 CRM 或派单系统。
- Free：只按真实套餐额度描述，不写 unlimited free。

### 10.3 不能承诺

- Instant quote calculator / CPQ
- Pricing formulas
- Formal proposal / PDF quote generation
- File / photo / blueprint upload
- Payment / deposit / invoice / order
- On-site estimate scheduling / dispatch
- CRM native sync
- Production-grade email confirmation
- Spam protection
- Guaranteed conversion lift

## 11. Build Goal 范围

下一 Build 只允许：

1. 新增真实 `quote-request` 模板及字段、双语文案和边界 FAQ。
2. 新增 `/use-cases/quote-request-form-builder`。
3. 增加 `intent=quote_request` 的 Use Case 与 Template 创建上下文。
4. 接入 Lead Capture Parent、Template、Webhook 和一个现有 Lead Capture Post 的任务型内链。
5. 增加 canonical、hreflang、sitemap、Schema 和定向测试。
6. 本地完成英文/中文、桌面/移动视觉验证。
7. 产品事实与 UX Gate 通过后再部署。

明确不做：

- 不新建 Solution 页面。
- 不新写 Post。
- 不创建 Service Quote / Estimate 近义页。
- 不修改 Lead Capture 冻结页面的 title/meta/正文。
- 不启动 pSEO。

## 12. Observe / Decide

上线后冻结 7-14 天，观察：

GSC：

- `quote request form`
- `request a quote form`
- `quote request form template`
- `service quote request form`
- 两个 owning URL 的 impressions、clicks、CTR、position

Growth：

- `template_use_click`
- `forms_new_view`
- `ai_generate_submitted`
- `form_publish`
- `form_submit`
- `intent=quote_request`

## 13. Build / Verify 记录（2026-06-27）

- 新增真实 `quote-request` 双语模板，默认保留 8 个核心问题，避免移动端填写过长。
- 新增 `/use-cases/quote-request-form-builder`，含任务型首屏、推荐字段、工作流、产品边界 FAQ 与 Topic 内链。
- Use Case 与 Template CTA 均接入 `intent=quote_request`；Template 默认使用 `corporate-intake` 视觉方向。
- 复用 `/posts/saas-lead-capture-form` 作为第一批支撑 Post，不新写文章、不新增 Solution 或近义 URL。
- 26 个定向测试通过，`npm run build` 通过；桌面、移动、中英文、canonical、FAQ Schema、可见 FAQ 和 sitemap 均完成本地验收。
- Pre-Ship Audit：`ProjectDocs/Operations/audits/quote-request-subcluster-2026-06-27/README.md`。
- 生产验证：中英文 Use Case/Template 均返回 200；两条 CTA、SoftwareApplication/FAQPage/BreadcrumbList、sitemap、全站 SEO Gate 与 Release State Gate 均通过。
- Loop 已转入 Observe，冻结至 2026-07-11。
- Use Case 与 Template source 分布

如果 query 偏向自动报价、PDF、上传或 estimate，优先降低预期，不扩产品承诺。

## 13. Loop 状态迁移

`Quote Request` 从 `Validate` 进入 `Architect Complete / Ready for Build`。

下一个 Goal：

> Build Quote Request 子集群：实现真实 Quote Request 模板、主 Use Case、创建上下文、内链、Schema、测试和本地 UX Gate。
