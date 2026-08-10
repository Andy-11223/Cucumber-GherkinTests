import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/hooks';

// 1. Given I navigate to "https://playground.bondaracademy.com/"
Given('I navigate to {string}', async (url: string) => {
  await page.goto(url);
});

// 2. When I click the "Forms" and "Form Layouts" buttons to proceed to the form page
When('I click the {string} and {string} buttons to proceed to the form page', async (buttonName1: string, buttonName2: string) => {
  await page.getByRole('link', { name: buttonName1 }).click();
  await page.getByRole('link', { name: buttonName2 }).click();
});

// 3. When I enter email "testonemore@123.com" and password "12345678"
When('I enter email {string} and password {string}', async (email: string, password: string) => {
  await page.getByTestId('inputEmail1').fill(email);
  await page.locator('#inputPassword2').fill(password);
});

// 4. When I mark "Option 1" checkbox (or radio)
When('I mark {string} checkbox', async (checkboxName: string) => {
  // To check a radio/checkbox: use .check({ force: true }) instead of .toBeChecked()
  await page.getByRole('radio', { name: checkboxName }).check({ force: true });
});

// 5. When I press the "Sign in" button
When('I press the {string} button', async (buttonName: string) => {
  await page.getByRole('button', { name: buttonName }).first().click();
});

// 6. Then I should see the filled fields with "testonemore@123.com" and "12345678" and marked checkbox "Option 1"
Then('I should see the filled fields with {string} and {string} and marked checkbox {string}', async (email: string, password: string, checkboxName: string) => {
  await expect(page.getByTestId('inputEmail1')).toHaveValue(email);
  await expect(page.locator('#inputPassword2')).toHaveValue(password);
  await expect(page.getByRole('radio', { name: checkboxName })).toBeChecked();
});