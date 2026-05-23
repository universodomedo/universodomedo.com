---
name: websocket-frontend-udm
description: Use quando a tarefa envolver WebSocket no frontend do Universo do Medo, hook WebSocket, eventos em tempo real, sala de jogo, chat, voz, Eventos_Envia, Eventos_Emite, Eventos_EnviaERecebe, WsResult, erro WS, payload/response de eventos ou integração com contratos WebSocket vindos da Nora-Api.
---

# Skill — WebSocket no frontend UDM

Esta skill define como o frontend `universodomedo.com` deve consumir WebSocket da Nora-Api.

## Regra central

WebSocket no frontend é consumo de contrato gerado pela Nora-Api.

O frontend não cria evento WebSocket oficial.

O frontend não inventa nome de evento.

O frontend não recria payload, response ou protocolo de erro.

Eventos WebSocket são contratos públicos server-driven e devem ser consumidos via `types-nora-api`.

## Fonte da verdade

A Nora-Api define gateways WebSocket, eventos, nomes completos, payloads, responses, tipo do evento, autenticação por evento, protocolo de erro, tipos compartilhados e emissão/escuta disponível para o frontend.

O frontend consome esses contratos.

## Famílias de eventos e hooks específicos

Os eventos WebSocket consumidos pelo frontend nascem na Nora-Api e chegam ao frontend via `types-nora-api`.

As famílias principais são:

```ts
export const Eventos_Envia = criarEventosFiltrados('envia');
export const Eventos_Emite = criarEventosFiltrados('emite');
export const Eventos_EnviaERecebe = criarEventosFiltrados('envia-e-recebe');
```

Cada família atende um caso diferente e deve usar o hook específico correspondente no frontend.

### `Eventos_Envia`

Use para eventos do tipo `envia`.

Caso de uso:

```txt
frontend envia ação para backend
backend executa efeito
não há resposta direta obrigatória
```

Não usar hook de `envia-e-recebe` quando o evento é apenas `envia`.

### `Eventos_Emite`

Use para eventos do tipo `emite`.

Caso de uso:

```txt
backend emite atualização
frontend escuta e reage
```

Não tratar evento `emite` como chamada ativa do frontend.

Não inventar listener por string quando existe contrato em `Eventos_Emite`.

### `Eventos_EnviaERecebe`

Use para eventos do tipo `envia-e-recebe`.

Caso de uso:

```txt
frontend envia solicitação
backend responde diretamente
frontend trata sucesso ou WsErrorResponse
```

Não usar evento `envia-e-recebe` ignorando resposta.

Não assumir sucesso sem verificar erro WebSocket quando o contrato permitir `WsResult`.

## Contratos esperados

Quando trabalhar com WebSocket no frontend, procurar primeiro em `types-nora-api` estruturas como:

```txt
Eventos_Envia
Eventos_Emite
Eventos_EnviaERecebe
EventosWebSocket
WsResult
WsErrorResponse
isWsErrorResponse
```

Não criar tipo local equivalente. Não copiar payload/response para arquivo local. Não montar evento por string manual.

## Regra obrigatória

Antes de usar WebSocket no frontend:

- identificar se o evento é `envia`, `emite` ou `envia-e-recebe`;
- usar a família correta de contrato;
- usar o hook específico desse tipo;
- respeitar payload, response e erro definidos pela Nora-Api;
- não misturar famílias de evento;
- não criar wrapper local para esconder o tipo real do evento.

Se não estiver claro qual hook usar para uma família de evento, interromper e reportar a dúvida em vez de improvisar.

## Hook WebSocket

O hook WebSocket do projeto deve ser o caminho padrão para consumir eventos.

Não abrir conexão Socket.IO manual dentro de componente.

Não criar `io(...)` diretamente em tela, SPA ou componente visual quando já existe hook/infraestrutura oficial.

Não registrar listener manual espalhado em componente final.

O hook deve centralizar envio de evento, envio com resposta, escuta de evento emitido, tipagem de payload, tipagem de response, tratamento de erro WS, lifecycle de listener, cleanup ao desmontar e integração com contrato.

## Protocolo de erro

Respostas WebSocket podem retornar erro no protocolo oficial.

Usar:

```txt
WsResult
WsErrorResponse
isWsErrorResponse
```

Não criar shape local de erro. Não tratar erro WS como string solta. Não ignorar erro retornado por evento `envia-e-recebe`. Não esconder erro de socket silenciosamente quando ele afeta UX ou estado da tela.

## Eventos de jogo e tempo real

Eventos ligados a jogo, sala de jogo, ficha em jogo, chat, voz, execução de ação, perícia ou estado do usuário exigem cuidado maior.

Ao consumir eventos de tempo real:

- preservar estado visual existente;
- evitar atualização duplicada;
- evitar listener duplicado;
- limpar listener no ciclo correto;
- não emitir evento sem contrato;
- não escutar evento por string;
- não atualizar estado de tela com payload não validado pelo contrato;
- não misturar lógica de WebSocket em componente final de renderização.

## Separação de responsabilidade

Contexto/hook deve controlar lógica de WebSocket.

Componente visual deve renderizar.

Regra obrigatória:

- hook WebSocket encapsula conexão/eventos;
- contexto usa hook para coordenar estado da tela;
- SPA consome contexto e renderiza;
- componente final recebe dados por props;
- componente final não registra listener WS diretamente.

## Estado local e sincronização

Quando evento WebSocket atualizar estado local, manter fonte clara do estado, evitar múltiplos lugares atualizando o mesmo dado, preferir contexto como dono do estado da tela, manter atualização previsível, não sobrescrever estado vindo de GraphQL sem regra clara e não criar polling/local refresh para compensar evento ruim.

Se o evento não carrega dados suficientes, reportar necessidade de ajuste no contrato backend.

## Autenticação e guest

Alguns eventos podem permitir guest.

Não assumir `usuario` autenticado em evento guest.

Não forçar tipo de usuário autenticado quando o contrato permite guest.

Quando o fluxo depende de usuário autenticado, respeitar contrato e comportamento do backend.

## WebRTC/voz

Fluxos de voz/WebRTC podem usar WebSocket como sinalização.

Nesses casos, WebSocket não transporta áudio diretamente; ele coordena troca de informações como offer, answer, ICE candidate e entrada/saída de sala.

Regra obrigatória:

- não misturar mídia WebRTC com contrato WS;
- não criar evento de sinalização sem contrato;
- não duplicar tipos de offer/answer/candidate;
- não deixar listener de sinalização sem cleanup.

## Preservação de UX

Ao alterar consumo WebSocket, preservar loading, estado inicial, mensagens de erro, feedback visual, estado conectado/desconectado, comportamento ao reconectar, estados de sala, estados de jogo, ordenação/listagem existente e renderização existente.

Não transformar ajuste WebSocket em redesign.

## Quando o contrato estiver ruim

Se o evento não existe, payload está incompleto ou response não atende a tela, não corrigir com gambiarra local.

Reportar:

```txt
Bloqueado: contrato WebSocket insuficiente.

Evento:
- ...

Payload/response necessário:
- ...

Uso no frontend:
- ...

Correção esperada:
- ajustar contrato WebSocket na Nora-Api
```

## Bloqueios

É bloqueado:

- criar evento WebSocket por string hardcoded;
- duplicar payload/response local;
- criar tipo local equivalente ao contrato;
- abrir `io(...)` diretamente em componente;
- registrar listener WS em componente final de renderização;
- deixar listener sem cleanup;
- ignorar `WsErrorResponse`;
- criar shape local de erro;
- emitir evento sem contrato;
- consumir evento inexistente em `types-nora-api`;
- corrigir contrato ruim com adaptação local permanente;
- misturar lógica de WebSocket, estado e renderização no mesmo componente final;
- atualizar estado de jogo/sala sem entender origem e consequência.
