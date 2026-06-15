# 全站 SEO 落地页 CTA 承接逻辑审计与统一方案

> 报告类型：REPORT_ONLY（含 CODE_READ_SCOPED 只读代码审计）
> 执行日期：2026-06-09
> 执行人：Gemini
> 复核人：Codex / Mike
> 报告路径：`ProjectDocs/AI-Team/reports/gemini/cta-audit-unification-proposal.md`
> 代码修改：**禁止。本报告为方案建议，不含任何代码修改。**

---

## 一、权限边界声明

本次执行读取了以下代码文件（CODE_READ_SCOPED 只读）：

- `Code/services/solution-landing-pages.ts`（SolutionLandingPage 接口与全部数据）
- `Code/services/use-case-landing-pages.ts`（UseCaseLandingPage 接口与全部数据）
- `Code/app/[locale]/(default)/solutions/[slug]/page.tsx`（Solution 落地页渲染逻辑）
- `Code/app/[locale]/(default)/use-cases/[slug]/page.tsx`（Use Case 落地页渲染逻辑）
- `Code/app/[locale]/(default)/templates/[templateId]/page.tsx`（Template 详情页渲染逻辑）
- `Code/components/templates/template-use-button.tsx`（CTA 按钮核心组件）

**严格遵守**：未修改任何代码文件，未访问数据库、secrets、.env*，未执行部署或 Git 提交。

---

## 二、CTA 承接机制现状（事实陈述）

### 2.1 核心路由逻辑

全站所有 SEO 落地页（Solution、Use-Case、Template 详情页）的主 CTA 均由 `TemplateUseButton` 组件统一承接。

该组件的路由构建逻辑（`buildTemplateHref` 函数，`template-use-button.tsx` L18-43）如下：

```
目标 URL = /{localePrefix}/forms/new?template={templateId}&source={source}
           [&theme={theme}][&visualDirection={...}][&themeVariant={...}]
           [&device={...}][&layout={...}]
```

**关键结论**：
- CTA 点击后统一落到 `/forms/new` 创建页，并携带 `template` 参数预加载对应模板。
- `source` 参数由各落地页传入，用于区分来源（如 `solution_saas-lead-capture-form-builder`、`usecase_typeform-alternative-webhooks`）。
- 创建页不是"空白首页"，而是带模板预填充的创建流程入口。这是合理的承接设计。

### 2.2 全站 CTA 入口点统计

| 页面类型 | 页面数量 | CTA 组件 | 目标路由 | source 参数规则 |
|---|---|---|---|---|
| Solution 落地页 | 14 个 | TemplateUseButton | `/forms/new?template={id}` | `solution_{slug}` |
| Use-Case 落地页 | 9 个 | TemplateUseButton | `/forms/new?template={id}` | `usecase_{slug}` |
| Template 详情页 | N 个 | TemplateUseButton | `/forms/new?template={id}` | 从 `querySource` 透传 |

### 2.3 各类页面 CTA 文案现状

**Solution 页面**（14 个）CTA 文案摘录：

| slug | CTA 文案（英文）| 特异性评价 |
|---|---|---|
| saas-lead-capture-form-builder | Create a SaaS lead form | ✅ 场景化 |
| event-registration-form-with-qr-code | Create event registration form | ✅ 场景化 |
| lead-magnet-download-form | Create AI download form | ✅ 场景化 |
| job-application-form-builder | Create job application form | ✅ 场景化 |
| saas-nps-survey-form-template | Create NPS survey | ✅ 场景化 |
| newsletter-signup-form-builder | Create signup form | ⚠️ 偏通用，缺少 Newsletter 关键词 |
| website-contact-form-template | Create website contact form | ✅ 场景化 |
| customer-testimonial-collection-form | Create testimonial form | ✅ 场景化 |
| beta-feedback-form-template | Create beta feedback form | ✅ 场景化 |
| community-application-form-template | Create community application | ✅ 场景化 |
| user-interview-recruitment-form | Create interview form | ⚠️ 偏简短，可增加"recruitment"关键词 |
| portfolio-submission-form-template | Create submission form | ⚠️ 偏通用，缺少"portfolio"关键词 |
| expense-reimbursement-form-template | Create reimbursement form | ✅ 场景化 |
| clinic-appointment-request-form | Create appointment form | ✅ 场景化 |
| law-firm-client-intake-form-template | Create client intake form | ✅ 场景化 |
| real-estate-inquiry-form-template | Create property inquiry form | ✅ 场景化 |
| course-registration-form-builder | Create course registration form | ✅ 场景化 |

**Use-Case 页面**（9 个）CTA 文案摘录：

| slug | CTA 文案（英文）| 特异性评价 |
|---|---|---|
| typeform-alternative-webhooks | Create a webhook form | ✅ 场景化 |
| feishu-dingtalk-form-notifications | Create notification form | ✅ 场景化 |
| ai-lead-capture-form-builder | Create lead form | ⚠️ 偏简短，缺少"AI"关键词呼应 |
| waitlist-form-builder-indie-hackers | Create waitlist form | ✅ 场景化 |
| google-forms-alternative-ai | Create an AI form | ⚠️ 偏通用，未呼应"Google Forms alternative"意图 |
| webhook-form-builder-retry-logs | Create webhook workflow | ✅ 场景化 |
| ai-event-registration-form-builder | Create event form | ⚠️ 偏简短，可加"AI"或"registration" |
| customer-feedback-form-builder | Create feedback form | ✅ 场景化 |
| contact-form-builder-for-websites | Create contact form | ✅ 场景化 |
| qr-code-form-builder | Create QR form | ✅ 场景化 |

**Template 详情页** CTA 文案：固定硬编码为 `"Use This Template"`（英文）/`"立即使用此模板"`（中文），从 `i18n.use` 常量渲染，不随模板变化。

---

## 三、发现的问题与优化机会

### 问题 1：Template 详情页 CTA 文案完全固定，缺乏场景特异性

**当前状态**：`template-use-button.tsx` 接收的 `label` 在 Template 详情页中一律为 `"Use This Template"`，与每个模板的具体场景毫无关联。

**影响**：对于通过搜索"job application form maker"进入 `/templates/job-application` 的用户，CTA 文案应强化"立即使用招聘申请模板"而非通用的"Use This Template"。

**优化建议**（供 Codex 决策）：
- 在 `form-templates.ts` 的模板数据中增加 `ctaLabel` / `zhCtaLabel` 可选字段。
- 已有 SEO Override 的模板（`job-application`、`nps-survey`、`content-download`）优先增加场景化 CTA 文案。
- 若不增加字段，最低改动方案：在 `template-detail/page.tsx` 的 `i18n` 对象中按 `template.id` 做条件性 CTA 覆盖。

### 问题 2：3 个 Solution CTA 文案偏通用，降低点击意图匹配

| slug | 当前 CTA | 建议 CTA |
|---|---|---|
| newsletter-signup-form-builder | `Create signup form` | `Create newsletter signup form` |
| user-interview-recruitment-form | `Create interview form` | `Create user interview recruitment form` |
| portfolio-submission-form-template | `Create submission form` | `Create portfolio submission form` |

**影响**：文案过短导致与页面标题/搜索意图不匹配，点击率可能偏低。
**修改位置**：`Code/services/solution-landing-pages.ts` 中对应条目的 `cta` 字段。
**风险等级**：低（纯文案变更，无业务逻辑影响）。

### 问题 3：3 个 Use-Case CTA 文案弱化了页面的核心卖点

| slug | 当前 CTA | 建议 CTA |
|---|---|---|
| ai-lead-capture-form-builder | `Create lead form` | `Create AI lead capture form` |
| google-forms-alternative-ai | `Create an AI form` | `Try the Google Forms alternative` |
| ai-event-registration-form-builder | `Create event form` | `Create AI event registration form` |

**影响**：用户在比较工具场景（Google Forms alternative）时，CTA 若不明确承接搜索意图，会降低转化置信度。
**修改位置**：`Code/services/use-case-landing-pages.ts` 中对应条目的 `cta` 字段。
**风险等级**：低。

### 问题 4：Solution 页面有两个 CTA 并列，优先级不够清晰

**当前状态**（`solutions/[slug]/page.tsx` L214-232）：英雄区并列展示：
1. `TemplateUseButton`（主 CTA，蓝色渐变）
2. "View template"（次要链接，白色边框）

**分析**：当前设计是合理的，主次关系通过视觉区分已经体现。但次要链接跳转到 `/templates/{id}`，模板详情页再次出现 CTA，形成**两跳漏斗**：`Solution → Template 详情 → /forms/new`。

**建议**：保持现状，但在 Template 详情页增加场景化 CTA（见问题 1），确保两跳漏斗不漏转化。

### 问题 5：Use-Case 页面缺少第二 CTA 与内链协同

**当前状态**（`use-cases/[slug]/page.tsx` L216-234）：英雄区也有两个按钮：
1. `TemplateUseButton`（主 CTA）
2. "View template details"（次要链接到模板详情）

**分析**：与 Solution 页结构一致，OK。但 Use-Case 页面底部的"Related use cases"（L451-466）仅链接到其他 Use-Case 页，**未包含 Solution 页的内链**，形成两个内容簇各自孤立的状态。

**建议**：在 Use-Case 页面底部增加至少 1 个到相关 Solution 页的内链卡片（由 Codex 评估实现成本）。

---

## 四、统一 CTA 承接逻辑的整体结论

**现有架构是健康的**，`TemplateUseButton` → `/forms/new?template={id}` 的路由设计清晰、可追踪、有 source 区分，不需要大改。

**优先级排序（供 Codex 参考）**：

| 优先级 | 问题 | 预计改动量 | 推荐时机 |
|---|---|---|---|
| P0 | Template 详情页 CTA 场景化（问题 1） | 中（需在数据层或视图层增加条件逻辑） | 本周 |
| P1 | 3 个 Solution CTA 文案修正（问题 2） | 极低（3 行数据修改） | 本周，可 FAST_TRACK |
| P1 | 3 个 Use-Case CTA 文案修正（问题 3） | 极低（3 行数据修改） | 本周，可 FAST_TRACK |
| P2 | Use-Case 页面补充 Solution 方向内链（问题 5） | 中（需修改页面组件逻辑） | 下周 |
| P3 | Solution 两跳漏斗优化（问题 4） | 依赖 P0 完成后评估 | 后续 |

---

## 五、观察冻结说明

以下页面已被 GSC 索引或接近首页，任何 CTA/FAQ/内链修改后必须进入 3-7 天观察冻结：

- `/templates/content-download`
- `/templates/job-application`
- `/templates/nps-survey`
- `/templates/lead-capture`
- `/templates/event-registration`
- `/use-cases/typeform-alternative-webhooks`
- `/use-cases/ai-lead-capture-form-builder`

**本报告建议的 CTA 文案修改均为纯文案变动（不涉及 title/description/canonical），观察冻结风险较低，但 Codex 最终决定是否需要触发观察期。**

---

## 六、执行报告必填项

- **任务 ID**：非正式任务（由 Mike 直接发起，等待 Codex 后续分配正式 task_id）
- **执行状态**：SUBMITTED
- **读取的文件**：
  - `Code/services/solution-landing-pages.ts`（只读）
  - `Code/services/use-case-landing-pages.ts`（只读）
  - `Code/app/[locale]/(default)/solutions/[slug]/page.tsx`（只读）
  - `Code/app/[locale]/(default)/use-cases/[slug]/page.tsx`（只读）
  - `Code/app/[locale]/(default)/templates/[templateId]/page.tsx`（只读）
  - `Code/components/templates/template-use-button.tsx`（只读）
  - `ProjectDocs/AI-Team/protocol.md`
  - `ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
  - `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-015-execution-report.md`
- **修改的文件**：
  - `ProjectDocs/AI-Team/reports/gemini/cta-audit-unification-proposal.md`（本报告）
- **数据库读取**：none
- **执行的命令**：none
- **验证结果**：纯代码只读审计，未执行任何代码、部署或 Git 操作。
- **风险与不确定点**：
  - `templateFaqs` 只覆盖了 `job-application` 和 `nps-survey` 两个模板，`content-download` 缺少 FAQ 数据（`templateSeoOverrides` 中有，但 `templateFaqs` 无），建议 Codex 补充。
  - Template 详情页 `TemplateUseButton` 使用 `querySource` 透传，如果用户从 Solution 页点击"View template"后再点"Use This Template"，source 会丢失（变为 undefined）。这是一个小的归因漏洞。
- **后续建议**：
  1. Codex 将本报告 P1 级别的 6 处文案修改（3 Solution + 3 Use-Case）评估是否走 FAST_TRACK 直接实现，无需完整任务流程。
  2. Codex 独立评估 Template 详情页 CTA 场景化（P0）的实现方案，在 `form-templates.ts` 数据层还是在 `page.tsx` 视图层做。
  3. 本报告所有建议均需 Codex 或 Mike 复核后才能进入实现。
