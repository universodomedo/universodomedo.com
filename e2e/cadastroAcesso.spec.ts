import { expect, test } from '@playwright/test';

import { casoDeTesteE2E } from './casoDeTesteE2E';

const URL_BACKEND = process.env.E2E_BACKEND_URL ?? 'https://back.caio.universodomedo.com';

const marcador = String(Date.now()).slice(-8);
const apelido = `TesteE2E-${marcador}`;
const email = `teste-e2e-${marcador}@exemplo.com`;
const senha = `senha-e2e-${marcador}`;

test.beforeAll(async ({ request }) => {
    // Varredura de higiene: remove qualquer conta TesteE2E* que uma execução anterior interrompida tenha deixado para trás.
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar-todas`).catch(() => { });

    // Zera as janelas de limite de taxa: execuções seguidas da suíte consomem a cota do mesmo IP e o fluxo feliz precisa de janela limpa para cadastrar e verificar (endpoint dev-gated).
    await request.post(`${URL_BACKEND}/api/acessos/teste/reiniciar-limites`).catch(() => { });
});

test.afterEach(async ({ request }) => {
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar`, { data: { email } }).catch(() => { });
});

casoDeTesteE2E({
    titulo: 'jornada completa de entrada: cadastro → verificação → login → perfil',
    esperado: 'com cliques reais: cadastro só com email e senha, verificação pelo link do email, login por senha, etapa obrigatória de apelido (com disponibilidade em tempo real) e Termos, e só então a plataforma abre',
    porque: 'é o percurso inteiro de quem chega de fora — se qualquer elo quebrar, perdemos o usuário sem saber; este caso avisa antes de qualquer pessoa real',
}, async ({ page, request }) => {
    await page.goto('/cadastrar');
    await expect(page.getByText('Criar Conta')).toBeVisible();

    await page.locator('main input[type="text"]').first().fill(email);
    const camposSenha = page.locator('main input[type="password"]');
    await camposSenha.nth(0).fill(senha);
    await camposSenha.nth(1).fill(senha);

    // O Prosseguir só habilita com o token do Turnstile emitido (widget invisível resolve sozinho).
    const botaoProsseguir = page.getByRole('button', { name: 'Prosseguir' });
    await expect(botaoProsseguir).toBeEnabled({ timeout: 30000 });
    await botaoProsseguir.click();
    await expect(page.getByText('Confira seu Email')).toBeVisible();

    const respostaTokens = await request.post(`${URL_BACKEND}/api/acessos/teste/tokens`, { data: { email } });
    expect(respostaTokens.ok()).toBeTruthy();
    const tokens = await respostaTokens.json();
    expect(typeof tokens.tokenVerificacao).toBe('string');

    await page.goto(`/acessar?token=${tokens.tokenVerificacao}`);
    await expect(page.getByText('Sua conta está ativa', { exact: false })).toBeVisible({ timeout: 15000 });

    await page.goto('/acessar');
    await page.locator('main input[type="text"]').first().fill(email);
    await page.locator('main input[type="password"]').first().fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Etapa obrigatória de perfil: sem apelido definitivo e Termos, a navegação não abre. O gate vem do contexto de autenticação, acima do <main>, por isso os seletores daqui em diante são globais.
    await expect(page.getByText('Escolha seu Apelido')).toBeVisible({ timeout: 30000 });

    await page.locator('input[type="text"]').first().fill(apelido);
    await expect(page.getByText('Apelido disponível')).toBeVisible({ timeout: 15000 });

    await page.getByText('Ler e aceitar os Termos de Aceite').click();
    const caixas = page.locator('input[type="checkbox"]');
    await caixas.nth(0).check();
    await caixas.nth(1).check();
    await caixas.nth(2).check();
    await page.getByRole('button', { name: 'Voltar' }).click();

    await page.getByRole('button', { name: 'Concluir' }).click();
    await expect(page.getByText('Escolha seu Apelido')).toHaveCount(0, { timeout: 30000 });
});