---
name: paginas-udm-frontend
description: Use quando a tarefa envolver criação ou alteração de páginas, rotas Next, page.tsx, componentes.tsx, ControladorSlot, PAGINAS, MENUS, layout contextualizado, Conteiner, Contexto de Controle de Fluxo, Contexto de SPA ou SPA de renderização no frontend do Universo do Medo.
---

# Skill — Páginas UDM no frontend

Esta skill define o comportamento esperado para tarefas que envolvem páginas no frontend `universodomedo.com`.

Antes de criar ou alterar página, rota, menu, layout contextualizado, conteiner, contexto ou SPA, leia também:

```txt
references/padrao_pagina_comum_udm.md
```

Esse documento é a fonte normativa detalhada. Esta skill é apenas o quick view operacional.

## Regra central

Página oficial no Universo do Medo não nasce no frontend.

O frontend renderiza a estrutura definida pela Nora-Api.

O fluxo oficial é:

```txt
PAGINAS
→ MENUS
→ page.tsx
→ componentes.tsx
→ ControladorSlot
→ Conteiner
→ Contexto de Controle de Fluxo
→ resolveSaida
→ Contexto de SPA
→ SPA de renderização
```

## Responsabilidade do backend

A existência oficial da página vem de `PAGINAS`, na Nora-Api.

A navegação oficial vem de `MENUS`, na Nora-Api.

O frontend não deve inventar página oficial, rota oficial, menu principal, menu interno, menu contextual, acesso, capacidade, regra de autorização ou estrutura equivalente a `PAGINAS`/`MENUS`.

Se a página, menu ou acesso não existir no contrato da Nora-Api, reportar bloqueio ou necessidade de ajuste backend.

## `page.tsx`

`page.tsx` deve ser mínimo.

Responsabilidades:

- definir a entrada física da rota pelo padrão de pastas do Next;
- manter o `default export` exigido pelo Next;
- chamar o componente client da mesma pasta.

Não colocar regra de negócio, consulta, contexto, layout, acesso, formulário, listagem, decisão de fluxo ou renderização real da página em `page.tsx`.

## `componentes.tsx`

`componentes.tsx` é a ponte entre Next e arquitetura UdM.

Responsabilidades:

- importar `PAGINAS` de `types-nora-api`;
- chamar `ControladorSlot`;
- passar exatamente a página definida no backend;
- renderizar o `Conteiner__PaginaX`;
- tratar params/slug apenas quando necessário.

Não renderizar página oficial sem `ControladorSlot`. Não passar página hardcoded. Não criar rota oficial sem `PAGINAS`.

## `ControladorSlot`

`ControladorSlot` conecta o frontend à definição oficial do backend. Ele resolve autenticação, acesso, layout contextualizado, menu contextual, cabeçalho, redirecionamentos e renderização do layout correto.

Não burlar `ControladorSlot` em página oficial.

## Conteiner, contexto e SPA

`Conteiner` controla fluxo de página SPA e não é componente visual.

Estrutura esperada:

```txt
Conteiner__PaginaX
Conteiner__PaginaX__Interno
resolveSaida
useEstado
```

`resolveSaida` não deve retornar JSX diretamente.

O contexto geral controla dados e estado compartilhados entre subfluxos.

O contexto de SPA controla lógica de um subfluxo específico.

SPA renderiza e não deve decidir fluxo, executar GraphQL, chamar endpoint diretamente, montar payload, controlar layout contextualizado ou conter `useState` de fluxo.

Quando a SPA precisar renderizar itens menores, componentes finais devem receber dados por props sempre que possível.

Não espalhar `useContexto__...` em componentes folha.

## Nomenclatura

A nomenclatura com `__` é parte do padrão. Não simplificar nomes como `Conteiner__PaginaX`, `Contexto__PaginaX__Listagem` ou `SPA__PaginaX__Listagem`.

## Listagens e formulários

Para listagens comuns, preferir o padrão existente com `useNoraGraphQLListagem` e `ListagemComposta`.

Para formulários comuns de criação/edição, preferir o padrão existente com contexto de subfluxo e `useFormularioCreate`, quando aplicável.

Não voltar a criar dezenas de `useState` manuais para campos simples de formulário.

## CSS da página

CSS module da SPA deve ficar próximo da SPA quando for específico dela.

Não criar CSS único para várias páginas ou vários componentes independentes.

Separar estilo por responsabilidade e reutilização.

## Checklist mínimo

Ao criar ou alterar página:

- confirmar que a página existe em `PAGINAS`;
- confirmar menu/navegação em `MENUS` quando aplicável;
- usar `PAGINAS` vindo de `types-nora-api`;
- criar `page.tsx` mínimo;
- criar `componentes.tsx` com `ControladorSlot`;
- renderizar `Conteiner__PaginaX`;
- manter `Conteiner` como controlador de fluxo;
- manter contexto como dono de dados/lógica;
- manter SPA como renderização;
- preservar nomenclatura com `__`;
- preservar UX e comportamento existente.

## Bloqueios

É bloqueado criar página oficial primeiro no frontend, criar rota sem contrato em `PAGINAS`, criar menu local para página oficial, burlar `ControladorSlot`, hardcodar rota/página quando existe `PAGINAS`, mover regra de acesso para o frontend, simplificar nomes removendo `__`, colocar regra de negócio em `page.tsx`, transformar `componentes.tsx` em componente visual pesado, retornar JSX diretamente em `resolveSaida`, decidir fluxo dentro da SPA, chamar API diretamente em componente visual, consumir contexto em vários componentes folha quando props resolvem ou concentrar contexto, fluxo, renderização e CSS em um único arquivo.
