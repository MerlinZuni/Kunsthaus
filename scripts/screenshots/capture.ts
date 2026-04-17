import { chromium, type Page } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:4321/Kunsthaus';
const RAW_DIR = join(process.cwd(), 'screenshots', 'raw');

mkdirSync(RAW_DIR, { recursive: true });

async function createContext(browser: any, type: 'desktop' | 'mobile') {
  if (type === 'desktop') {
    return browser.newContext({
      viewport: { width: 2560, height: 1440 },
      deviceScaleFactor: 2,
    });
  }
  return browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
}

async function waitForAnimations(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
}

async function captureDesignMoment(
  browser: any,
  name: string,
  url: string,
  scrollAction?: (page: Page) => Promise<void>
) {
  for (const type of ['desktop', 'mobile'] as const) {
    const ctx = await createContext(browser, type);
    const page = await ctx.newPage();
    await page.goto(url);
    await waitForAnimations(page);
    if (scrollAction) await scrollAction(page);
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: join(RAW_DIR, `${name}-${type}.png`),
      fullPage: false,
    });
    await ctx.close();
  }
}

async function main() {
  const browser = await chromium.launch();

  // Moment 1: Hero + carousel (Planning homepage)
  await captureDesignMoment(browser, '01-hero-carousel', `${BASE_URL}/`);

  // Moment 2: On-site landing (shows mode switch result with dark palette)
  await captureDesignMoment(browser, '02-onsite-landing', `${BASE_URL}/onsite`);

  // Moment 3: KJM detail page
  await captureDesignMoment(
    browser,
    '03-kjm-detail',
    `${BASE_URL}/onsite/kerry-james-marshall`,
    async (page) => {
      // Scroll to artwork slider area
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    }
  );

  // Moment 4: Mobile responsive — capture additional mobile-specific views
  const mobileCtx = await createContext(browser, 'mobile');
  const mobilePage = await mobileCtx.newPage();

  // 4a: Mobile homepage with sticky CTA visible
  await mobilePage.goto(`${BASE_URL}/`);
  await waitForAnimations(mobilePage);
  await mobilePage.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({
    path: join(RAW_DIR, '04-mobile-scroll-mobile.png'),
    fullPage: false,
  });

  // 4b: Mobile hamburger menu
  const hamburgerBtn = mobilePage.locator('[data-action="hamburger"]');
  if (await hamburgerBtn.isVisible()) {
    await hamburgerBtn.click();
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({
      path: join(RAW_DIR, '04-mobile-hamburger-mobile.png'),
      fullPage: false,
    });
  }

  await mobileCtx.close();
  await browser.close();

  console.log('Screenshots captured in screenshots/raw/');
}

main().catch(console.error);
