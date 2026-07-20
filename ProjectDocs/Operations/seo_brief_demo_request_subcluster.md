# SEO Architect Brief: Demo Request Form 子集群

> Version: 2026-06-28  
> Loop stage: Validate -> Architect  
> Architect status: Complete, ready for a scoped Build after template truth remediation  
> Parent Topic: Lead Capture

## 1. Architect decision

Demo Request enters the SEO mainline as a Lead Capture subcluster. The owning intent is not calendar booking; it is collecting B2B qualification context before a sales demo.

Positioning:

> AI demo request form builder for collecting work contact details, company context, use case, pain points, team size and evaluation timeline, with a public link or QR code, response dashboard, CSV export and webhook-ready follow-up.

Do not promise calendar availability, confirmed meetings, redirect-on-submit, CRM native sync, automatic lead scoring or production email confirmation.

## 2. Keyword ownership

| Keyword | Owning URL | Decision |
|---|---|---|
| `demo request form builder` | `/use-cases/demo-request-form-builder` | Main sub-pillar |
| `demo request form template` | `/templates/demo-request` | Real template |
| `request a demo form` | Same Use Case | Synonym / FAQ |
| `consultation request form` | No new owning URL | Topic Universe; intent is too mixed |
| `booking request form` | No new owning URL | Template-only backlog |
| `appointment request form` | Reject | Scheduling and medical/government intent |
| `consultation booking form` | Reject | Calendar booking intent |

Do not create Gemini's nested `/solutions/lead-capture/...` routes. The repository uses flat dynamic Use Case and Template routes.

## 3. First Build asset package

| Layer | Asset | First Build |
|---|---|---|
| Parent | `/use-cases/ai-lead-capture-form-builder` | Add task-level related link only; do not change frozen title/meta/body |
| Sub-Pillar | `/use-cases/demo-request-form-builder` | Create |
| Template | `/templates/demo-request` | Create real template ID |
| Support Post | `/posts/saas-lead-capture-form` | Reuse through cluster configuration; no new Post |
| Workflow support | `/use-cases/webhook-form-builder-retry-logs` | Related follow-up path |

No Solution, Alternative, integration page or pSEO page in the first Build.

## 4. Real template

Template ID: `demo-request`

Default template should keep no more than eight questions:

1. Name
2. Work email or preferred contact
3. Company
4. Role
5. Team / company size
6. Main use case or pain point
7. Evaluation timeline
8. Follow-up consent

Optional recommendations on the Use Case page may include current tools, desired outcomes, preferred response method and additional notes.

## 5. Main page

- H1: `AI Demo Request Form Builder`
- Primary CTA: `Create a demo request form`
- Chinese CTA: `创建 Demo 申请表`
- Secondary CTA: `Preview recommended fields`
- Badge: `AI Ready • Share link / QR`

Hero preview must show demo-specific context:

- Company size: 51-200
- Main goal: automate lead intake
- Current workflow: forms + manual follow-up
- Evaluation timeline: this quarter

## 6. Creation context

Use Case:

```text
template=demo-request
source=usecase_demo-request-form-builder
intent=demo_request
prompt=Create a B2B demo request form that collects work contact details, company, role, team size, main use case or pain point, evaluation timeline, and follow-up consent.
```

Template defaults:

```text
template=demo-request
source=template_demo-request
intent=demo_request
```

## 7. Required FAQ boundaries

Visible FAQ and FAQPage JSON-LD must answer:

- What should a demo request form ask?
- Can I create it with AI?
- Can prospects open it from a public link or QR code?
- Where can the team review or export requests?
- Can new demo requests enter a webhook or bot path?
- Does GenForms book a calendar time or send a meeting invite? `No`.
- Does GenForms score leads or sync natively with a CRM? `No`.

## 8. Product redlines

Do not promise:

- real-time calendar slots, calendar sync, scheduling, cancellation or rescheduling
- redirect-on-submit to Calendly / Cal.com / Zoom
- production-grade email confirmation or reminders
- automatic lead scoring
- CRM native sync
- payment or deposit
- embed
- spam protection
- unlimited free
- guaranteed conversion improvement

## 9. Build / Verify / Observe

Build only after the P0 Job Application and Booking Consultation template-truth repair is shipped.

Verification:

- bilingual template and Use Case
- CTA query context
- desktop/mobile hero preview
- canonical/hreflang
- SoftwareApplication, FAQPage and BreadcrumbList
- sitemap
- focused tests and production build

After Ship, freeze 7-14 days and observe:

- `demo request form builder`
- `demo request form template`
- `request a demo form`
- owning URL impressions, clicks, CTR and position
- `intent=demo_request` creation, generation, publish and submission events

