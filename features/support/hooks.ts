import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { ChromiumBrowser, chromium, Page, BrowserContext } from '@playwright/test';

let browser: ChromiumBrowser;
let context: BrowserContext;
export let page: Page;

BeforeAll(async () => {
  const isCI =
    (globalThis as typeof globalThis & {
      process?: {
        env?: {
          CI?: string;
        };
      };
    }).process?.env?.CI === 'true';

  browser = await chromium.launch({ headless: isCI });
});

AfterAll(async () => {
  await browser.close();
});

Before(async () => {
  context = await browser.newContext();
  page = await context.newPage();
});

// Notice we use a standard 'function' here so we have access to 'this.attach'
After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // 1. Take the screenshot as a Buffer (no path needed)
    const imgBuffer = await page.screenshot();

    // 2. Attach it directly to the Cucumber report
    this.attach(imgBuffer, 'image/png');
  }

  await page.close();
  await context.close();
});