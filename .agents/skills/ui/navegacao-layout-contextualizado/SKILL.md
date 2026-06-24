---
name: navegacao-layout-contextualizado
description: Usar useConfigurarLayoutContextualizado para a navegação contextual de uma subpágina no frontend do Universo do Medo. O título fica estável e vem da PAGINA; o subtítulo detalha o processo e o alvo atual; fecharProps mantém a navegação não-travada. Nunca redefinir nem duplicar o título, e nunca repetir a identidade do alvo no corpo da SPA (tagId, header de nome ou fonte) porque ocupa espaço nobre e essa identidade pertence ao subtítulo.
---

# UdM Frontend — Navegação contextual com `useConfigurarLayoutContextualizado`

## Regra central

`useConfigurarLayoutContextualizado` (`src/redux/hooks/useLayoutContextualizado.ts`) configura a **navegação contextual** da subpágina — o cabeçalho que o `LayoutContextualizado` desenha. O conjunto **título + subtítulo + fecharProps** existe pra manter a navegação **intuitiva e não-travada**, não pra repetir informação.

- **`titulo`** — fica **estável** em qualquer subpágina. Ele já vem da definição da PAGINA (ex.: "Configurar Música"). **Não redefina nem duplique.** Redefinir cria pares redundantes que não informam nada (título "Configurar Música" + subtítulo "Configurando música").
- **`subtitulo`** — **detalha o processo e o alvo atual**. É o que diferencia esta instância da subpágina das outras. Ex.: `${nomeFonte} · ${nomeMusica}`, "Editando bloco 3", "Revisando pendências de João".
- **`fecharProps`** — garante a saída (voltar pra listagem/pai). Mantém a navegação não-travada; o usuário nunca fica preso.

## Anti-padrões (não faça)

1. Setar `titulo` repetindo o título da página → redundância inútil.
2. Pôr a identidade do alvo **no corpo** da SPA (um `<span>Música #id</span>`, um header com nome/fonte) → ocupa espaço nobre do conteúdo e duplica o que o subtítulo já diz. **A identidade do alvo pertence ao subtítulo, não ao corpo.**
3. Esquecer `fecharProps` → navegação travada.

## Padrão correto

```tsx
// título estável (vem da PAGINA) + subtítulo detalha o alvo + fecharProps sempre
useConfigurarLayoutContextualizado({
    subtitulo: `${nomeFonte} · ${nomeMusica}`,
    fecharProps: { tipo: 'acao', executar: () => deseleciona(), tituloTooltip: 'Voltar para a listagem' },
});
```

No corpo da SPA: **nada** de tag de id nem header repetindo nome/fonte — o conteúdo real (editor, timeline, painéis, formulário) ocupa o espaço; a identidade está no subtítulo.

## Campos

`LayoutContextualizadoInterno` (slice `layoutContextualizadoSlice`): `titulo`, `subtitulo`, `fecharProps`, `escondeFundo`, `proporcaoConteudo`, `esconderMenu`, `menuTipo`, `menuItens`. O `modo` padrão é `'patch'` (altera só o que você passa); `'update'` substitui tudo. Em subpágina, normalmente só `subtitulo` + `fecharProps`.

## Checklist

- [ ] O título da PAGINA já serve? Então **não** sete `titulo` no hook.
- [ ] O `subtitulo` diz **o que** está sendo feito e **em qual alvo** (sem repetir o título).
- [ ] `fecharProps` presente (navegação não-travada).
- [ ] O corpo da SPA **não** repete a identidade do alvo (sem tag de id, sem header de nome/fonte).
