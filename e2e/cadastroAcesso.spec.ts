import { expect, test } from '@playwright/test';

const URL_BACKEND = process.env.E2E_BACKEND_URL ?? 'https://back.caio.universodomedo.com';

// O funil completo que um usuário novo percorre, com cliques reais: cadastro → verificação (token via endpoint de teste, mesma navegação do link do email) → login → sessão. A conta usa o prefixo TesteE2E (única aceita pelos endpoints de teste) e é removida SEMPRE no afterEach — inclusive quando o teste falha no meio.
const marcador = Date.now();
const apelido = `TesteE2E-${marcador}`;

test.beforeAll(async ({ request }) => {
    // Varredura de higiene: remove qualquer conta TesteE2E* que uma execução anterior interrompida tenha deixado para trás.
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar-todas`).catch(() => { });
});

test.afterEach(async ({ request }) => {
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar`, { data: { apelido } }).catch(() => { });
});

test('cadastro nativo completo: formulário → verificação → login', async ({ page, request }) => {
    const email = `teste-e2e-${marcador}@exemplo.com`;
    const senha = `senha-e2e-${marcador}`;

    await page.goto('/cadastrar');
    await expect(page.getByText('Criar Conta')).toBeVisible();

    const camposTexto = page.locator('main input[type="text"]');
    await camposTexto.nth(0).fill(apelido);
    await camposTexto.nth(1).fill(email);

    const camposSenha = page.locator('main input[type="password"]');
    await camposSenha.nth(0).fill(senha);
    await camposSenha.nth(1).fill(senha);

    await page.getByText('Ler e aceitar os Termos de Aceite').click();
    const caixas = page.locator('main input[type="checkbox"]');
    await caixas.nth(0).check();
    await caixas.nth(1).check();
    await caixas.nth(2).check();
    await page.getByRole('button', { name: 'Voltar' }).click();

    // O Prosseguir só habilita com termos aceitos E o token do Turnstile emitido (widget invisível resolve sozinho).
    const botaoProsseguir = page.getByRole('button', { name: 'Prosseguir' });
    await expect(botaoProsseguir).toBeEnabled({ timeout: 30000 });
    await botaoProsseguir.click();
    await expect(page.getByText('Confira seu Email')).toBeVisible();

    const respostaTokens = await request.post(`${URL_BACKEND}/api/acessos/teste/tokens`, { data: { apelido } });
    expect(respostaTokens.ok()).toBeTruthy();
    const tokens = await respostaTokens.json();
    expect(typeof tokens.tokenVerificacao).toBe('string');

    await page.goto(`/acessar?token=${tokens.tokenVerificacao}`);
    await expect(page.getByText('Sua conta está ativa', { exact: false })).toBeVisible({ timeout: 15000 });

    await page.locator('main input[type="text"]').first().fill(apelido);
    await page.locator('main input[type="password"]').first().fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/minha-pagina/, { timeout: 30000 });
});