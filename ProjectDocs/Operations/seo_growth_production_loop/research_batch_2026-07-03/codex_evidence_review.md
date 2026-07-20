# Codex Evidence Review — Gemini SEO Research Batch 2026-07-03

> Review date：2026-07-03
> Reviewer：Codex
> Scope：9 Google US queries、9 HTML、9 full-page screenshots、`serp_data.json`、3 Topic reports、batch index
> Governing rule：本文件的 Decide 覆盖 Gemini 报告中的置信度、分布比例和产品建议；原始文件保留作为证据，不回写伪造。

## 1. Executive Verdict

| Topic | Evidence | Gemini decision | Codex governing decision | Confidence | Next state |
|---|---|---|---|---|---|
| QR scan-to-fill / event QR | Pass with interpretation repair | Existing Tune / High | **Existing Tune** | **Medium** | QR Visual Proof Brief；Build 等 07-05 GSC Gate |
| Lead form AI | Pass with interpretation repair | Existing Tune / High | **Existing Tune** | **Medium** | Decide complete；冻结至 07-11，不提前 Build |
| Typeform free/cheap alternatives | Pass with distribution repair | Authority / High | **Authority** | **Medium-High** | Authority/Distribution Plan；不重写、不建新 URL |

全部 3 个 Topic 可以退出 Research。没有一个 Topic 获得立即 Build 许可。

## 2. Evidence Profile

| Check | Result |
|---|---|
| Query coverage | 9/9 |
| HTML coverage | 9/9，文件非空 |
| Full-page screenshot coverage | 9/9；1265 px 宽，3858-5584 px 高 |
| US query markers | 9/9 HTML 含 `gl=us`、`hl=en`、`pws=0` |
| Visible location | 截图页脚显示 Illinois / From your IP address |
| Parsed organic rows | 80，不是 90 |
| Query with 10 rows | 3/9 |
| Query with 7-9 rows | 6/9；Google 混排 AI Overview、Videos、Forums、Ads 后首屏自然结果不足 10 |
| Missing parsed snippets | 27/80，33.75% |
| Canonical duplication | `how to create a qr code form` 中 Google Marketplace 同页含 fragment 重复；9 rows / 8 canonical URLs |

Evidence capture 本身可信。更准确的描述应是：`visible first-page organic results, up to 10`，不能声称每个 query 都有完整 Organic Top 10。

可重复检查：`ProjectDocs/Operations/notebooks/gemini_serp_batch_quality_audit_2026-07-03.ipynb`，已成功执行。

## 3. Data Quality Findings

| ID | Finding | Evidence | Severity | Impact |
|---|---|---|---|---|
| SERP-DQ-01 | “所有 query Top 10”表述不准确 | 只有 3 个 query 为 10 rows；总计 80 rows | Medium | 不影响主意图判断，但不能做严格 Top-10 占比 |
| SERP-DQ-02 | Snippet parser 不完整 | 27/80 snippet 为空，部分 snippet 实际是 breadcrumb | Medium | 不适合做精细 copy gap 分析 |
| SERP-DQ-03 | QR event intent 被错误说成“几乎 100% scan-to-fill” | Screenshot/JSON 有 RSVP、generic event QR、Jotform faster check-in、event/check-in 相关结果 | **High** | 若照抄会误承诺 ticket/check-in 能力 |
| SERP-DQ-04 | Lead AI intent 被错误说成单一 form generation | `lead form ai` 同时出现 form generator、AI scoring/qualifying、ChatGPT outreach、CRM/automation 内容 | **High** | 需要窄化到 prompt-to-form，不得宣称覆盖整个 AI lead workflow |
| SERP-DQ-05 | Typeform 40/40/20 分布不准确 | 28 rows 更接近 first-party/product-owned comparison 约 57%、editorial/listicle 约 32%、Reddit 约 11% | Medium | Authority 方向仍成立，但不能说 SERP 主要由第三方列表控制 |
| SERP-DQ-06 | Typeform 产品卖点含错误价格表述 | Gemini 写“买断或固定低价”；当前公开价格为 Free、Pro $19/month、$180/year、Business custom | **High** | 对外分发必须使用真实价格，禁止 lifetime/buyout claim |
| SERP-DQ-07 | 报告未保存精确 capture timestamp | 文件日期与 Batch 日期一致，但报告只写环境，没有 timestamp | Low | 不阻断本批 Decide；下批提示词增加 timestamp 字段 |

## 4. Topic 1 — QR Governing Decision

### What the evidence actually says

- `qr code form builder`：8 个可见 organic rows，主要是 QR generator、Google Forms QR add-on，以及少数 form+QR product。
- `how to create a qr code form`：强 how-to / Google Forms / Microsoft Forms / QR generator 意图。
- `qr code event registration form`：scan-to-fill/RSVP 是重要部分，但同时存在 generic event QR 与 explicit check-in result。

### Product fit

GenForms 可承接：AI 表单、公开链接、二维码访问、移动端单题流、Dashboard、CSV、Webhook-ready。

GenForms 不承接：unique ticket QR、ticket issuance、seat inventory、payment、badge、check-in scanning、offline app。

### Decision

`Existing Tune / Medium`。

唯一信息增益：在 `/use-cases/qr-code-form-builder` 增加一个真实、可验证的视觉模块，展示：

```text
Published form link -> QR scan -> mobile one-question flow -> response dashboard
```

不修改 title/meta，不新增 FAQ，不新增同义 URL。07-05 若 GSC 不再稳定 11-30，则 Brief 保留但 Build Hold。

## 5. Topic 2 — Lead Governing Decision

### What the evidence actually says

- `ai lead capture form builder`：产品页/AI form builder 占主导，但多个结果强调 qualify、conditional logic、CRM、email automation。
- `lead form ai`：最混合；form generator 与 AI scoring/qualification/outreach 同时存在。
- `lead capture form builder`：传统表单/CRM 产品、教程和 lead-response 内容并存。

### Product fit

GenForms 可承接：prompt-to-form、qualification fields、单题流、链接/QR、Dashboard、CSV、Webhook handoff。

GenForms 不承接：AI lead scoring、AI SDR/outreach、enrichment、CRM native sync、conditional logic、production email、spam protection。

### Decision

`Existing Tune / Medium`。

冻结至 07-11。到期且 `lead form ai` 仍稳定前 30 时，候选单变量为“Prompt -> task-specific fields -> one-question preview”，并明确 `collect qualification context, not automated lead scoring`。不新增 Pillar，不用 Zapier/Make native integration 口吻。

## 6. Topic 3 — Typeform Governing Decision

### What the evidence actually says

三个 query 共 28 个可见 organic rows：

- first-party alternative/product-owned comparison 约 16/28，57%。
- editorial/listicle 约 9/28，32%。
- Reddit 约 3/28，11%。

SERP 同时奖励明确的 free-tier 产品页、竞品比较页、listicle 和真实用户讨论。该证据不能单独证明 backlinks 是唯一原因，但足以证明继续全文重写不是当前最高杠杆。

### Decision

`Authority / Medium-High`。

- 保护 `/posts/typeform-alternatives`。
- 不做第二轮全文重写。
- 不建新 Typeform competitor URL。
- 启动受控的第三方 editorial inclusion、事实型社区参与、现有 Cluster 内链保护。
- 对外只使用真实价格：Free、$19 monthly、$180 yearly、Business custom。
- 禁止 `buyout`、`lifetime deal`、`unlimited free`、native CRM/email/conditional logic claims。

## 7. Final Gate

| Topic | Research exit | Brief | Build | Publish |
|---|---|---|---|---|
| QR | Pass | Ready | Pending 07-05 GSC | Closed |
| Lead | Pass | Reserved after 07-11 | Frozen | Closed |
| Typeform | Pass | Authority plan ready | No page Build | No page Publish |

