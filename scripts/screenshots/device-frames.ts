import { chromium } from 'playwright';
import { readdirSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const RAW_DIR = join(process.cwd(), 'screenshots', 'raw');
const FRAMED_DIR = join(process.cwd(), 'screenshots', 'framed');
const FRAMES_DIR = join(process.cwd(), 'scripts', 'screenshots', 'frames');

mkdirSync(FRAMED_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const files = readdirSync(RAW_DIR).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const isMobile = file.includes('-mobile');
    const frameFile = isMobile ? 'iphone-bezel.html' : 'browser-chrome.html';
    const framePath = join(FRAMES_DIR, frameFile);
    const screenshotPath = resolve(join(RAW_DIR, file));

    const ctx = await browser.newContext({
      viewport: { width: isMobile ? 600 : 2800, height: isMobile ? 1200 : 1600 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`file://${framePath}`);
    await page.evaluate((src) => {
      const img = document.getElementById('screenshot') as HTMLImageElement;
      if (img) img.src = `file://${src}`;
    }, screenshotPath);
    await page.waitForTimeout(500);

    const frame = page.locator('.frame, .phone');
    await frame.screenshot({
      path: join(FRAMED_DIR, file.replace('.png', '-framed.png')),
    });

    await ctx.close();
  }

  await browser.close();
  console.log('Framed screenshots saved in screenshots/framed/');
}

main().catch(console.error);
