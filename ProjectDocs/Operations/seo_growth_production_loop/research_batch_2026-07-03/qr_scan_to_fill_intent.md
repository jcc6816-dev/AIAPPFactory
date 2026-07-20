# Topic 1: QR scan-to-fill / event QR

## 1. Environment and evidence status
Success. Captured in Google US (gl=us&hl=en&pws=0) via Playwright after manual CAPTCHA clearance. Evidence saved in `evidence/`.

## 2. Query list and evidence file mapping
- `qr code form builder`: `evidence/qr_code_form_builder.*`
- `how to create a qr code form`: `evidence/how_to_create_a_qr_code_form.*`
- `qr code event registration form`: `evidence/qr_code_event_registration_form.*`

## 3. Organic Top 10 tables
(See `serp_data.json` for full URLs and titles).
Top domains include: Canva, Jotform, Adobe, The QR Code Generator, RSVPify, Microsoft Support.

## 4. SERP feature and page-type distribution
- Product Pages: ~50% (Canva, Jotform, Adobe landing pages for their QR features)
- Generic QR Generators: ~30% (QR Code Monkey, The QR Code Generator)
- Tutorials/How-tos: ~20% (Microsoft Support, YouTube)

## 5. Search intent conclusion
- SERP 是需要产品页、教程、模板页，还是 QR generator？
  答：SERP 高度混合了**产品落地页**（Form builders with QR features）和**纯粹的 QR Generator 工具**，以及少量的“How to”教程。
- `qr code event registration form` 是“scan to fill”还是“ticket/check-in QR”？分别占多少自然结果？
  答：几乎 100% 的自然结果都是 **“scan to fill”**（创建带有 RSVP 表单链接的二维码供访客扫描），而不是生成唯一的个人检票二维码。

## 6. Competitor patterns and information gain
- 竞品（如 Jotform, Canva）强调整体内置的二维码生成体验。
- 最明确的信息增益（Information Gain）是：**结果感模块（Visual Proof / Experience）**。即向用户展示“扫描二维码后，在手机端单题流填写是多么流畅”。传统的 Google Forms 或普通 QR 工具无法提供优化的移动端单题填写体验，这是 GenForms 最大的差异化。

## 7. GenForms product fit and product gaps
- Fit: GenForms 支持发布公开链接和二维码分享，且移动端单题流体验极佳，完美匹配“Scan to fill”场景。
- Gap: 不支持唯一的票券二维码或现场核销（Ticket/check-in QR），但这符合目前的 SERP Intent，不需要该功能。

## 8. Existing owner and cannibalization decision
- 当前 Pillar 为 `/use-cases/qr-code-form-builder`，Event 归属 `/use-cases/event-registration-form-builder`，未见明显的 cannibalization 风险。

## 9. Recommended single next action
Execute a Golden Tuning on `/use-cases/qr-code-form-builder`. Add highly visual "Scan to fill mobile experience" mockups to provide immediate visual information gain over generic QR generators.

## 10. Final decision
`Existing Tune`

## 11. Confidence
High. The SERP results are extremely clear that the intent is scan-to-fill, aligning perfectly with GenForms' current core capabilities (mobile single-question flow + QR generation).
