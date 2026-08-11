import { Before, After, BeforeAll, AfterAll, Status, IWorld, setDefaultTimeout } from '@cucumber/cucumber';
import { ChromiumBrowser, chromium, Page, BrowserContext } from '@playwright/test';
import { resetWidgetRoot, getCurrentBrand, getWidgetRoot } from './widget-root';
import * as fs from 'fs';
import * as path from 'path';


setDefaultTimeout(30 * 1000)

declare const process: {
  env?: {
    CI?: string;
  };
};

let browser: ChromiumBrowser;
let context: BrowserContext;
export let page: Page;

BeforeAll(async () => {
  const isCI = process?.env?.CI === 'true';
  browser = await chromium.launch({ headless: isCI });
});

AfterAll(async () => {
  await browser.close();
});

Before(async () => {
  context = await browser.newContext({

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
    // 1. Capture screenshot as buffer
    const imgBuffer = await page.screenshot({ fullPage: true });

    // 2. AWAIT attachment to Cucumber World
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