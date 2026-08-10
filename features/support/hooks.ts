import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { ChromiumBrowser, chromium, Page, BrowserContext } from '@playwright/test';

declare const process: {
  env: {
    CI?: string;
  };
};

let browser: ChromiumBrowser;
let context: BrowserContext;
export let page: Page;

BeforeAll(async () => {
  // Use CI environment variable to run headless in GitHub Actions, or headed locally
  const isCI = process.env.CI === 'true';
  browser = await chromium.launch({ headless: isCI }); 
});

AfterAll(async () => {
  await browser.close();
});

Before(async () => {
  // Create an isolated context and page for each scenario
  context = await browser.newContext();
  page = await context.newPage();
});

After(async (scenario) => {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    const img = await page.screenshot({ path: `screenshots/${scenario.pickle.name}.png` });
  }
  await page.close();
  await context.close();
});