import { Before, After, BeforeAll, AfterAll, Status, IWorld, setDefaultTimeout } from '@cucumber/cucumber';
import { ChromiumBrowser, chromium, Page, BrowserContext } from '@playwright/test';

setDefaultTimeout(20 * 1000)

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