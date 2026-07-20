const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const sourcePath = 'file://' + path.resolve(__dirname, 'index.html');
  const screenshotsDir = path.resolve(__dirname, '../screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Define potential executable paths for macOS Chrome
  const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  
  let launchOptions = { headless: 'new' };
  
  if (fs.existsSync(macChromePath)) {
    console.log(`Using local Chrome at: ${macChromePath}`);
    launchOptions.executablePath = macChromePath;
  } else {
    console.log(`Local Chrome not found at standard macOS path, attempting default launch.`);
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  const configs = [
    { lang: 'en', viewport: { width: 1440, height: 900 }, filename: 'en-desktop-1440x900.png' },
    { lang: 'zh', viewport: { width: 1440, height: 900 }, filename: 'zh-desktop-1440x900.png' },
    { lang: 'en', viewport: { width: 390, height: 844, isMobile: true, hasTouch: true }, filename: 'en-mobile-390x844.png' },
    { lang: 'zh', viewport: { width: 390, height: 844, isMobile: true, hasTouch: true }, filename: 'zh-mobile-390x844.png' }
  ];

  for (const config of configs) {
    await page.setViewport(config.viewport);
    await page.goto(`${sourcePath}?lang=${config.lang}`, { waitUntil: 'networkidle0' });
    
    // Slight delay to ensure layout shifts and font rendering are complete
    await new Promise(r => setTimeout(r, 600));
    
    await page.screenshot({ path: path.join(screenshotsDir, config.filename) });
    console.log(`Saved screenshot: ${config.filename}`);
  }

  await browser.close();
})();
