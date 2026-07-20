# Waitlist Subcluster Pre-Ship UX Audit

> Date: 2026-06-27  
> Surface: `/use-cases/waitlist-form-builder-indie-hackers`  
> Goal: verify that the Waitlist search intent, visual preview, CTA, responsive layout, and product claims are ready for production.

## 1. Audit Scope

This is a bounded pre-ship audit of the Waitlist Use Case first screen and its handoff to the Template and Post creation paths. It does not audit the signed-in creation flow or form submission flow.

## 2. Steps

| Step | Evidence | Health | Result |
|---|---|---|---|
| 1. Desktop Use Case entry | `01-use-case-desktop.png` | Pass | H1, copy, primary CTA, template entry, and Waitlist preview form one coherent task. No horizontal overflow or framework error overlay. |
| 2. Mobile Use Case entry | `02-use-case-mobile.png` | Pass | 390px layout reflows in a clear order: task, CTA, template entry, preview, supporting content. No clipping or horizontal overflow. |

## 3. Strengths

- The H1 immediately confirms the Waitlist builder intent.
- The primary CTA says `Create waitlist form` rather than sending users to a generic form entry.
- The preview uses a real Waitlist interaction instead of a contact or lead-capture placeholder.
- The Template and Post paths preserve `template=waitlist`, `intent=waitlist`, source, and prompt context.
- Desktop and mobile keep the primary action visible before supporting content.

## 4. Issues Found And Fixed

### 4.1 Unsupported proof and queue expectation

The original preview displayed `12.4k joined` and `Est. Wait: 2 days`. This could imply real usage volume and an automated queue-position system.

Fix:

- Replaced with `Pre-launch signup` and `Launch updates: Optional`.
- Replaced `Reserve Spot` with `Join waitlist`.
- Reworded the preview subtitle as `Join the product launch list`.

### 4.2 Ambiguous deployment claim

The default badge `AI Ready • 30s Deploy` could imply embed or deployment capabilities outside the current promise.

Fix:

- Replaced with `AI Ready • Share link / QR` and the corresponding Chinese copy.

## 5. Accessibility Risks And Limits

- The page uses semantic links and a single visible H1 in the audited state.
- The primary CTA has a clear task label and adequate visible size on desktop and mobile.
- Screenshots cannot prove keyboard focus order, screen-reader announcements, color contrast ratios, or zoom behavior. Those require separate automated and manual accessibility testing.
- The preview is illustrative and not an interactive form in this page state; the CTA remains the actual operable entry.

## 6. Pre-Ship Decision

**Pass.** The Waitlist Use Case is aligned with the search intent and current product boundary after the two fixes above. No visual or UX blocker remains for deployment.

