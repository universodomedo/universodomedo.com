---
name: consumo-types-nora-api
description: Use quando a tarefa envolver types-nora-api, contratos vindos da Nora-Api, DTOs, enums, constantes compartilhadas, helpers compartilháveis, PAGINAS, MENUS, acessos, GraphQL, REST, WebSocket ou qualquer estrutura pública consumida pelo frontend do Universo do Medo.
---

# Skill — Consumo de types-nora-api no frontend UDM

Esta skill define como o frontend `universodomedo.com` deve consumir contratos da Nora-Api.

## Regra central

O frontend consome contratos.

O frontend não recria contratos.

A Nora-Api é a fonte da verdade absoluta para estruturas públicas compartilhadas.

O `types-nora-api` é o canal oficial de distribuição dessas estruturas para o frontend.

## O que deve vir de `types-nora-api`

Sempre procurar primeiro em `types-nora-api` quando precisar de DTO, enum, constante de domínio, helper compartilhável, util compartilhável, contrato REST, contrato GraphQL, contrato WebSocket, payload, response, página, menu, acesso, capacidade, tipo público ou estrutura compartilhada entre frontend e backend.

Isso inclui estruturas como:

```txt
PAGINAS
MENUS
Eventos WebSocket
GraphqlTypes
GraphqlLeituras
EventosApiGraphql
EventosApiGraphqlV2
helpers como pluralize/formataData quando pertencem à regra comum
```

## Proibições

É bloqueado:

- criar DTO local equivalente a contrato da Nora-Api;
- criar enum local equivalente a enum da Nora-Api;
- criar constante local equivalente a constante compartilhada;
- criar helper local equivalente a helper compartilhável;
- criar payload/response manual para REST, GraphQL ou WebSocket;
- copiar tipo do `types-nora-api` para arquivo local;
- editar `node_modules/types-nora-api`;
- criar contrato paralelo “mais fácil” no frontend;
- usar string hardcoded quando existe constante compartilhada;
- usar nome de evento WebSocket hardcoded quando existe contrato;
- criar rota/menu/acesso local quando existe contrato oficial.

## Quando o contrato estiver ruim

Se o contrato estiver incompleto, errado, difícil de consumir ou fraco em tipagem, não corrigir com gambiarra local.

Reportar bloqueio:

```txt
Bloqueado: contrato deveria vir da Nora-Api/types-nora-api.

Estrutura necessária:
- ...

Uso no frontend:
- ...

Fonte provável na Nora-Api:
- ...

Impacto:
- ...
```

Correção esperada:

```txt
Nora-Api/codegen/types-nora-api
→ frontend consome contrato corrigido
```

Não criar fallback local sem autorização explícita.

## GraphQL

Para GraphQL, consumir os contratos gerados. Não montar query manual quando existe contrato tipado. Não criar tipo local para resultado de query. Se o hook GraphQL não inferir corretamente select, filtros, where ou resposta, o contrato/codegen precisa ser corrigido.

## WebSocket

Para WebSocket, consumir eventos e tipos vindos do contrato gerado. Não criar string de evento manual. Não recriar payload/response. Não ignorar protocolo de erro WebSocket. Se um evento não existe no contrato, ele não deve ser usado pelo frontend como evento oficial.

## Páginas e menus

Para páginas e menus, consumir `PAGINAS` e estruturas oficiais vindas da Nora-Api. Não criar rota oficial, menu, acesso ou capacidade apenas no frontend. Frontend renderiza a estrutura oficial.

## Helpers e utils

Helpers compartilháveis que representam regra comum devem vir da Nora-Api quando já existirem no contrato. Exemplos: `pluralize`, `formataData`.

Não recriar helper local equivalente só por conveniência.

Helper local só é aceitável quando for claramente específico da UI local e não representar regra compartilhada da plataforma.

## Checklist

Antes de criar tipo/helper/constante local, perguntar:

```txt
Isso precisa ser consistente com a Nora-Api?
Já existe em types-nora-api?
É regra de domínio/plataforma?
É contrato público?
O frontend e o backend precisam concordar sobre isso?
```

Se a resposta for sim, não criar localmente.
