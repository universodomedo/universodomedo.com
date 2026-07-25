import { expect, test } from '@playwright/test';

const URL_BACKEND = process.env.E2E_BACKEND_URL ?? 'https://back.caio.universodomedo.com';

// Provas de que as proteções anti-bot estão ARMADAS no ambiente (a discriminação fina de token real é da Cloudflare e está coberta por unitários com stub).
test('cadastro sem token de captcha é rejeitado pelo gate anti-robô', async ({ request }) => {
    const resposta = await request.post(`${URL_BACKEND}/api/acessos/cadastrar`, { data: { apelido: `TesteE2E-bot-${Date.now()}`, email: `teste-e2e-bot-${Date.now()}@exemplo.com`, senha: 'senha-de-bot-123' } });

    expect(resposta.ok()).toBeFalsy();
    expect(await resposta.text()).toContain('anti-robô');
});

test('rajada no verificar-email é bloqueada pelo limite de taxa', async ({ request }) => {
    let bloqueado = false;

    for (let tentativa = 0; tentativa < 12 && !bloqueado; tentativa++) {
        const resposta = await request.post(`${URL_BACKEND}/api/acessos/verificar-email`, { data: { token: 'token-de-rajada-inexistente' } });
        bloqueado = (await resposta.text()).includes('Muitas tentativas');
    }

    expect(bloqueado).toBeTruthy();
});