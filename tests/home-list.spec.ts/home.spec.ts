import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword, BaseURL} from "../constants";

test.describe('login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(BaseURL);
    });

    test('Validaciones de inicio', async ({ page }) => {

        //ingresar desde la página principal
        const logBtn = page.getByRole('button', { name: 'Ingresar' });
        await expect(logBtn).toBeVisible();
        await page.click('button:has-text("Ingresar")');

        //Iniciar sesión
        await page.fill('input[name="username"]', TestEmail);//usuario
        await page.fill('input[name="password"]', TestPassword);//contraseña
        await page.click('button:has-text("INICIAR SESIÓN")');

        //Validar header, logo y nav
        const header = page.locator('header.fixed');//header
        await expect(header).toBeVisible();
        await expect(header.locator('text=ApagónRD')).toBeVisible();//logo
        await expect(header.locator('button:has-text("Inicio")')).toBeVisible();//inicio
        await expect(header.locator('button:has-text("Reportar")')).toBeVisible();//reportar
        await expect(header.locator('button:has-text("Mis reportes")')).toBeVisible();//mis reportes

        // Validar el menú de perfil y cerrar sesión
        const profileButton = page.locator('.menu-item img[alt="Profile"]');
        await profileButton.click();
        const profileName = header.locator('p', { hasText: 'IRodriguez' });//nombre
        await expect(profileName).toBeVisible();
        const editBtn = header.locator('button:has-text("Editar mi perfil")');//Editar mi perfil
        await expect(editBtn).toBeVisible();
        const logoutBtn = header.locator('button:has-text("Cerrar Sesión")');//cerrar section
        await expect(logoutBtn).toBeVisible();

        //mapa y elementos
        await expect(page.locator('.leaflet-container')).toBeVisible();
        await expect(page.locator('div:has-text("Con electricidad")').first()).toBeVisible();//Validar leyenda Con electricidad
        await expect(page.locator('div.w-3.h-3.bg-green-500')).toBeVisible();
        await expect(page.locator('div:has-text("Sin electricidad")').first()).toBeVisible();//Sin electricidad
        await expect(page.locator('div.w-3.h-3.bg-red-500')).toBeVisible();

        const btnReportar = page.locator('button:has-text("Reportar")').first();//Validar reportar
        await expect(btnReportar).toBeVisible();
        await expect(btnReportar).toBeEnabled();

        const zonas = page.locator('path.leaflet-interactive');//Validar polígonos
        await expect(zonas.first()).toBeVisible({ timeout: 15000 });//Esperar zona
        const fillColor = await zonas.first().getAttribute('fill');//Validar que tiene color
        const strokeColor = await zonas.first().getAttribute('stroke');
        expect(fillColor || strokeColor).not.toBeNull();//color o cualquier valor presente
        expect((fillColor ?? strokeColor)?.trim().length).toBeGreaterThan(0);
        const centrarBtn = page.getByTitle("Centrar en mi ubicación");//btn centrar ubicación
        await expect(centrarBtn).toBeVisible();


        await zonas.first().click();//clic en cualquier zona del mapa
        const popup = page.locator('.leaflet-popup-content-wrapper .leaflet-popup-content');
        await expect(popup).toBeVisible();
        await expect(popup).not.toHaveText('');//Validar estado
    });
});
