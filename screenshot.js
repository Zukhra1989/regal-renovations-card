const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1080, height: 1080 });

  const filePath = 'file:///' + path.resolve(__dirname, 'regal-renovations-variant4-designer.html').replace(/\\/g, '/');
  await page.goto(filePath);

  // Wait for fonts and image to load
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'regal-renovations.jpg',
    type: 'jpeg',
    quality: 95,
    clip: { x: 0, y: 0, width: 1080, height: 1080 }
  });

  console.log('Screenshot saved: regal-renovations.jpg');
  await browser.close();
})();
