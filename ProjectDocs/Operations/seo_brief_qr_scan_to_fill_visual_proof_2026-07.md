# SEO Brief — QR Scan-to-Fill Visual Proof

> 状态：Brief Ready / Build Gate pending 2026-07-05 GSC review
> Topic：QR Code Form
> Owning URL：`/use-cases/qr-code-form-builder`
> Batch：JUL-B01 / JUL-P01
> Primary variable：Visual result proof only

## 1. Decision

不重写 QR 页面，不改 title/meta/FAQ，不新增 URL。若 2026-07-05 最新 GSC 中 owning page 仍有相关 impressions 且平均排名稳定 11-30，则只增加一个视觉证明模块：

```text
Published form link -> QR scan -> mobile one-question flow -> response dashboard
```

若排名回落到 31+、query ownership 消失或证据受隐私阈值影响，则 `Hold`，不为了填 Build Slot 强行实现。

## 2. Evidence

- GSC 截止 2026-07-01：QR Pillar 7d 7 impressions / position 19；28d 53 impressions / position 38.2。
- Google US 真实 capture：`qr code form builder`、`how to create a qr code form`、`qr code event registration form`。
- Codex review：QR intent 是 QR generator + form-link QR + how-to + RSVP/event/check-in 的混合；GenForms 只承接 scan-to-fill。
- 当前页面已经覆盖文本解释、工作流、FAQ 和 ticketing/offline 限制，缺口主要是可见的端到端结果感。

## 3. User Task

用户需要快速确认三件事：

1. 我能否从表单生成一个二维码入口？
2. 扫码后手机填写体验是否顺畅？
3. 提交后数据是否进入同一个面板？

模块必须在不阅读长篇文字的情况下回答这三点。

## 4. Proposed Module

### English

- Eyebrow：`Scan-to-fill workflow`
- H2：`See what happens after someone scans`
- Step 1：`Publish a form link and use its QR code on a poster, counter, classroom, or event sign.`
- Step 2：`The visitor opens a mobile one-question flow in the browser—no app or ticket required.`
- Step 3：`The response appears in the GenForms dashboard for review, CSV export, or webhook-ready follow-up.`

### Chinese

- Eyebrow：`扫码填写流程`
- H2：`看看用户扫码后会发生什么`
- Step 1：`发布公开表单链接，并把二维码放到海报、柜台、课堂或活动指示牌。`
- Step 2：`访客在手机浏览器打开单题流填写，无需安装 App，也不是票券二维码。`
- Step 3：`提交进入 GenForms 数据面板，可查看、导出 CSV 或接入 Webhook-ready 后续流程。`

### Visual composition

- Left：poster/card with QR entry and explicit `Scan to open form` label。
- Center：phone frame displaying the real `event-registration` Template first question and progress state。
- Right：small response-dashboard card with one synthetic, non-PII submission row。
- Connector arrows：`Scan` -> `Fill` -> `Review`。
- Mobile order：QR -> phone -> result；不横向压缩成难读缩略图。

不得使用假 Google/Typeform UI、真实用户数据、无法扫码的“装饰二维码”冒充产品结果。若使用 QR，必须指向稳定的 GenForms demo/public form；否则明确标记为 illustrative preview。

## 5. Product Truth

Allowed：

- AI-generated fields。
- Public link and QR access。
- Mobile browser one-question flow。
- Submission dashboard、CSV、Webhook-ready。

Forbidden：

- Ticket sales、payment、seat inventory。
- Unique ticket QR、badge、check-in scanning。
- Offline app/mode、printing service。
- QR analytics、scan tracking，除非产品实际支持。

当前文本 `Event booths and check-in desks for registration or inquiry collection` 只能解释在签到台收集登记，不能暗示核销或 check-in scanning。

## 6. Ownership and Cannibalization

- QR Pillar：owns generic `qr code form builder` / scan-to-fill workflow。
- Event Pillar：owns event registration form creation。
- Event+QR Solution：owns event registration + QR combination。
- 本模块不增加新的 owning keyword，不改变 URL 分工。

## 7. CTA and Tracking

保持当前 CTA：

- `template=event-registration`
- `source=usecase_qr-code-form-builder`
- `intent=qr_form`
- current QR prompt

模块内不新增第二个竞争 CTA；可使用一个锚点回到现有主 CTA。

U-062 Attribution Repair 完成前：只用 GSC 和 CTA click 的方向信号，不计算 SEO publish/submit rate。

## 8. Planned Files if Build Gate Passes

- `Code/services/use-case-landing-pages.ts`：只给 QR page 增加结构化 visual-proof 文案/配置。
- `Code/app/[locale]/(default)/use-cases/[slug]/page.tsx`：渲染可选 scan-to-fill proof module。
- 对应测试：配置可见、双语、forbidden claims、只在 QR owner 渲染。

不新增第三方 package；可复用现有 QR、phone preview、dashboard visual styles。若不能复用，则返回 Brief 调整，不引入大范围设计系统改造。

## 9. Verify

### Automated

- QR page data test 覆盖新配置。
- Use Case render test 只在目标 slug 出现模块。
- Forbidden claims test。
- TypeScript、相关 Vitest、`npm run build`、全站 SEO Gate。

### Manual

- English/Chinese desktop and mobile。
- QR label、phone question、dashboard card 可读。
- CTA context 未变。
- canonical/hreflang/FAQ Schema 未变化。
- 公网与源站一致。

## 10. Measure

- 发布后冻结 14 天。
- GSC page x query：impressions、position、clicks、CTR。
- CTA：`source=usecase_qr-code-form-builder` / `intent=qr_form`。
- 一轮只看此视觉模块，不同时改 title、FAQ、内链或 CTA。

