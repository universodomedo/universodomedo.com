import { defineConfig } from '@playwright/test';

// E2E do funil de acesso: roda contra o ambiente já de pé (front.caio por padrão; sobrescreva com E2E_BASE_URL/E2E_BACKEND_URL). Exige HABILITAR_ENDPOINTS_DE_TESTE=true no backend do ambiente alvo.
export default defineConfig({
    testDir: './e2e',
    timeout: 90000,
    retries: 1,
    // Serial de propósito: a spec de proteções esgota janelas de rate limit que colidiriam com o fluxo feliz rodando em paralelo no mesmo IP.
    fullyParallel: false,
    workers: 1,
    // O fluxo feliz precisa de janela limpa: as specs rodam em ordem alfabética (cadastroAcesso antes de protecoesAcesso) e o retry espera a janela de 60s do limitador reabrir.
    retries: 1,
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'https://front.caio.universodomedo.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});