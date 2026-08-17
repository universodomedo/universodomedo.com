import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

import { casoDeTesteE2E } from './casoDeTesteE2E';

const URL_BACKEND = process.env.E2E_BACKEND_URL ?? 'https://back.caio.universodomedo.com';

// Apelido cabe no limite de 25 caracteres do campo (o input trunca e o login com o nome completo não encontraria a conta).
const marcador = String(Date.now()).slice(-8);
const apelido = `TesteE2E-alt-${marcador}`;
const email = `teste-e2e-alt-${marcador}@exemplo.com`;
const senha = `senha-e2e-alt-${marcador}`;

async function cadastraContaDeTeste(request: APIRequestContext, page: Page): Promise<void> {
    await page.goto('/cadastrar');
    await page.locator('main input[type="text"]').first().fill(email);
    const camposSenha = page.locator('main input[type="password"]');
    await camposSenha.nth(0).fill(senha);
    await camposSenha.nth(1).fill(senha);

    const botaoProsseguir = page.getByRole('button', { name: 'Prosseguir' });
    await expect(botaoProsseguir).toBeEnabled({ timeout: 30000 });
    await botaoProsseguir.click();
    await expect(page.getByText('Confira seu Email')).toBeVisible();

    await request.delete(`${URL_BACKEND}/auth/logout`);
};

async function verificaEmailDaContaDeTeste(request: APIRequestContext, page: Page): Promise<void> {
    const respostaTokens = await request.post(`${URL_BACKEND}/api/acessos/teste/tokens`, { data: { email } });
    expect(respostaTokens.ok()).toBeTruthy();
    const tokens = await respostaTokens.json();

    await page.goto(`/acessar?token=${tokens.tokenVerificacao}`);
    await expect(page.getByText('Sua conta está ativa', { exact: false })).toBeVisible({ timeout: 15000 });
};

// O gate de perfil é renderizado pelo contexto de autenticação, acima do <main> da página — por isso os seletores aqui são globais.
async function completaPerfilDeTeste(page: Page): Promise<void> {
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
};

test.beforeAll(async ({ request }) => {
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar-todas`).catch(() => { });
    await request.post(`${URL_BACKEND}/api/acessos/teste/reiniciar-limites`).catch(() => { });
});

test.afterEach(async ({ request }) => {
    await request.post(`${URL_BACKEND}/api/acessos/teste/limpar`, { data: { email } }).catch(() => { });
});

casoDeTesteE2E({
    titulo: 'login por senha é bloqueado enquanto o email não foi verificado',
    esperado: 'com a senha CORRETA, o login de conta pendente mostra "Email ainda não verificado" e oferece o reenvio; a sessão não é criada',
    porque: 'a verificação é o que prova posse do email — sem ela, qualquer um que soubesse a senha entraria numa conta cujo email pode ser de terceiro',
}, async ({ page, request }) => {
    await cadastraContaDeTeste(request, page);

    await page.goto('/acessar');
    await page.locator('main input[type="text"]').first().fill(email);
    await page.locator('main input[type="password"]').first().fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email ainda não verificado', { exact: false })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Reenviar email de verificação')).toBeVisible();
    await expect(page).not.toHaveURL(/minha-pagina/);
});

casoDeTesteE2E({
    titulo: 'quem é barrado numa página protegida volta para ela depois de logar',
    esperado: 'visitante que tenta /minha-pagina cai em /acessar?next=%2Fminha-pagina e, após entrar e concluir o perfil, é levado de volta para /minha-pagina',
    porque: 'perder o destino no meio do login (ou na etapa de perfil) obriga a pessoa a refazer a navegação; a jornada só termina quando ela chega onde queria ir',
}, async ({ page, request }) => {
    await cadastraContaDeTeste(request, page);
    await verificaEmailDaContaDeTeste(request, page);

    await page.goto('/minha-pagina');
    await expect(page).toHaveURL(/acessar\?next=%2Fminha-pagina/, { timeout: 15000 });

    await page.locator('main input[type="text"]').first().fill(email);
    await page.locator('main input[type="password"]').first().fill(senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await completaPerfilDeTeste(page);
    await expect(page).toHaveURL(/minha-pagina/, { timeout: 30000 });
});

casoDeTesteE2E({
    titulo: 'sem conta verificada não há sessão: página interna redireciona para o acesso',
    esperado: 'recém-cadastrado que tenta abrir /minha-pagina cai em /acessar',
    porque: 'o cadastro não cria sessão — só o login cria, e ele exige email verificado; assim conta pendente não navega nem por engano',
}, async ({ page, request }) => {
    await cadastraContaDeTeste(request, page);

    await page.goto('/minha-pagina');
    await expect(page).toHaveURL(/acessar/, { timeout: 15000 });
});

casoDeTesteE2E({
    titulo: 'cooldown por conta bloqueia reenvio imediato de verificação',
    esperado: 'segundo pedido de reenvio logo após o primeiro não gera token novo (o token permanece o mesmo)',
    porque: 'o limite por IP não protege uma conta específica contra spam distribuído; 60s por conta corta enxurrada de email e custo de envio',
}, async ({ page, request }) => {
    await cadastraContaDeTeste(request, page);

    await request.post(`${URL_BACKEND}/api/acessos/reenviar-verificacao`, { data: { identificador: email } });
    const tokensPrimeiro = await (await request.post(`${URL_BACKEND}/api/acessos/teste/tokens`, { data: { email } })).json();

    await request.post(`${URL_BACKEND}/api/acessos/reenviar-verificacao`, { data: { identificador: email } });
    const tokensSegundo = await (await request.post(`${URL_BACKEND}/api/acessos/teste/tokens`, { data: { email } })).json();

    expect(tokensSegundo.tokenVerificacao).toEqual(tokensPrimeiro.tokenVerificacao);
});