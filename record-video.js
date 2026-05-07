const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    recordVideo: {
      dir: __dirname,
      size: { width: 1080, height: 1080 }
    }
  });

  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'regal-renovations-variant4-designer.html').replace(/\\/g, '/');
  await page.goto(filePath);

  // Wait for fonts and image to load
  await page.waitForTimeout(1500);

  // Record one full animation cycle (14s) + a bit extra
  console.log('Recording animation (15 seconds)...');
  await page.waitForTimeout(15000);

  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Rename to a clear name
  const outputPath = path.join(__dirname, 'regal-renovations.webm');
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  fs.renameSync(videoPath, outputPath);

  console.log('Video saved: regal-renovations.webm');
})();
