import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword} from "../constants";

test('Validaciones de reportes', async ({ browser }) => {

    const context = await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 18.4861, longitude: -69.9312 },
    });
    const page = await context.newPage();
    await page.goto("https://apagon-rd.netlify.app");

        //ingresar desde la página principal
        const logiBtn = page.getByRole('button', { name: 'Ingresar' });
        await expect(logiBtn).toBeVisible();
        await page.click('button:has-text("Ingresar")');

        //Iniciar sesión
        await page.fill('input[name="username"]', TestEmail);//usuario
        await page.fill('input[name="password"]', TestPassword);//contraseña
        await page.click('button:has-text("INICIAR SESIÓN")');

        //reportar y sector
        await page.locator('button.bg-blue-600:has-text("Reportar")').click();
        await page.locator('label:has-text("Sector")').waitFor({ state: 'visible', timeout: 8000 });
        const sectorSelect = page.locator('select[name="sectorId"]');
        await expect(sectorSelect).toBeVisible();
        const firstSectorValue = await sectorSelect.locator('option').nth(1).getAttribute('value');
        await sectorSelect.selectOption(firstSectorValue!);//Seleccionar el primer sector

        //estado de energia
        const powerSelect = page.locator('select[name="powerStatus"]');
        await expect(powerSelect).toBeVisible();
        const firstPowerValue = await powerSelect.locator('option').nth(1).getAttribute('value');
        await powerSelect.selectOption(firstPowerValue!);//Seleccionar el primer estado
        await page.locator('textarea[name="description"]').fill('Prueba.');//description
        await page.setInputFiles('#photo-input', 'tests/assets/cuatro.png');//foto
        await page.locator('button.btn.btn-primary:has-text("Enviar Reporte")').click();//Enviar
});