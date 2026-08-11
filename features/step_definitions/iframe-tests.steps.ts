import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { page } from "../support/hooks";
import { getWidgetRoot, setCurrentBrand, setWidgetRoot } from "../support/widget-root";
import { extractBrandFromDrawerUrl } from "../support/url-helpers";

async function clickIframeRadio(label: string) {
    await getWidgetRoot().getByRole('radio', { name: label }).click()
}

async function clickIframeSubmit(label: string) {
    const submitButton = getWidgetRoot().getByRole('button', { name: label });
    await submitButton.waitFor({ state: 'visible' })
    await submitButton.click()

}

Given('I navigate to {string} and confirm country by clicking {string} button', async (URL: string, confirmLocationCountry: string) => {
    await page.goto(URL, { waitUntil: 'load' });

    const shopNowBtn = page.getByRole('button', { name: confirmLocationCountry })

    try {
        await shopNowBtn.waitFor({ state: 'visible', timeout: 8000 });
        await shopNowBtn.click();
    } catch (e) {
        console.log(`Country confirm button "${confirmLocationCountry}" did not appear, skipping.`);
    }
});

When('I click the {string} button and open the drawer iframe', async (drawerButton: string) => {
    const sizeButton = page.getByRole('group', { name: drawerButton }).locator('#kleep-size-button')
    await sizeButton.waitFor({ state: 'visible' });
    await sizeButton.click();

    setWidgetRoot(page.locator('iframe[title="Kleep.ai"]').contentFrame());
});

Given('I navigate directly to the drawer {string}', async (url: string) => {
    await page.goto(url, {waitUntil: 'load'});

    setWidgetRoot(page);
    setCurrentBrand(extractBrandFromDrawerUrl(url));
})

When('I enter feet {string} and {string} inches', async (feet: string, inches: string) => {
    const root = getWidgetRoot();
    const heightFeetField = root.getByRole('textbox', { name: 'Height - ex: 5’' });
    await heightFeetField.click();
    await heightFeetField.fill(feet);
    await expect(heightFeetField).toHaveValue(`${feet}'`);
    await heightFeetField.blur();

    const heightInchesField = root.getByRole('textbox', { name: 'Height - ex: 9"' })
    await heightInchesField.waitFor({ state: "visible" });
    await heightInchesField.fill(inches);
    await expect(heightInchesField).toHaveValue(`${inches}"`);
})

When('I enter my body weight {string} and age {string}', async (weight: string, age: string) => {
    const root = getWidgetRoot();
    const weightField = root.getByRole("textbox", { name: "ex: 154" });
    await weightField.click();
    await weightField.fill(weight);
    await expect(weightField).toHaveValue(weight);
    await weightField.blur();

    const ageField = root.getByRole("textbox", { name: "ex: 30 years old" });
    await ageField.waitFor({ state: "visible" });
    await ageField.click();
    await ageField.fill(age);
    await expect(ageField).toHaveValue(age);
    await ageField.blur();
})

Then("the {string} button should be disabled", async (buttonLabel: string) => {
  const button = getWidgetRoot().getByRole("button", { name: buttonLabel });
  await expect(button).toBeVisible();
  await expect(button).toBeDisabled();
});

Then("I should see the validation message {string}", async (message: string) => {
  await expect(getWidgetRoot().getByText(message, { exact: true })).toBeVisible();
});

When('I click {string} button', async (confirmButton: string) => {
    await clickIframeSubmit(confirmButton);
})

When('I select {string} option as Hip Shape and Stomach Shape pages and click {string} button', async (shapeOption: string, confirmButton: string) => {
    await clickIframeRadio(shapeOption);
    await clickIframeSubmit(confirmButton);

    await clickIframeRadio(shapeOption);
    await clickIframeSubmit(confirmButton);
})

When('I select {string} and {string} in Chest page and click {string} button', async (bandSize: string, cupSize: string, submitButton: string) => {
    await getWidgetRoot().getByRole('button', { name: bandSize }).click();
    await getWidgetRoot().getByRole('button', { name: cupSize, exact: true }).click();
    await clickIframeSubmit(submitButton);
});

Then('I should see the recommended size {string}', async (recommendedSize: string) => {
    const activeSize = getWidgetRoot().locator('.menu-item.active p');
    await expect(activeSize).toBeVisible();
    await expect(activeSize).toHaveText(recommendedSize);
})