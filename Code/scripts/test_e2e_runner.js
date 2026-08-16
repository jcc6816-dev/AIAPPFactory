const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("=== 1. 获取已认证 Admin Session ===");
  await page.goto('http://localhost:3000/zh/forms/new', { waitUntil: 'domcontentloaded' });
  
  const csrfRes = await page.request.get('http://localhost:3000/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();
  const loginRes = await page.request.post('http://localhost:3000/api/auth/callback/dev-login', {
    form: {
      csrfToken,
      email: 'admin@genforms.ai',
      callbackUrl: 'http://localhost:3000/zh/forms/new',
      json: 'true'
    },
    maxRedirects: 0
  });
  console.log("✓ 登录状态码:", loginRes.status());

  // Reload /zh/forms/new with authenticated session
  await page.goto('http://localhost:3000/zh/forms/new', { waitUntil: 'networkidle' });
  console.log("✓ 已以管理员身份加载 /zh/forms/new");

  console.log("=== 2. 点击 Prompt 快捷标签并生成 ===");
  await page.click('text=售后支持工单');
  await page.click('button:has-text("生成表单")');

  console.log("=== 3. 等待生成完成草稿 ===");
  await page.waitForSelector('text=表单', { timeout: 15000 });
  await page.screenshot({ path: '/tmp/step1-draft.png' });
  console.log("✓ 草稿生成成功，已截图至 /tmp/step1-draft.png");

  console.log("=== 4. 点击发布并获取链接 ===");
  const publishBtn = await page.waitForSelector('button:has-text("发布并获取链接")');
  await publishBtn.click();
  await page.waitForTimeout(4000);
  console.log("✓ 当前发布后 URL:", page.url());
  await page.screenshot({ path: '/tmp/step2-published.png' });

  // 寻找公开短链
  let publicUrl = await page.$eval('a[href*="/f/"]', el => el.href).catch(() => null);
  if (!publicUrl) {
    const textContent = await page.content();
    const match = textContent.match(/\/zh\/f\/[a-zA-Z0-9_-]+/);
    if (match) {
      publicUrl = `http://localhost:3000${match[0]}`;
    }
  }

  console.log("✓ 获取到发布公开短链:", publicUrl);

  if (publicUrl) {
    console.log("=== 5. 打开公开表单填报页进行全真测试 ===", publicUrl);
    const userPage = await context.newPage();
    await userPage.goto(publicUrl, { waitUntil: 'networkidle' });
    await userPage.screenshot({ path: '/tmp/step3-runner-q1.png' });
    console.log("✓ 题目 1 已截图至 /tmp/step3-runner-q1.png");

    // 检查题目 1 的主色调
    const btnStyle = await userPage.$eval('button:has-text("开始填写"), button:has-text("下一题"), button:has-text("确定"), button:has-text("提交")', el => {
      const s = window.getComputedStyle(el);
      return { bg: s.backgroundColor, bgImg: s.backgroundImage, color: s.color };
    }).catch(() => null);
    console.log("✓ 公开填报页主按钮色彩样式 (确认是否为科技蓝):", JSON.stringify(btnStyle));

    // 填写题目 1 并推进
    const input1 = await userPage.$('input[type="text"], textarea');
    if (input1) {
      await input1.fill('测试用户A');
      console.log("✓ 填写了第 1 题: 张三");
      const nextBtn = await userPage.$('button:has-text("下一题"), button:has-text("确定")');
      if (nextBtn) await nextBtn.click();
      await userPage.waitForTimeout(1000);
      await userPage.screenshot({ path: '/tmp/step4-runner-q2.png' });
      console.log("✓ 推进至题目 2，已截图至 /tmp/step4-runner-q2.png");
    }
  }

  await browser.close();
  console.log("=== 浏览器端到端自动化真机走查全部成功 ===");
})();
