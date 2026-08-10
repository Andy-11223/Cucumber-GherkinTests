import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { page } from "../support/hooks";

const getIframe = () => page.locator('iframe[title="Kleep.ai"]').contentFrame();

Given('I navigate to {string} and confirm country by clicing {string} button', async (URL: string, confirmLocationCountry: string) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const shopNowBtn = page.getByRole('button', { name: confirmLocationCountry })

    try {
        await shopNowBtn.waitFor({ state: 'visible' });
        await shopNowBtn.click();
    } catch (e) {
        console.log(`Country confirm button "${confirmLocationCountry}" did not appear, skipping.`);
    }
});

When('I click the {string} button and open the drawer iframe', async (drawerButton: string) => {
    await page.getByRole('group', { name: drawerButton }).locator('#kleep-size-button').waitFor({ state: 'visible' })
    await page.getByRole('group', { name: drawerButton }).locator('#kleep-size-button').click();
});

When('I enter height {string} and {string} feet', async (heightFootValue1: string, heightFootValue2: string) => {
    await getIframe().getByRole('textbox', { name: 'Height - ex: 5’' }).click();
    await getIframe().getByRole('textbox', { name: 'Height - ex: 5’' }).fill(heightFootValue1);
    await getIframe().getByRole('textbox', { name: 'Height - ex: 9"' }).click();
    await getIframe().getByRole('textbox', { name: 'Height - ex: 9"' }).fill(heightFootValue2);
})

When('I enter my body weight {string} and age {string}', async (weightValue: string, ageValue: string) => {
    await getIframe().getByRole('textbox', { name: 'ex: 154' }).click();
    await getIframe().getByRole('textbox', { name: 'ex: 154' }).fill(weightValue);
    await getIframe().getByRole('textbox', { name: 'ex: 30 years old' }).click();
    await getIframe().getByRole('textbox', { name: 'ex: 30 years old' }).fill(ageValue);
})

When('I click {string} button', async (confirmButton: string) => {
    await getIframe().getByRole('button', { name: confirmButton }).waitFor({ state: 'visible' });
    await getIframe().getByRole('button', { name: confirmButton }).click();
})

When('I select {string} option as Hip Shape and Stomach Shape pages and click {string} button', async (shapeOption: string, confirmButton: string) => {
    await getIframe().getByRole('radio', { name: shapeOption }).click();
    await getIframe().getByRole('button', { name: confirmButton }).click();
    await getIframe().getByRole('radio', { name: shapeOption }).click();
    await getIframe().getByRole('button', { name: confirmButton }).click();
})

When('I select {string} and {string} in Chest page and click {string} button', async (bandSize: string, cupSize: string, submitButton: string) => {
    await getIframe().getByRole('button', { name: bandSize }).click();
    await getIframe().getByRole('button', { name: cupSize, exact: true }).click();
    await getIframe().getByRole('button', { name: submitButton }).click();
});

Then('I should see the recommended size {string}', async (recommendedSize: string) => {
    await getIframe().getByText(recommendedSize)
})