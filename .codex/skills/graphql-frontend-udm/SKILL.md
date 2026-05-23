---
name: graphql-frontend-udm
description: Use quando a tarefa envolver GraphQL no frontend do Universo do Medo, useNoraGraphQLListagem, GraphqlTypes, GraphqlLeituras, EventosApiGraphql, EventosApiGraphqlV2, select tipado, filtros, whereFixo, paginação, total de registros ou consumo de leituras GraphQL vindas da Nora-Api.
---

# Skill — GraphQL no frontend UDM

Esta skill define como o frontend `universodomedo.com` deve consumir GraphQL da Nora-Api.

## Regra central

GraphQL no frontend é consumo de contrato gerado pela Nora-Api.

O frontend não monta contrato GraphQL paralelo.

O frontend não recria DTO de resposta.

O frontend não inventa campo, filtro ou operação.

## Fonte da verdade

A Nora-Api define leituras GraphQL, campos disponíveis, selects possíveis, filtros disponíveis, filtros de visualização, filtros de consulta, `whereFixo`, totalizadores, tipos de resposta, eventos/operações GraphQL e contratos gerados em `types-nora-api`.

O frontend consome isso via `types-nora-api`.

## Contratos esperados

Quando trabalhar com GraphQL frontend, procurar estruturas como:

```txt
GraphqlTypes<Entidade>
GraphqlLeituras
EventosApiGraphql
EventosApiGraphqlV2
```

Não criar tipo local para substituir resposta inferida.

Não montar operação GraphQL manual se existe operação/contract gerado.

## `useNoraGraphQLListagem`

Para listagens GraphQL comuns, preferir `useNoraGraphQLListagem`.

Esse hook deve orquestrar select, registros, loading, erro, mensagem de lista vazia, filtros de consulta, filtros de visualização, paginação, carregar mais, total de registros, opções remotas de filtros, contador, ações, rodapé e acumulação de páginas.

Não recriar manualmente listagem GraphQL se o hook padrão atende.

## Select tipado

O `select` deve ser feito com campos existentes no contrato gerado.

Não usar string solta para campo inexistente.

Não criar tipo local para “forçar” campo que o contrato não expõe.

Se o campo necessário não existe no contrato, reportar necessidade de ajuste na Nora-Api.

## Filtros

Filtros devem vir do contrato.

Não inventar filtro local quando o filtro pertence à leitura GraphQL.

Separar corretamente filtros de consulta, filtros de visualização e `whereFixo`.

`whereFixo` representa escopo estrutural da consulta. Não tratar `whereFixo` como filtro visual de tela.

Não criar filtro local para compensar ausência no contrato.

## Parâmetros de consulta

Quando montar parâmetros para `useNoraGraphQLListagem`, preservar o padrão do hook.

Não descartar `where`, `limit` ou `offset` sem motivo explícito. Não quebrar paginação existente. Não alterar ordenação existente sem motivo.

## Total de registros

Quando houver paginação/listagem, manter total de registros coerente.

Se o hook usa `montaParametrosTotalDeRegistros`, preservar a relação com o mesmo `where` da listagem.

Não criar total local divergente.

## DX como critério de aceite

A integração GraphQL frontend só está boa se o contrato permite inferir corretamente campos selecionados, tipo dos registros, filtros, parâmetros, resposta, total de registros, opções remotas, mensagens e estados da listagem.

Se o frontend precisa recriar DTO local, o contrato falhou.

Se o frontend precisa lembrar manualmente subcampos sem apoio do tipo, o contrato falhou.

Se o frontend consegue pedir campo inexistente sem erro de tipo, o contrato está fraco.

## Erros de contrato

Quando encontrar erro de contrato, reportar claramente:

```txt
Bloqueado: contrato GraphQL insuficiente.

Leitura:
- ...

Campo/filtro necessário:
- ...

Uso no frontend:
- ...

Correção esperada:
- ajustar leitura/codegen na Nora-Api
```

Não resolver com DTO local, `as`, tipo paralelo, campo hardcoded, query manual, `Record<string, ...>` ou gambiarra de runtime.

## Preservação de UX

Ao trocar REST/listagem antiga por GraphQL, preservar loading, mensagem de erro, lista vazia, lista vazia com filtro, paginação, ordenação, filtros, seleção, ações e layout visual.

Mudança de fonte de dados não autoriza redesign nem mudança funcional acidental.

## Bloqueios

É bloqueado:

- montar contrato GraphQL paralelo no frontend;
- criar DTO local de resposta GraphQL;
- usar campo não exposto pelo contrato;
- inventar filtro local de leitura;
- tratar `whereFixo` como filtro visual;
- quebrar paginação;
- quebrar total de registros;
- alterar mensagens de listagem sem motivo;
- usar `as any`;
- usar `as unknown`;
- editar `node_modules/types-nora-api`;
- corrigir contrato GraphQL ruim no frontend.
