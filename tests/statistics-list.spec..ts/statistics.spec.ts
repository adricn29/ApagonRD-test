import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword} from "../constants";

test('Validaciones de estadísticas', async ({ browser }) => {

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

    await page.click('button:has-text("Estadisticas")');//entrar a estadísticas

    //seleccionar punto
    const select = page.locator('select.select');
    await select.hover();
    await select.click({ force: true });
    await page.waitForTimeout(300);
    await page.selectOption('select.select', { index: 1 });//seleccionar primera opción

    //contenedor principal del sector
    const sectorCard = page.locator('.rounded-2xl').first();
    await expect(sectorCard).toBeVisible();
    const h2 = sectorCard.getByRole('heading', { level: 2 });//validar titulo
    await expect(h2).toBeVisible();
    expect((await h2.textContent())?.trim()).not.toBe('');//no este vació

    const estado = sectorCard.locator('div span.text-sm');//validar estado
    await expect(estado).toBeVisible();
    expect((await estado.textContent())?.trim()).not.toBe('');//no este vació

    const periodo = sectorCard.locator('p.text-lg');//validar período
    await expect(periodo).toBeVisible();
    expect((await periodo.textContent())?.trim()).not.toBe('');//no este vació

    //Validar que existan cards 4
    const cards = page.locator('.grid .rounded-xl');
    await expect(cards).toHaveCount(4);

    await expect(cards.nth(0).getByText('Tiempo con energía')).toBeVisible();//Tiempo con energía
    await expect(cards.nth(0).locator('p.text-3xl')).toBeVisible();

    await expect(cards.nth(1).getByText('Horas con energía')).toBeVisible();//Horas con energía
    await expect(cards.nth(1).locator('p.text-3xl')).toBeVisible();

    await expect(cards.nth(2).getByText('Horas sin energía')).toBeVisible();//Horas sin energía
    await expect(cards.nth(2).locator('p.text-3xl')).toBeVisible();

    await expect(cards.nth(3).getByText('Total horas')).toBeVisible();//Total horas
    await expect(cards.nth(3).locator('p.text-3xl')).toBeVisible();

    //Contenedor principal del gráfico
    const graphicCard = page.locator('.rounded-2xl', { hasText: 'Proporción de energía' });
    await expect(graphicCard).toBeVisible();
    await expect(graphicCard.getByRole('heading', { level: 3, name: 'Proporción de energía' })).toBeVisible();
    const canvas = graphicCard.locator('canvas');// Validar título del gráfico
    await expect(canvas).toBeVisible();

    //Contenedor del Resumen del mes
    const summaryCard = page.locator('.rounded-xl', { hasText: 'Resumen del mes' });
    await expect(summaryCard).toBeVisible();

    await expect(summaryCard.getByRole('heading', { level: 3, name: 'Resumen del mes' })).toBeVisible();//Validar título
    const summaryItems = summaryCard.locator('.space-y-4 > div');//Obtener los 3 ítems
    await expect(summaryItems).toHaveCount(3);

    await expect(summaryItems.nth(0).getByText('Días sin energía')).toBeVisible();//Días sin energía
    await expect(summaryItems.nth(0).locator('span.text-lg')).toBeVisible();

    await expect(summaryItems.nth(1).getByText('Eficiencia')).toBeVisible();//Eficiencia
    await expect(summaryItems.nth(1).locator('span.text-lg')).toBeVisible();

    await expect(summaryItems.nth(2).getByText('Promedio diario sin luz')).toBeVisible();//Promedio diario sin luz
    await expect(summaryItems.nth(2).locator('span.text-lg')).toBeVisible();
});