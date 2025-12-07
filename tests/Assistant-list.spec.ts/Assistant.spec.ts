import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword, BaseURL} from "../constants";

test.describe('login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(BaseURL);
    });

    test('Validation de Asistente', async ({ page }) => {

        //ingresar desde la página principal
        const logging = page.getByRole('button', { name: 'Ingresar' });
        await expect(logging).toBeVisible();
        await page.click('button:has-text("Ingresar")');

        //Iniciar sesión
        await page.fill('input[name="username"]', TestEmail);//usuario
        await page.fill('input[name="password"]', TestPassword);//contraseña
        await page.click('button:has-text("INICIAR SESIÓN")');

        //Validar btn Asistente
        await page.getByRole('button', { name: 'Asistente' }).click();
        const titulo = page.locator('h1:text("Asistente")');
        await expect(titulo).toBeVisible();//titulo

        //Validar formulario
        await expect(page.getByRole('heading', { name: 'Asistente' })).toBeVisible();
        await expect(page.getByText('Haz preguntas sobre los apagones y el sistema eléctrico.')).toBeVisible();
        await expect(page.locator('form.flex.flex-col.gap-3')).toBeVisible();//form
        const text = page.getByPlaceholder('Escribe tu pregunta...');//textarea
        await expect(text).toBeVisible();
        await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled();//btn enviar

        //interactuar con el chat y enviar
        const textarea = page.getByPlaceholder('Escribe tu pregunta...');
        const sendBtn = page.getByRole('button', { name: 'Enviar' });//btn enviar
        const chatList = page.locator('div.flex-1');//chat
        await textarea.fill('¿Cuál es el estado del servicio en mi zona?');//enviar mensaje
        await expect(sendBtn).toBeEnabled();
        await sendBtn.click();

        //validar mensaje enviado y chat
        await expect(chatList.getByText('¿Cuál es el estado del servicio en mi zona?')).toBeVisible();
        await expect(page.locator('div.max-w-xl.bg-gray-100').first()).toBeVisible();//chat

        //btn Limpiar chat
        const clearChatBtn = page.getByRole('button', { name: 'Limpiar chat' });
        await expect(clearChatBtn).toBeVisible();
        await clearChatBtn.click();
    });
});