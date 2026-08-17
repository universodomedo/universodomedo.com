import { test, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test';

export type DefinicaoCasoDeTesteE2E = { titulo: string; esperado: string; porque: string };

export type FixturesCasoDeTesteE2E = { page: Page; context: BrowserContext; request: APIRequestContext };

/** Padrão de teste E2E autodocumentado (skill testes-e2e-autodocumentados): cada caso declara o que testa, o resultado esperado e o porquê da regra — loga a execução no output do runner e grava as propriedades como annotations do Playwright (aparecem no relatório HTML). O callback do Playwright exige desestruturação literal das fixtures, por isso o repasse explícito. */
export function casoDeTesteE2E(definicao: DefinicaoCasoDeTesteE2E, execucao: (fixtures: FixturesCasoDeTesteE2E) => Promise<void>): void {
    test(definicao.titulo, async ({ page, context, request }, infoDoTeste) => {
        infoDoTeste.annotations.push({ type: 'esperado', description: definicao.esperado }, { type: 'porque', description: definicao.porque });
        console.log(`[CASO] ${definicao.titulo}`);
        console.log(`[ESPERADO] ${definicao.esperado}`);
        console.log(`[PORQUE] ${definicao.porque}`);

        try {
            await execucao({ page, context, request });
            console.log(`[RESULTADO] OK — ${definicao.titulo}`);
        } catch (erro) {
            console.log(`[RESULTADO] FALHOU — ${definicao.titulo}`);
            throw erro;
        }
    });
};