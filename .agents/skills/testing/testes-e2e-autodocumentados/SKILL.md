---
name: testes-e2e-autodocumentados
description: Aplicar o padrão de teste E2E autodocumentado do frontend UDM ao criar ou alterar specs do Playwright em e2e/ — todo caso usa casoDeTesteE2E() com titulo, esperado e porque, produzindo testes que se explicam, logam seus resultados e registram as propriedades no relatório do Playwright.
---

# UDM — Testes E2E autodocumentados (Playwright)

## Regra central

Todo caso E2E NOVO ou ALTERADO usa o helper `casoDeTesteE2E` de `e2e/casoDeTesteE2E` no lugar do `test()` cru. O objetivo não é apenas testar: é produzir casos que se autodocumentam (o que, o esperado e o porquê) e que ficam rastreáveis no output do runner E no relatório HTML do Playwright (annotations).

## Forma obrigatória

```ts
import { casoDeTesteE2E } from './casoDeTesteE2E';

casoDeTesteE2E({
    titulo: 'rajada no verificar-email é bloqueada pelo limite de taxa',
    esperado: 'até 12 tentativas seguidas, alguma resposta traz "Muitas tentativas"',
    porque: '10/min por IP corta força bruta de token sem atrapalhar uso legítimo',
}, async ({ request }) => {
    // arrange / act / assert
});
```

- `titulo` em linguagem de domínio (vira o nome do caso no runner e no relatório).
- `esperado` descreve o observável que os expects comprovam.
- `porque` registra a decisão de produto/segurança — números e limites escolhidos são explicados aqui.
- O helper loga `[CASO]/[ESPERADO]/[PORQUE]/[RESULTADO]` e grava annotations — não duplicar manualmente.

## Regras operacionais

- Não usar `test()` cru em spec nova; hooks (`beforeAll`/`afterEach`) continuam os do Playwright.
- A suíte roda SERIAL (config) — a spec de proteções esgota janelas de rate limit que colidiriam com o fluxo feliz em paralelo no mesmo IP.
- Contas de teste usam o prefixo `TesteE2E` (única aceita pelos endpoints de teste do backend) e NUNCA email real — só `@exemplo.com`.
- Limpeza é obrigatória: `afterEach` com `teste/limpar` + varredura `teste/limpar-todas` no `beforeAll`.
- O backend do ambiente alvo precisa de `HABILITAR_ENDPOINTS_DE_TESTE=true` (nunca em prod).
- Ambiente dev/E2E usa as chaves de TESTE do Turnstile (1x…AA) — as reais escalam desafio interativo e bloqueiam a própria automação.

## Checklist

- caso novo/alterado usa `casoDeTesteE2E` com os três campos preenchidos de verdade;
- porquê explica números/limites;
- conta de teste com prefixo e limpeza garantida;
- nenhum `test()` cru introduzido.
