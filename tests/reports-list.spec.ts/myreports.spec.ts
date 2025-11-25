import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword, BaseURL} from "../constants";

test.describe('login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(BaseURL);
    });

    test('Validation de mis reportes', async ({ page }) => {

        //ingresar desde la página principal
        const logging = page.getByRole('button', { name: 'Ingresar' });
        await expect(logging).toBeVisible();
        await page.click('button:has-text("Ingresar")');

        //Iniciar sesión
        await page.fill('input[name="username"]', TestEmail);//usuario
        await page.fill('input[name="password"]', TestPassword);//contraseña
        await page.click('button:has-text("INICIAR SESIÓN")');

        await page.locator('button:has-text("Mis reportes") i.fa-list').click();
        const titulo = page.locator('h1:text("Mis Reportes")');
        await expect(titulo).toBeVisible();//titulo
        const table = page.locator('div.mis-reportes-scroll table');//Tabla

        //Validar encabezados
        await expect(table.locator('thead th').nth(0)).toHaveText('Fecha');
        await expect(table.locator('thead th').nth(1)).toHaveText('Hora');
        await expect(table.locator('thead th').nth(2)).toHaveText('Sector');
        await expect(table.locator('thead th').nth(3)).toHaveText('Estado de energía');
        await expect(table.locator('thead th').nth(4)).toHaveText('Acciones');

        // Validar filas
        const filas = table.locator('tbody tr');
        const countFilas = await filas.count();
        expect(countFilas).toBeGreaterThan(0);

        // Tabla de reportes
        const table2 = page.locator('div.mis-reportes-scroll table');
        const first = table2.locator('tbody tr').first();
        await expect(first.locator('td').first()).not.toHaveText('');//Validar primera celda

        await first.locator('button[title="Ver detalles"]').click();//Ver detalles
        const modal = page.locator('div.bg-white.rounded-lg.shadow-xl.max-w-2xl');
        await expect(modal).toBeVisible();//Validar modal de detalles del Reporte

        const state = modal.locator('p:text-matches("^Estado de energía:.*")');
        await expect(state).not.toHaveText('');//Validar estado de energía no esté vacío
        const description = modal.locator('p.text-gray-600.whitespace-pre-wrap');
        await expect(description).not.toHaveText('');//Validar descripción no esté vacío
    });
});