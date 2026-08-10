import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { page } from "../support/hooks";

const getIframe = () => page.locator('iframe[title="Kleep.ai"]').contentFrame();

async function clickIframeRadio(label: string) {
    await getIframe().getByRole('radio', { name: label }).click()
}

async function clickIframeSubmit(label: string) {
    const submitButton = getIframe().getByRole('button', { name: label });
    await submitButton.waitFor({ state: 'visible' })
    await submitButton.click()

}

Given('I navigate to {string} and confirm country by clicing {string} button', async (URL: string, confirmLocationCountry: string) => {
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
});

When('I enter feet {string} and {string} inches', async (feet: string, inches: string) => {
    const heightFeetField = getIframe().getByRole('textbox', { name: 'Height - ex: 5’' });
    await heightFeetField.click();
    await heightFeetField.fill(feet);
    await expect(heightFeetField).toHaveValue(`${feet}'`);
    await heightFeetField.blur();

    const heightInchesField = getIframe().getByRole('textbox', { name: 'Height - ex: 9"' })
    await heightInchesField.waitFor({ state: "visible" });
    await heightInchesField.fill(inches);
    await expect(heightInchesField).toHaveValue(`${inches}"`);
})

When('I enter my body weight {string} and age {string}', async (weight: string, age: string) => {
    const weightField = getIframe().getByRole("textbox", { name: "ex: 154" });
    await weightField.click();
    await weightField.fill(weight);
    await expect(weightField).toHaveValue(weight);
    await weightField.blur();

    const ageField = getIframe().getByRole("textbox", { name: "ex: 30 years old" });
    await ageField.waitFor({ state: "visible" });
    await ageField.click();
    await ageField.fill(age);
    await expect(ageField).toHaveValue(age);
})

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
    await getIframe().getByRole('button', { name: bandSize }).click();
    await getIframe().getByRole('button', { name: cupSize, exact: true }).click();
    await clickIframeSubmit(submitButton);
});

Then('I should see the recommended size {string}', async (recommendedSize: string) => {
    const activeSize = getIframe().locator('.menu-item.active p');
    await expect(activeSize).toBeVisible();
    await expect(activeSize).toHaveText(recommendedSize);
})