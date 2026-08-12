import { Before, After, BeforeAll, AfterAll, Status, IWorld, setDefaultTimeout } from '@cucumber/cucumber';
import { ChromiumBrowser, chromium, Page, BrowserContext, devices } from '@playwright/test';
import { resetWidgetRoot, getCurrentBrand, getWidgetRoot } from './widget-root';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(30 * 1000)

declare const process: {
  env?: {
    CI?: string;
    VIEWPORT?: string;
  };
};

let browser: ChromiumBrowser;
let context: BrowserContext;
export let page: Page;

function resolveDeviceProfile() {
  const viewportMode = (process?.env?.VIEWPORT || 'desktop').toLowerCase();

  if (viewportMode === 'mobile') {
    return devices['iPhone 15'];
  }
  return null; 
}

BeforeAll(async () => {
  const isCI = process?.env?.CI === 'true';
  browser = await chromium.launch({ headless: isCI });
});

AfterAll(async () => {
  await browser.close();
});

Before(async () => {
  const deviceProfile = resolveDeviceProfile();

  context = await browser.newContext({
    ...deviceProfile, // spreads viewport, userAgent, isMobile, hasTouch, deviceScaleFactor when set

    // Set geolocation to UK so the modal doesn't trigger
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    permissions: ['geolocation'],
    locale: 'en-GB'
  });

  resetWidgetRoot();

  page = await context.newPage();
});

After(async function (this: IWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const imgBuffer = await page.screenshot({ fullPage: true });
    await this.attach(imgBuffer, 'image/png');
  }

  await page.close();
  await context.close();
});

After({ tags: "@screenshot" }, async function (scenario) {
  const screenshotDir = path.resolve(__dirname, '../../screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const brand = getCurrentBrand();
  const safeName = scenario.pickle.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const filePath = path.join(screenshotDir, `${brand}-${safeName}.png`);

  const root = getWidgetRoot();
  const drawer = root.locator('.drawer-popup');

  try {
    await drawer.waitFor({ state: 'visible', timeout: 3000 });
    await drawer.screenshot({ path: filePath });
    console.log(`Drawer screenshot saved: ${filePath}`);
  } catch (e) {
    console.log('Drawer element not found/visible — falling back to full page screenshot.');
    await page.screenshot({ path: filePath, fullPage: true });
  }
})