const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '..');
const FILE_URL = `file://${path.resolve(__dirname, 'index.html')}`;

const states = [
  { id: 'context-loaded', lang: 'en', desk: '01-context-loaded-desktop.png', mob: '02-context-loaded-mobile.png' },
  { id: 'generated-draft', lang: 'en', desk: '03-generated-draft-desktop.png', mob: '04-generated-draft-mobile.png' },
  { id: 'publish-success', lang: 'en', desk: '05-publish-success-desktop.png', mob: '06-publish-success-mobile.png' },
  { id: 'test-runner', lang: 'en', desk: '07-test-runner-desktop.png', mob: '08-test-runner-mobile.png' },
  { id: 'first-result', lang: 'en', desk: '09-first-result-desktop.png', mob: '10-first-result-mobile.png' },
  { id: 'empty-submissions', lang: 'en', desk: '11-empty-submissions-desktop.png', mob: '12-empty-submissions-mobile.png' },
  { id: 'context-loaded', lang: 'zh', mob: '13-context-loaded-mobile-zh.png' },
  { id: 'publish-success', lang: 'es', desk: '14-publish-success-desktop-es.png' }
];

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  
  for (const s of states) {
    // Desktop
    if (s.desk) {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`${FILE_URL}?state=${s.id}&lang=${s.lang}`);
      // Wait for font load
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({ path: path.join(OUT_DIR, s.desk) });
      console.log(`Saved ${s.desk}`);
    }
    
    // Mobile
    if (s.mob) {
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${FILE_URL}?state=${s.id}&lang=${s.lang}`);
      // add mobile class manually since we use window size, but our CSS expects body.mobile
      await page.evaluate(() => document.body.classList.add('mobile'));
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({ path: path.join(OUT_DIR, s.mob) });
      console.log(`Saved ${s.mob}`);
    }
  }

  // Component & Token sheet
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`file://${path.resolve(__dirname, 'components.html')}`);
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: path.join(OUT_DIR, '15-component-and-token-sheet.png') });
  console.log('Saved 15-component-and-token-sheet.png');

  // Overview map
  await page.goto(`file://${path.resolve(__dirname, 'overview.html')}`);
  await page.setViewport({ width: 1600, height: 1200 }); // Larger viewport for overview
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: path.join(OUT_DIR, 'all-screens-overview.png') });
  console.log('Saved all-screens-overview.png');

  await browser.close();
}

run().catch(console.error);
