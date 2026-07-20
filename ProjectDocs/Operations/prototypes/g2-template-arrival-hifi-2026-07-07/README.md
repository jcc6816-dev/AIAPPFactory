# G2 Template Arrival High-Fidelity Prototype

## Context & Goal
The goal of this prototype is to solve the highest conversion breakpoint identified during the G2 Activation Diagnosis. Users who arrived at `/forms/new?template=...` with context loaded were confused about what to do next, resulting in high drop-off rates despite successfully carrying the template. 

This design aims to eliminate confusion by clearly presenting the template-arrival state, placing the primary action front and center, and managing user expectations regarding login without cluttering the first screen.

## Acceptance Checklist Verification
- [x] **Desktop CTA is visible above fold**: Yes, the "Create this form" button is prominently placed in the action panel directly below the template evidence.
- [x] **Mobile CTA is visible without scrolling**: Yes, a sticky bottom bar ensures the CTA is always visible on a 390x844 viewport.
- [x] **The first screen does not use `Publish` as the main action**: Verified. The primary CTA is to create the form (`Create this form` / `使用此模板创建表单`).
- [x] **The first screen does not expose Workflow/Webhook/QR/test submission**: Verified. The UI is focused solely on the template arrival state.
- [x] **The user can tell this is Event Registration, not a blank editor**: Yes. There is clear evidence text ("Event Registration") along with field chips (Name, Email, Session, etc.) and a contextual preview pane.
- [x] **zh and en variants have no mixed-language residue**: Verified. The language strings are cleanly separated and swapped based on the `?lang=zh` or `?lang=en` URL parameter.

## Folder Structure
- `source/`: Contains the static HTML, CSS, and JS source code for the prototype.
  - `index.html`: The main markup.
  - `styles.css`: The styling system.
  - `app.js`: Logic to handle language toggling based on URL parameters.
  - `capture.js`: A Puppeteer script to capture automated screenshots.
- `screenshots/`: Contains the generated 1440x900 desktop and 390x844 mobile screenshots for both `zh` and `en`.

## How to View
Simply open `source/index.html` in your web browser. 
- Append `?lang=en` (default) for English.
- Append `?lang=zh` for Simplified Chinese.

To regenerate screenshots:
```bash
cd source
npm install
node capture.js
```
