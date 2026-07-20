import asyncio
import os
from playwright.async_api import async_playwright

OUT_DIR = "/Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-hifi-2026-07-04"
FILE_URL = f"file:///Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-hifi-2026-07-04/source/index.html"
COMPONENTS_URL = f"file:///Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-hifi-2026-07-04/source/components.html"
OVERVIEW_URL = f"file:///Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-hifi-2026-07-04/source/overview.html"

states = [
  { 'id': 'context-loaded', 'lang': 'en', 'desk': '01-context-loaded-desktop.png', 'mob': '02-context-loaded-mobile.png' },
  { 'id': 'generated-draft', 'lang': 'en', 'desk': '03-generated-draft-desktop.png', 'mob': '04-generated-draft-mobile.png' },
  { 'id': 'publish-success', 'lang': 'en', 'desk': '05-publish-success-desktop.png', 'mob': '06-publish-success-mobile.png' },
  { 'id': 'test-runner', 'lang': 'en', 'desk': '07-test-runner-desktop.png', 'mob': '08-test-runner-mobile.png' },
  { 'id': 'first-result', 'lang': 'en', 'desk': '09-first-result-desktop.png', 'mob': '10-first-result-mobile.png' },
  { 'id': 'empty-submissions', 'lang': 'en', 'desk': '11-empty-submissions-desktop.png', 'mob': '12-empty-submissions-mobile.png' },
  { 'id': 'context-loaded', 'lang': 'zh', 'mob': '13-context-loaded-mobile-zh.png' },
  { 'id': 'publish-success', 'lang': 'es', 'desk': '14-publish-success-desktop-es.png' }
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for s in states:
            if 'desk' in s:
                await page.set_viewport_size({"width": 1440, "height": 900})
                await page.goto(f"{FILE_URL}?state={s['id']}&lang={s['lang']}")
                await page.wait_for_function('document.fonts.status === "loaded"')
                # wait a little bit extra to ensure fonts are fully rendered
                await page.wait_for_timeout(500)
                path = os.path.join(OUT_DIR, s['desk'])
                await page.screenshot(path=path)
                print(f"Saved {path}")
            
            if 'mob' in s:
                await page.set_viewport_size({"width": 390, "height": 844})
                await page.goto(f"{FILE_URL}?state={s['id']}&lang={s['lang']}")
                await page.evaluate("document.body.classList.add('mobile')")
                await page.wait_for_function('document.fonts.status === "loaded"')
                await page.wait_for_timeout(500)
                path = os.path.join(OUT_DIR, s['mob'])
                await page.screenshot(path=path)
                print(f"Saved {path}")

        # Components
        await page.set_viewport_size({"width": 1440, "height": 900})
        await page.goto(COMPONENTS_URL)
        await page.wait_for_function('document.fonts.status === "loaded"')
        await page.wait_for_timeout(500)
        path = os.path.join(OUT_DIR, '15-component-and-token-sheet.png')
        await page.screenshot(path=path)
        print(f"Saved {path}")

        # Overview
        await page.set_viewport_size({"width": 1600, "height": 1200})
        await page.goto(OVERVIEW_URL)
        await page.wait_for_function('document.fonts.status === "loaded"')
        await page.wait_for_timeout(500)
        path = os.path.join(OUT_DIR, 'all-screens-overview.png')
        await page.screenshot(path=path)
        print(f"Saved {path}")

        await browser.close()

asyncio.run(main())
