import {expect, test} from '@playwright/test';
import {TestEmail, TestPassword, BaseURL} from "../constants";

test.describe('login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(BaseURL);
    });

    test('Validaciones del login desde la página principal', async ({ page }) => {
        //ingresar desde la página principal
        const inBtn = page.getByRole('button', { name: 'Ingresar' });
        await expect(inBtn).toBeVisible();
        await page.click('button:has-text("Ingresar")');

        //Iniciar sesión con todos los campos vacíos
        await page.click('button:has-text("INICIAR SESIÓN")');
        const emailError = page.locator('p.text-red-500').nth(0);
        const passwordError = page.locator('p.text-red-500').nth(1);
        await expect(emailError).toBeVisible();
        await expect(passwordError).toBeVisible();

        //Iniciar sesión con usuario incorrecto
        await page.fill('input[name="username"]', '00000000');
        await page.fill('input[name="password"]', TestPassword);
        await page.click('button:has-text("INICIAR SESIÓN")');

        const userError = page.locator('div.text-red-800', {
            hasText: 'Usuario o contraseña incorrecto.'
        });
        await expect(userError).toBeVisible();

        //Iniciar sesión con Contraseña incorrecto
        await page.fill('input[name="username"]', TestEmail);
        await page.fill('input[name="password"]', '00000000');
        await page.click('button:has-text("INICIAR SESIÓN")');

        const errorMessage = page.locator('div.text-red-800', {
            hasText: 'Usuario o contraseña incorrecto.'
        });
        await expect(errorMessage).toBeVisible();

        //validar recuperar contraseña
        await page.getByRole('link', { name: /recuperar contraseña/i }).click();
        const recoverForm = page.locator('form[name="Recover Form"]');
        await expect(recoverForm).toBeVisible();//validar q se muestre el formulario
        const usernameInput = recoverForm.locator('input[name="username"]');
        await expect(usernameInput).toBeVisible();//validar input usuario
        await page.fill('input[name="username"]', 'irodriguez');//completar

        const enviarBtn = recoverForm.getByRole('button', { name: /enviar/i });
        await expect(enviarBtn).toBeVisible();//validar btn enviar
        await page.click('button:has-text("Enviar")');//enviar

        const successMsg = page.locator('text=¡Correo enviado con éxito!');// Validar mensaje de éxito
        const descriptionMsg = page.locator('text=Te hemos enviado un correo con las instrucciones');
        await expect(successMsg).toBeVisible();
        await expect(descriptionMsg).toBeVisible();

        const back1Link = page.locator('a', { hasText: 'Volver al login' }).nth(0);
        await expect(back1Link).toBeVisible();
        await back1Link.click();//volver al login

        // Validar registrar un usuario
        await page.click('text=¡Regístrate!');
        await expect(page.locator('input[name="firstname"]')).toBeVisible();//nombre
        await expect(page.locator('input[name="lastname"]')).toBeVisible();//apellido
        await expect(page.locator('input[name="username"]')).toBeVisible();//usuario
        await expect(page.locator('input[name="email"]')).toBeVisible();//email
        await expect(page.locator('select[name="documentType"]')).toBeVisible();//tipo de documento
        await expect(page.locator('input[name="documentNumber"]')).toBeVisible();//numero de documento
        await expect(page.locator('input[name="password"]')).toBeVisible();//contraseña
        await expect(page.locator('button:has-text("REGISTRARSE")')).toBeVisible();//registrar

        const backLink = page.locator('a', { hasText: '¿Ya tienes cuenta? Inicia sesión' }).nth(0);
        await expect(backLink).toBeVisible();
        await backLink.click();//volver al login

        //Iniciar sesión con información correcta
        await page.fill('input[name="username"]', TestEmail);//usuario
        await page.fill('input[name="password"]', TestPassword);//contraseña
        await page.click('button:has-text("INICIAR SESIÓN")');
        });
});