# Course Registration / Community Application UX Build Review

Date: 2026-06-28

## Verdict

- Course Registration Brief: Agree, with build requirements.
- Community Application Template-only Brief: Agree, with build requirements.
- Build gate: Allowed. Production remains blocked until desktop/mobile rendering, CTA context, redirect, and product-boundary tests pass.

## Evidence steps

1. Course Solution desktop hero - Needs build
   - Evidence: `01-course-desktop.png`
   - The current H1 and supporting copy communicate course/training/workshop registration, but the right hero area renders without a useful form preview.
   - Current CTA lacks `intent=course_registration` and the bounded prompt.
   - The secondary CTA still opens the Template instead of previewing fields.

2. Course Solution mobile hero and reading order - Needs build
   - Evidence: `02-course-mobile.png`, `06-course-mobile-fields.png`, `07-course-mobile-faq-links.png`
   - The main task is understandable, but internal cards for search intent, prompt, and target audience delay the recommended fields on mobile.
   - Current related links are generic and include Typeform and Lead Capture paths that dilute the Course task.

3. Course Template - Needs boundary corrections
   - Evidence: `05-course-template-desktop.png`
   - The real template contains the correct core fields: student name, contact, course choice, experience, and learning goal.
   - Calendar artwork, `class details delivery`, `开课通知`, and confirmation-message actions can imply scheduling or automated communication and must be neutralized.

4. Community Template desktop/mobile - Needs cleanup, structure is sufficient
   - Evidence: `03-community-desktop.png`, `04-community-mobile.png`
   - The Template already has a strong preview, field table, and direct create action, so it can carry the long-tail intent after the Solution retires.
   - Current copy still says `入群审核`, `入群通知`, and `30秒部署`, lacks visible manual-review/external-invite FAQ, and links back to the Solution that will be retired.

## Course must-change requirements

### Desktop

1. Use a course-specific hero preview built from real `course-registration` fields. Show at least student/contact, course choice, experience, and learning goal. Do not use a blank panel, generic contact form, ticket UI, payment state, seat count, or calendar-confirmation UI.
2. Use the exact CTA hierarchy: `Create a course registration form` / `创建课程报名表`, then `Preview registration fields` / `查看报名字段` linking to `#recommended-fields`.
3. Pass `template=course-registration`, `source=solution_course-registration-form-builder`, `intent=course_registration`, and the bounded prompt.
4. Remove `Payment or confirmation status` and every payment, seat, confirmation-email, redirect, attendance, certificate, LMS, CRM, or embed implication.
5. Keep the content order: Hero -> recommended fields -> workflow -> FAQ -> related links. The current search-intent/prompt/audience cards should be removed for Course or converted into a compact user-facing strip that does not delay fields.

### Mobile

1. Keep the primary CTA before the preview and make the secondary CTA a field anchor.
2. Place the real field preview immediately after the CTA area; recommended fields should follow without three tall internal-planning cards.
3. Keep the nine fields as a single scannable list, then workflow, then FAQ. Avoid alternating layouts or horizontally scrolling cards.
4. Keep related links after FAQ. They must not appear before the user has understood the Course workflow and product limits.

## Course internal-link rule

- Template: contextual link from the field section or a small supporting link.
- Event Registration: explain that event/workshop registration is the adjacent broader use case.
- QR Code Form: place beside the share step.
- Webhook: place beside response routing/follow-up.
- Use text links or secondary cards after the core content. Do not give these links the same visual priority as the primary create CTA.
- Remove unrelated Typeform Alternative and Lead Capture cards from this Course page.

## Community must-change requirements

### Desktop

1. Change the H1/description from an implied successful `入群` outcome to an application template: `社群申请表模板` and copy that explicitly says the team reviews responses manually and sends invitations through its existing external channel.
2. Replace `入群通知` with `申请通知` or `团队提醒`; describe any Bot/Webhook as notifying the team, not inviting the applicant.
3. Add visible FAQ that states: no automatic approve/reject workflow, no automatic Discord/Slack invite, no membership provisioning, no payment, and no production email invitations.
4. Pass `source=template_community-application`, `intent=community_application`, and a prompt limited to application fields plus manual follow-up consent.
5. Remove the related Solution card, retire both localized Solution routes with permanent redirects, and remove the slug from listings/static params/sitemap.

### Mobile

1. Put the manual-review/external-invite boundary in the first-screen description, before the CTA or immediately beneath it.
2. Keep the CTA and real form preview; the technical `Split 双栏` and `feishu_bot` attributes must not dominate the first mobile viewport.
3. Place fields before FAQ, and FAQ before any secondary links. The Template does not need another Solution page to explain the task.

## Optional optimizations

- Course: show three to five fields in the hero and keep all nine in the field section; the hero does not need to reproduce the entire form.
- Course: replace the current calendar-led visual with a neutral course-registration questionnaire preview so users do not infer scheduling.
- Community: rename the CTA to `Use the community application template` / `使用社群申请模板` for stronger task confirmation.
- Community: soften generic technical labels such as `场景属性与预设集成`; this is polish, not a Build blocker if the first-screen boundary copy is clear.

## Build acceptance

Build may start. Before production, verify:

- Course desktop/mobile hero shows real fields and no blank preview.
- Course Solution and Template CTAs preserve source, intent, template, and bounded prompt.
- Course visible FAQ equals FAQPage JSON-LD.
- Course related links appear after the primary task and exclude unrelated Lead Capture/Typeform cards.
- Community Template returns 200, has visible manual-review/external-invite boundaries, and carries `community_application` intent.
- Retired Community Solution routes return localized 308 redirects and are absent from sitemap/listings.
- Focused tests and `npm run build` pass.
