import { expect, test } from '@playwright/test';

import { casoDeTesteE2E } from './casoDeTesteE2E';

const URL_BACKEND = process.env.E2E_BACKEND_URL ?? 'https://back.caio.universodomedo.com';

test.beforeAll(async ({ request }) => {
    // Janela limpa antes de medir: sem isso, cota consumida por execuções anteriores do mesmo IP faria o caso do captcha receber "Muitas tentativas" em vez do erro anti-robô (endpoint dev-gated).
    await request.post(`${URL_BACKEND}/api/acessos/teste/reiniciar-limites`).catch(() => { });
});

casoDeTesteE2E({
    titulo: 'cadastro sem token de captcha é rejeitado pelo gate anti-robô',
    esperado: 'POST direto no cadastrar sem tokenCaptcha falha com a mensagem de verificação anti-robô e nenhuma conta nasce',
    porque: 'bot que fala direto com a API (pulando o navegador) é o ataque mais barato de cadastro em massa — o gate precisa estar ARMADO no ambiente, não só existir no código',
}, async ({ request }) => {
    const resposta = await request.post(`${URL_BACKEND}/api/acessos/cadastrar`, { data: { apelido: `TesteE2E-bot-${Date.now()}`, email: `teste-e2e-bot-${Date.now()}@exemplo.com`, senha: 'senha-de-bot-123' } });

    expect(resposta.ok()).toBeFalsy();
    expect(await resposta.text()).toContain('anti-robô');
});

casoDeTesteE2E({
    titulo: 'rajada de solicitações de recuperação é bloqueada pelo limite de taxa',
    esperado: 'em até 6 tentativas seguidas do mesmo IP, alguma resposta traz "Muitas tentativas"',
    porque: 'o teto de 3/10min por IP corta spam de email de recuperação (que custa envio real); a rota de recuperação é usada aqui de propósito para NÃO queimar a janela do verificar-email, que o caso do fluxo feliz precisa consumir na mesma execução',
}, async ({ request }) => {
    let bloqueado = false;

    for (let tentativa = 0; tentativa < 6 && !bloqueado; tentativa++) {
        const resposta = await request.post(`${URL_BACKEND}/api/acessos/solicitar-recuperacao`, { data: { identificador: `TesteE2E-rajada-${tentativa}@exemplo.com` } });
        bloqueado = (await resposta.text()).includes('Muitas tentativas');
    }

    expect(bloqueado).toBeTruthy();
});