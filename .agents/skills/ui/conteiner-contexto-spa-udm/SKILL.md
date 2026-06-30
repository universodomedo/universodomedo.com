---
name: conteiner-contexto-spa-udm
description: Use quando a tarefa envolver Conteiner, criaConteiner, resolveSaida, useEstado, Contexto de Controle de Fluxo, Contexto de SPA/Subfluxo, SPA de renderização, separação entre lógica e renderização, componente final por props ou arquitetura de fluxo de páginas no frontend do Universo do Medo.
---

# Skill — Conteiner, Contexto e SPA no frontend UDM

Esta skill define o padrão de arquitetura de fluxo de páginas no frontend `universodomedo.com`.

Antes de criar ou alterar conteiner, contexto geral, contexto de subfluxo ou SPA de renderização, leia também:

```txt
references/padrao_pagina_comum_udm.md
```

Esse documento é a fonte normativa detalhada. Esta skill é o quick view operacional.

## Regra central

No frontend do Universo do Medo:

```txt
Conteiner controla fluxo.
Contexto controla lógica, estado, dados e ações.
SPA/componente visual renderiza.
Componente final recebe dados por props.
```

Não misturar essas responsabilidades.

## Cadeia arquitetural

O fluxo padrão de uma página SPA é:

```txt
componentes.tsx
→ ControladorSlot
→ Conteiner__PaginaX
→ Contexto__PaginaX
→ Conteiner__PaginaX__Interno
→ resolveSaida
→ Contexto__PaginaX__Subfluxo
→ SPA__PaginaX__Subfluxo
→ componentes finais por props
```

## Conteiner

O `Conteiner` é o controlador de fluxo da página. Ele não é componente visual, contexto, lugar de chamada de API, lugar de formulário, lugar de listagem, lugar de renderização final ou lugar de regra de negócio visual.

Estrutura esperada:

```txt
Conteiner__PaginaX
Conteiner__PaginaX__Interno
resolveSaida
useEstado
```

`Conteiner__PaginaX` é a função pública importada por `componentes.tsx`, embrulha o conteúdo com o contexto geral da página e renderiza o interno.

`Conteiner__PaginaX__Interno` aplica `criaConteiner`, conecta `useEstado` e `resolveSaida` e transforma estado em saída renderizável.

## `resolveSaida`

`resolveSaida` decide o subfluxo ativo da SPA. Ele deve retornar `SaidaConteiner`, usar `criaSaidaConteiner(Provider, props)` e repassar ao subfluxo apenas as props necessárias.

`resolveSaida` não deve retornar JSX diretamente, renderizar componente visual, chamar API, executar GraphQL, montar payload, manipular DOM, conter regra visual ou criar estado local.

## `useEstado`

`useEstado` conecta o conteiner ao contexto geral da página. Ele consome o contexto geral e retorna as props usadas pelo `resolveSaida`.

Não deve decidir branch, renderizar, chamar API diretamente ou conter lógica visual.

## Contexto de Controle de Fluxo

O contexto geral da página é dono do estado estrutural da página.

Pode conter listagem principal, chamada GraphQL estrutural, estados que decidem subfluxo, item selecionado, seleção/deseleção, flags usadas por `resolveSaida`, dados compartilhados entre subfluxos e ações gerais da página.

Não deve conter renderização visual, JSX de tela, dezenas de states de formulário, lógica exclusiva de um subfluxo isolado, montagem de payload específica de criação/edição, chamada de endpoint que pertence a um subfluxo ou componentes finais de renderização.

## Contexto de SPA/Subfluxo

O contexto de subfluxo é dono da lógica específica de uma branch da página.

Exemplos: `Contexto__PaginaX__Listagem`, `Contexto__PaginaX__NovaEntidade`, `Contexto__PaginaX__Edicao`, `Contexto__PaginaX__Detalhe`, `Contexto__PaginaX__Selecao`.

Responsabilidades:

- receber props do contexto geral via `resolveSaida`;
- expor apenas o que a SPA precisa;
- controlar lógica do subfluxo;
- configurar formulário quando aplicável;
- configurar layout contextualizado quando aplicável;
- definir ações do subfluxo;
- renderizar diretamente a SPA correspondente.

Não deve refazer GraphQL se os dados já vêm do contexto geral, decidir fluxo principal, conter UI, renderizar `{children}` quando o padrão do subfluxo é renderizar a SPA diretamente, ou acumular responsabilidade de outros subfluxos.

## SPA de renderização

A SPA é componente de renderização. Ela consome o contexto do subfluxo, renderiza tela, monta composição visual, chama componentes finais passando props e preserva UX existente.

Ela não deve controlar fluxo principal, decidir branch de página, executar GraphQL, chamar endpoint diretamente, montar payload, conter regra de domínio, alterar layout contextualizado diretamente, conter estados de fluxo ou concentrar lógica de contexto.

## Componentes finais por props

Componentes finais de renderização devem receber dados por props sempre que possível.

Especialmente no fim de cadeias aninhadas, o componente folha deve ser atômico, testável e previsível.

Regra obrigatória:

- contexto deve ser consumido por contexto, SPA ou componente agregador;
- componente final deve receber dados por props;
- não espalhar `useContexto__...` por vários componentes pequenos;
- não usar contexto como atalho para evitar passagem de props;
- não fazer componente visual depender de contexto global quando props resolvem;
- não acoplar componente final ao fluxo inteiro da página.

## Renderizadores locais

Renderizadores locais pequenos são aceitáveis quando são claramente subordinados à SPA.

Mas arquivos com muitas funções `RenderizaX`, `RenderizaY`, `RenderizaZ` indicam excesso de responsabilidade.

Regra obrigatória:

- não criar SPA com dezenas de renderizadores locais;
- separar renderizações independentes em componentes próprios;
- separar por responsabilidade e reutilização;
- manter renderizador local apenas quando ele for pequeno, específico e subordinado ao componente principal.

## Listagem

Em fluxo de listagem, contexto geral pode carregar a listagem estrutural, contexto de listagem recebe a listagem e ações relevantes, SPA de listagem renderiza `ListagemComposta` ou composição visual equivalente, e item final deve receber registro por prop.

Não refazer GraphQL dentro do contexto de listagem quando a listagem já vem do contexto geral.

Não montar filtro/paginação manual se o hook padrão já resolve.

## Criação, edição e detalhe

Em fluxo de criação/edição/detalhe, contexto de subfluxo controla formulário, ações e estado específico; SPA renderiza campos, botões e mensagens; componentes finais recebem props; payload deve ser montado no contexto/hook, não no componente visual final.

Para formulários comuns, preferir `useFormularioCreate` quando aplicável.

Não voltar para dezenas de `useState` manuais em formulário comum.

## Estrutura corpo + ações — `ConteudoForm` (OBRIGATÓRIO)

TODA SPA/tela com **corpo + botões de ação** (edição, criação, detalhe, seleção, configuração, ou qualquer fluxo com ações) DEVE usar o compound **`ConteudoForm`** (`componentes/Elementos/ConteudoForm`):

```tsx
<ConteudoForm>
    <ConteudoForm.AreaCorpo>…campos/listagem/conteúdo…</ConteudoForm.AreaCorpo>
    <ConteudoForm.AreaBotoes><button …>…</button></ConteudoForm.AreaBotoes>
</ConteudoForm>
```

- `AreaCorpo` preenche o espaço; `AreaBotoes` já é o rodapé padronizado (centralizado, fixo na base, separador).
- Os botões são `<button>` direto dentro do `AreaBotoes` (ele estiliza on-brand; variante via `data-variante="secundario"|"perigo"`, default = primário ouro). NÃO há componente `Botao`; NÃO estilizar botão de ação na mão por página. Ver `estilos-css-udm`.
- É BLOQUEADO montar a área de ações na mão (`.acoes`/`<div>` de botões com CSS próprio por página) ou estilizar botão direto. Reimplementar o rodapé por página é exatamente o anti-padrão que o `ConteudoForm` elimina.

## Nomenclatura

A nomenclatura com `__` é obrigatória no padrão UDM.

Não simplificar nomes removendo `__`.

A nomenclatura comunica responsabilidade e hierarquia.

## Bloqueios

É bloqueado colocar renderização visual no `Conteiner`, retornar JSX diretamente em `resolveSaida`, decidir fluxo dentro da SPA, chamar API diretamente em componente visual final, executar GraphQL em componente visual final, montar payload em componente visual final, espalhar `useContexto__...` em componentes folha, usar contexto como atalho para evitar props, criar SPA monolítica com vários subfluxos, criar arquivo com dezenas de renderizadores locais, misturar contexto geral com lógica específica de subfluxo, refazer GraphQL no contexto de subfluxo sem necessidade, simplificar a nomenclatura arquitetural ou concentrar fluxo, estado, formulário, renderização e CSS no mesmo arquivo.
