# Founder-led Structured Test Script

## Important Evidence Boundary

These are five structured scenario walkthroughs performed by Mike. They are not five independent user tests and must not be reported as user research evidence.

The purpose is to detect flow ambiguity before development and before external usability testing becomes possible.

## Test Setup

- Use the low-fidelity prototype without reading the specification first.
- Run each scenario from a fresh start.
- Think aloud and say what you believe will happen before every primary action.
- Do not correct yourself during a scenario; record the misunderstanding first.
- Run desktop scenarios at 1440 x 900 and mobile scenarios at 390 x 844.
- Record the visible UI language and form language separately.

## Common Tasks

1. Identify the inherited template and explain what GenForms already knows.
2. Generate the form.
3. Explain the single recommended next action.
4. Publish the form.
5. Locate Copy, Open, QR, and WhatsApp link sharing.
6. Explain what a free test will and will not do.
7. Send a test response.
8. Confirm where the result was saved and identify the Test label.
9. From an empty submissions panel, find the path to create the first result.

## Scenario 1: Desktop Freelancer

Persona simulation: A freelance web designer has entered from a client intake template and wants proof that the form works before sending it to a client.

Observe:

- Can Mike identify template, intent, source, and recommended fields within 10 seconds?
- Does Publish become the obvious next action after generation?
- Are visual settings understood as optional rather than required?
- Is the first result found without returning to the forms list?

## Scenario 2: Mobile Small-Business Owner

Persona simulation: A small-business owner creates a customer service request form on a phone.

Observe:

- Is any horizontal scrolling required?
- Does the sticky primary action obscure fields or navigation?
- Are the test guarantees still visible and understandable?
- Can Share, QR, and WhatsApp be distinguished on mobile?

## Scenario 3: Agency Operations

Persona simulation: An agency operations person needs to publish, verify one submission, and hand the public link to a colleague.

Observe:

- Can the person move through the loop without opening readiness, history, integrations, or logs?
- Is the test result visibly different from a real client response?
- Is link sharing clearly separate from notification configuration?
- Can the public URL be copied without opening another page?

## Scenario 4: Chinese User

Persona simulation: A Simplified Chinese UI user creates and tests a Chinese customer request form.

Observe:

- Are Context Banner labels natural and complete?
- Do Chinese buttons remain concise without relying on English abbreviations?
- Does language switching preserve state?
- Are CJK characters visually consistent across headings, body, inputs, and status labels?

## Scenario 5: Spanish Form Creator

Persona simulation: The creator uses a Spanish UI or creates a Spanish-language form with longer labels.

Use stress strings:

- `Generar este formulario con los campos recomendados`
- `Enviar una respuesta de prueba gratuita`
- `Compartir el enlace público del formulario`
- `No se enviarán correos electrónicos, webhooks ni notificaciones externas`

Observe:

- Do buttons wrap without clipping or reducing tap target size?
- Does the Context Banner expand without pushing the primary CTA off screen?
- Does the Action Rail keep one clear primary action?
- Do accented characters render consistently?

## Timing Targets

| Task | Target | Critical failure |
| --- | ---: | --- |
| Identify inherited context | 10 sec | Cannot name template or intent |
| Generate and identify next action | 30 sec | Opens advanced settings instead of Publish |
| Publish and find share actions | 30 sec | Cannot find public URL or confuses WhatsApp with integration |
| Explain free test behavior | 20 sec | Expects a charge, no saved result, or external notification |
| Submit test and find result | 60 sec | Cannot locate saved result or Test label |
| Empty state to test runner | 20 sec | Leaves submissions instead of using the empty-state CTA |
| Full first-success loop | 5 min | Requires outside instruction |

## Issue Severity

- **Critical:** Incorrect understanding of cost, persistence, external notification, or whether the form is published.
- **High:** Cannot find the primary CTA, public link, test result, or Test label.
- **Medium:** Hesitation longer than 10 seconds, unnecessary detour, or confusing secondary action.
- **Low:** Wording preference or minor visual polish that does not change task completion.

## Problem Record

| Run | Scenario | Device / viewport | UI locale | Form locale | Step | Start time | End time | Duration | Expected action | Actual action | Think-aloud quote | Misunderstanding | Severity | Suggested change | Retest result |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Desktop freelancer | 1440 x 900 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | Mobile small-business owner | 390 x 844 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | Agency operations | 1440 x 900 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | Chinese user | 1440 x 900 | zh-CN | zh-CN |  |  |  |  |  |  |  |  |  |  |  |
| 5 | Spanish form creator | 390 x 844 | es | es |  |  |  |  |  |  |  |  |  |  |  |

## Pass Gate

The prototype is ready for development recommendation when:

- All five scenario walkthroughs complete the full loop within five minutes.
- No run records a Critical issue.
- At least four runs identify inherited context within ten seconds.
- All five runs correctly state that the test is free, saved, and does not trigger external notifications.
- All five runs find the saved result and Test label without outside instruction.
- Mobile runs require no horizontal scrolling for primary tasks.

Founder-led passes reduce obvious design risk but do not replace later external usability testing.
