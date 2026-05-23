# universodomedo.com — instruções para agentes

## 1. Papel do frontend no Universo do Medo

O frontend `universodomedo.com` é a camada de renderização e experiência do Universo do Medo.

Ele renderiza telas, organiza fluxos visuais, orquestra estados de interface, consome contratos da Nora-Api, consome APIs REST/GraphQL/WebSocket, renderiza páginas oficiais, aplica interações de usuário, preserva UX/comportamento visual e integra componentes, contextos, hooks e SPAs.

O frontend não é fonte da verdade de domínio.

A Nora-Api é a fonte da verdade absoluta para contratos, regras persistentes, estruturas oficiais, páginas, menus, acessos, REST, GraphQL, WebSocket, validações públicas, dados compartilhados, tipos públicos e utilitários compartilháveis.

No Universo do Medo, praticamente toda estrutura pública consumida pelo frontend nasce na Nora-Api ou é derivada dela. Isso inclui páginas existentes, rotas oficiais, menu principal, menus internos, menus contextuais por página, acessos, capacidades, eventos WebSocket, operações GraphQL, contratos REST, DTOs, enums, constantes de domínio, payloads, responses, types compartilhados e helpers/utils compartilháveis como `pluralize`, `formataData` e equivalentes quando pertencem à regra comum da plataforma.

O frontend não deve recriar manualmente DTOs, enums, contratos REST, contratos GraphQL, contratos WebSocket, estruturas de páginas, estruturas de menus, regras de acesso, regras de domínio, validações públicas, payloads/responses que pertencem à Nora-Api ou helpers compartilháveis que já pertencem ao contrato/utilitário comum da plataforma.

Quando uma estrutura precisa ser consistente entre backend e frontend, ela deve vir da Nora-Api via `types-nora-api` ou outro contrato oficial.

Se o contrato recebido estiver incompleto, errado ou ruim de consumir, a correção deve acontecer na Nora-Api ou no codegen, não por duplicação local no frontend.

O frontend pode decidir composição visual, experiência, layout, renderização e interação, mas não pode inventar regra persistente, contrato público ou estrutura oficial da plataforma.

O frontend é dono da experiência de uso, mas não é dono da verdade estrutural da plataforma.

## 2. Regras globais de alteração no frontend

Alterações no `universodomedo.com` devem preservar comportamento existente, experiência de uso, contratos consumidos da Nora-Api e separação entre lógica de tela e renderização.

Regras obrigatórias:

- Não fazer refactor amplo sem autorização explícita.
- Não remover código fora do escopo da tarefa.
- Não remover comentários existentes.
- Não remover logs existentes sem autorização explícita.
- Não editar arquivos gerados ou instalados manualmente.
- Não alterar `node_modules/types-nora-api` diretamente.
- Não recriar contrato da Nora-Api no frontend.
- Não corrigir contrato ruim com DTO local, enum local, payload local ou tipo paralelo.
- Não introduzir solução que dependa de memória humana manual para funcionar.
- Antes de alterar arquivo crítico, ler o arquivo atual e entender os consumidores diretos.
- Se faltar contexto para alterar com segurança, pedir exatamente os arquivos atuais necessários.
- Alterações devem ser pequenas, rastreáveis e validadas.

### Responsabilidade dos arquivos

O frontend deve manter separação clara de responsabilidade:

- rota Next define entrada física da rota;
- `componentes.tsx` conecta rota com `ControladorSlot`;
- `Conteiner` controla fluxo;
- contexto controla estado, dados, ações e lógica;
- contexto de subfluxo controla lógica específica da SPA;
- SPA/componente renderiza;
- CSS module/SASS cuida apenas do escopo visual correspondente.

Não concentrar fluxo, API, estado, montagem de payload e renderização no mesmo componente.

### Componentes de renderização

Componentes com muitas funções locais de renderização são sinal forte de responsabilidade excessiva.

Regra obrigatória:

- não criar componente com dezenas de renderizadores locais;
- não manter renderizadores independentes no mesmo arquivo apenas por conveniência;
- separar renderizações por responsabilidade, reutilização e testabilidade;
- manter renderizadores locais apenas quando forem pequenos, específicos e claramente subordinados ao componente principal;
- não transformar SPA em arquivo monolítico que contém fluxo, contexto, renderizadores e estilos de múltiplas partes da tela.

### Componentes finais e uso de contexto

Componentes finais de renderização devem receber dados por props sempre que possível.

Especialmente no fim de uma cadeia de componentes aninhados, o componente folha deve ser atômico, testável e previsível.

Regra obrigatória:

- contexto deve ser consumido por camada de contexto, SPA ou componente agregador;
- componente final/folha deve receber os dados necessários por props;
- não espalhar `useContexto__...` por vários componentes pequenos de renderização;
- não fazer componente visual depender diretamente de contexto global quando ele poderia receber props;
- não usar contexto como atalho para evitar passar props em componente de renderização final.

### CSS, CSS Modules e SASS

CSS deve ser dividido por responsabilidade visual.

É bloqueado criar um CSS module único sendo referenciado por dezenas de arquivos ou componentes sem responsabilidade clara.

Regra obrigatória:

- CSS grande é indício de responsabilidade excessiva;
- CSS de uma tela não deve cuidar de múltiplas telas independentes;
- CSS de uma SPA não deve estilizar vários componentes reutilizáveis sem separação;
- se um componente visual tem responsabilidade própria, ele deve ter estilo próprio ou estilo claramente localizado;
- não criar arquivo de estilo gigante para centralizar visual de uma página inteira quando há subcomponentes independentes;
- quebrar CSS por responsabilidade e reutilização;
- evitar classes genéricas demais que viram contrato invisível entre componentes;
- não usar `px`; preferir `%` ou `em`.

SASS aninhado deve melhorar legibilidade, não esconder acoplamento.

Não usar aninhamento profundo para mascarar CSS grande demais.

### Criação e divisão de arquivos

Não criar arquivo novo apenas para parecer organizado.

Arquivo novo precisa ter responsabilidade real, nome claro e motivo arquitetural. Porém, isso não significa concentrar responsabilidades em arquivos grandes.

O frontend deve favorecer arquivos pequenos, coesos e testáveis.

Regra prática:

- arquivo acima de 100 linhas é yellow flag;
- arquivo acima de 300 linhas exige justificativa forte;
- arquivo grande normalmente indica excesso de responsabilidade;
- CSS grande normalmente indica que um único arquivo está estilizando componentes demais;
- lógica de contexto, renderização, fluxo, formulário, hook, util e estilo devem ser separados quando tiverem responsabilidades diferentes;
- não criar arquivo “facade” que apenas reexporta ou repassa chamada sem agregar responsabilidade real;
- não manter lógica em arquivo grande só para evitar criar arquivo novo.

A decisão correta é sempre por coesão de responsabilidade, testabilidade, atomicidade e clareza, não por reduzir artificialmente a quantidade de arquivos.

## 3. Consumo obrigatório de `types-nora-api`

O frontend deve consumir contratos da Nora-Api via `types-nora-api`.

O `types-nora-api` é o canal oficial para estruturas públicas compartilhadas entre backend e frontend.

Regra obrigatória:

- não recriar DTO local;
- não recriar enum local;
- não recriar constante de domínio local;
- não recriar contrato REST local;
- não recriar contrato GraphQL local;
- não recriar contrato WebSocket local;
- não recriar payload/response local;
- não recriar estrutura de página/menu/acesso local;
- não recriar helper/util compartilhável local quando ele já pertence ao contrato comum;
- não editar `node_modules/types-nora-api`;
- não copiar tipo de `types-nora-api` para arquivo local “só para facilitar”.

Se o contrato estiver errado, incompleto ou ruim de consumir, a correção deve acontecer na Nora-Api ou no codegen.

Sempre procurar primeiro se a estrutura já existe em `types-nora-api`, incluindo `PAGINAS`, menus, acessos, capacidades, DTOs, tipos de domínio, eventos WebSocket, contratos GraphQL, contratos REST, helpers/utils compartilháveis e constantes usadas por backend e frontend.

Se o frontend precisar de uma estrutura que deveria vir do backend, não inventar localmente. Reportar bloqueio com estrutura necessária, uso no frontend e fonte provável na Nora-Api.

## 4. Skills obrigatórias por tipo de tarefa

O `AGENTS.md` contém regras sempre ativas. Contextos específicos devem ser carregados por skills em `.codex/skills`.

Antes de alterar arquivos, identificar se a tarefa envolve alguma das áreas abaixo e usar a skill correspondente.

### `consumo-types-nora-api`

Usar quando a tarefa envolver `types-nora-api`, DTOs, enums, constantes compartilhadas, helpers compartilháveis, contracts REST/GraphQL/WebSocket, páginas/menus/acessos vindos da Nora-Api ou qualquer dúvida sobre recriar ou consumir contrato.

### `paginas-udm-frontend`

Usar quando a tarefa envolver criação de página, rota Next, `page.tsx`, `componentes.tsx`, `ControladorSlot`, `PAGINAS`, menus, layout contextualizado, conteiner, contexto de controle de fluxo ou SPA de renderização.

### `graphql-frontend-udm`

Usar quando a tarefa envolver `useNoraGraphQLListagem`, `GraphqlTypes<Entidade>`, `GraphqlLeituras`, `EventosApiGraphql`, `EventosApiGraphqlV2`, select GraphQL tipado, filtros de consulta, filtros de visualização, `whereFixo`, paginação GraphQL, total de registros ou opções remotas de filtro.

### `websocket-frontend-udm`

Usar quando a tarefa envolver hook WebSocket, eventos WebSocket, `Eventos_Envia`, `Eventos_Emite`, `Eventos_EnviaERecebe`, sala de jogo, chat, voz, eventos em tempo real, `WsResult`, erro WebSocket ou emissão/escuta de eventos.

### `conteiner-contexto-spa-udm`

Usar quando a tarefa envolver `Conteiner`, `resolveSaida`, contexto geral de página, contexto de subfluxo, SPA, separação entre lógica e renderização, fluxo de listagem/criação/edição/detalhe ou passagem de props para componentes finais.

### `estilos-css-udm`

Usar quando a tarefa envolver CSS, CSS Modules, SASS/SCSS, organização de estilos, componente visual reutilizável, quebra de arquivo de estilo, remoção de CSS grande, responsividade ou unidades CSS.

## 5. Preservação de UX e comportamento existente

Alterações no frontend devem preservar o comportamento existente, salvo quando a tarefa pedir explicitamente mudança de comportamento.

Não “melhorar” UX, fluxo, layout, textos, estados, loading, filtros, paginação, seleção, navegação ou interações por iniciativa própria.

Antes de alterar comportamento de uma tela, entender estado inicial, fluxo de carregamento, mensagens de loading/erro/lista vazia, filtros, paginação, ações disponíveis, navegação, layout contextualizado, menu lateral, redirecionamentos, permissões/acessos, comportamento em erro e comportamento sem dados.

Regra obrigatória:

- não alterar texto exibido ao usuário sem motivo;
- não alterar loading sem motivo;
- não alterar mensagem de erro sem motivo;
- não alterar mensagem de lista vazia sem motivo;
- não alterar ordem de registros sem motivo;
- não alterar paginação/carregar mais sem motivo;
- não alterar filtros sem motivo;
- não alterar seleção/deseleção sem motivo;
- não alterar menu/contexto/layout sem motivo;
- não alterar fluxo de criação/edição/detalhe sem motivo;
- não trocar componente estrutural por outro sem entender impacto.

Se a alteração necessária mudar comportamento, reportar mudança, motivo e impacto esperado.

Não fazer redesign acidental. Não transformar correção técnica em mudança visual ampla.

## 6. Estilo geral de código frontend

O frontend deve seguir o padrão de código do Universo do Medo.

Regras obrigatórias:

- TypeScript estrito.
- Não usar `any`.
- Não usar `unknown`.
- Usar indentação de 4 espaços.
- Manter ponto e vírgula.
- Imports em uma única linha.
- Exports em uma única linha.
- Não quebrar chamadas simples em múltiplas linhas.
- Não quebrar parâmetros de função em múltiplas linhas sem necessidade real.
- Funções simples podem ser one-liners quando isso aumentar clareza.
- Não remover comentários existentes.
- Não remover logs existentes sem autorização explícita.
- Não remover código fora do escopo.
- Não criar arquivo novo sem responsabilidade real.
- Não deixar linha em branco extra ao final do arquivo.
- Preferir comandos compatíveis com Windows/PowerShell.

Cada arquivo deve ter responsabilidade clara.

No padrão de páginas do UdM:

- `page.tsx` é mínimo;
- `componentes.tsx` é ponte entre rota Next e estrutura UdM;
- `Conteiner` controla fluxo SPA;
- Contexto geral controla dados e estado de fluxo;
- Contexto de SPA controla lógica do subfluxo;
- SPA/componente visual renderiza.

A nomenclatura com `__` é intencional e não deve ser simplificada.

Detalhes completos ficam na skill de páginas/conteiner, baseada em `padrao_pagina_comum_udm.md`.

## 7. Workflow e validações

O frontend `universodomedo.com` normalmente é validado dentro do workflow integrado do Universo do Medo.

Quando a alteração envolver contrato compartilhado, `types-nora-api`, GraphQL, WebSocket, páginas, menus, acessos ou integração backend/frontend, seguir o workflow oficial da Nora-Api descrito no README da Nora.

O fluxo integrado padrão é executado dentro do backend `Nora-Api` com:

```bash
npm run udm
```

Para desenvolvimento local integrado, usar a opção:

```txt
1
```

Esse fluxo é executado no terminal da Nora-Api e já inicializa o frontend também.

O mesmo workflow prepara `types-nora-api`, copia o pacote para o frontend, valida resolução do pacote, sobe watcher de types, backend e frontend, executando os requisitos e procedimentos necessários para desenvolvimento integrado.

Não é necessário abrir um terminal separado do frontend quando o objetivo é validar o fluxo integrado.

Comandos isolados do frontend só devem ser usados quando a tarefa for exclusivamente frontend, o usuário pedir explicitamente, for necessário diagnosticar problema local do frontend, ou o workflow integrado falhar e for necessário isolar a causa.

Não usar comando isolado do frontend para mascarar problema de contrato vindo da Nora-Api.

Se não conseguir validar, reportar claramente validação não executada, motivo e risco.

Não declarar tarefa como plenamente validada quando a validação necessária não foi executada.

## 8. Relatório final e regra de commit

Ao finalizar qualquer tarefa relevante no frontend, reportar com clareza o que foi alterado, o que foi validado, o que não foi validado e quais riscos permanecem.

O relatório final deve seguir este formato:

```txt
Resumo:
- ...

Arquivos alterados:
- ...

Contratos consumidos:
- ...

Validações executadas:
- ...

Validações não executadas:
- ...

Riscos/Pendências:
- ...

Impacto na Nora-Api:
- ...

Commit recomendado:
- backend / frontend / ambos / nenhum
```

Se uma seção não se aplicar, escrever:

```txt
- não se aplica
```

Não omitir validação não executada. Não declarar uma tarefa como plenamente validada quando o workflow necessário não foi executado.

Quando a alteração consumir ou depender de contrato da Nora-Api, reportar quais contratos foram usados.

Quando a alteração revelar contrato ausente, fraco, errado ou ruim de consumir, reportar impacto na Nora-Api.

Mensagens de commit devem seguir o padrão operacional do Universo do Medo:

- português;
- sem Conventional Commits;
- título em uma linha;
- linha em branco entre título e corpo;
- corpo opcional em bullets;
- sem linha em branco entre bullets;
- não sugerir commit por arquivo;
- sugerir commit por estado relevante de evolução.

Não usar commits do tipo `feat:`, `fix:`, `refactor:` ou `chore:`.

Não criar um commit por arquivo alterado. O commit deve representar o estado real da evolução, não a lista mecânica de arquivos.
