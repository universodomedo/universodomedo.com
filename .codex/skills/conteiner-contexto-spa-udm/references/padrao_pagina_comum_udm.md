# Padrão de criação de páginas no Universo do Medo

Este documento define o padrão oficial para criação, organização e implementação de páginas no Universo do Medo.

O objetivo não é apenas “fazer a página funcionar”. O objetivo é manter a arquitetura previsível, rastreável e legível, com responsabilidade clara em cada arquivo.

Uma página no UdM nasce no backend, é exposta como contrato tipado para o frontend, entra na navegação oficial pelo menu, e só depois é renderizada pelo Next. O frontend não inventa página, rota, acesso ou menu; ele renderiza a estrutura decidida pelo backend.

---

## Visão geral do fluxo

O fluxo completo padrão é:

```txt
1. Backend: declarar página em PAGINAS
2. Backend: declarar navegação/menu da página em MENUS
3. Frontend: criar page.tsx da rota Next
4. Frontend: criar componentes.tsx com ControladorSlot
5. Frontend: criar Conteiner da página
6. Frontend: criar Contexto de Controle de Fluxo
7+ Frontend: criar Contexto com SPA para cada estado
```

A cadeia conceitual é:

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

---

# 1. Definição da página no backend

Arquivo:

```txt
src\modules\paginas\paginas.const.ts
```

## Responsabilidade

Esse arquivo é o **SSOT estrutural de páginas do UdM**.

Toda página navegável da aplicação tem que nascer aqui. Uma página que não existe em `PAGINAS` não existe oficialmente para o sistema. O backend não consegue mapear corretamente onde o usuário está, o frontend não deve consumi-la como contrato, e a navegação não deve depender dela.

Regra absoluta:

```txt
Nenhuma página nasce primeiro no frontend.
Toda página navegável nasce primeiro em PAGINAS, no backend.
```

O frontend apenas consome o contrato gerado a partir dessa árvore.

## O que este arquivo define

`PAGINAS` define:

- a existência oficial da página;
- o caminho estrutural da página;
- o identificador tipado da página;
- o label da página;
- acesso/autorização;
- layout contextualizado inicial;
- título base da página;
- proporção de conteúdo;
- agrupamento hierárquico de páginas.

## Funções usadas

Para caso geral, use:

```ts
paginaComLayoutContextualizado(...)
```

Exceções com `pagina(...)` só devem ser usadas quando forem explicitamente apontadas.

## Exemplo

```ts
insignias: {
    uploadRecursosInsignias: paginaComLayoutContextualizado('/minhas-paginas/artista/insignias', { label: 'Upload de Insígnias', acesso: { listaDeCapacidadesNecessarias: [CAPACIDADES.ARTISTA__CRIACAO__RESPONSABILIDADES__INSIGNIAS] } }, { titulo: 'Upload de Insígnias', proporcaoConteudo: 84 }),
},
```

## Regra de capacidades

Capacidades sempre devem vir de `CAPACIDADES`.

String manual é proibida.

Correto:

```ts
CAPACIDADES.ARTISTA__CRIACAO__RESPONSABILIDADES__INSIGNIAS
```

Errado:

```ts
'ARTISTA__CRIACAO__RESPONSABILIDADES__INSIGNIAS'
```

## Página que também é grupo

A árvore `PAGINAS` permite que um nó seja ao mesmo tempo:

- uma página acessável;
- um agrupador de páginas filhas.

Exemplo:

```ts
minhasPaginas: {
    ...paginaComLayoutContextualizado('/minhas-paginas', ...),
    artista: {
        ...paginaComLayoutContextualizado('/minhas-paginas/artista', ...),
        insignias: {
            uploadRecursosInsignias: paginaComLayoutContextualizado(...),
        },
    },
},
```

Nesse exemplo, `/minhas-paginas` é uma página em si e também a raiz estrutural de `/minhas-paginas/*`.

## `template`, `hrefTemplate` e `href`

Pelo padrão atual:

- `template` é o identificador tipado/branded da página, usado como chave estável pelo sistema.
- `hrefTemplate` é a rota declarada, incluindo placeholders de parâmetro quando existem.
- `href` nasce igual ao `hrefTemplate`, representando a rota base conhecida da página.

Exemplo:

```ts
paginaComLayoutContextualizado('/minhas-paginas/admin/sessao/[id]', ...)
```

Gera uma definição com:

```txt
template = identificador tipado da página
hrefTemplate = /minhas-paginas/admin/sessao/[id]
href = /minhas-paginas/admin/sessao/[id]
```

Para rotas parametrizadas, os tipos auxiliares extraem os parâmetros diretamente do template.

## Tipagem de parâmetros

`paginas.type.ts` contém tipos como:

```ts
PaginaParamsDoTemplate
ParamsProps
montarHref
toParamsRecord
```

Esses tipos e helpers existem para que rotas como:

```txt
/minhas-paginas/admin/sessao/[id]
/definicoes/[[...slug]]
```

sejam usadas de forma tipada.

## Contrato gerado

A árvore `PAGINAS` é levada para o frontend via `types-nora-api`.

Isso permite consumir no frontend:

```ts
PAGINAS.minhasPaginas.artista.insignias.uploadRecursosInsignias
```

com tipagem, autocomplete e vínculo direto com o backend.

---

# 2. Definição de menus no backend

Arquivo:

```txt
src\modules\menus\menus.const.ts
```

## Responsabilidade

Esse arquivo é o **SSOT de navegação do UdM**.

Ele é auxiliar à estrutura de `PAGINAS`, mas não é apenas uma lista visual. Ele define, no backend:

- menu principal;
- menus internos;
- menus contextuais por página;
- quais páginas são navegáveis para usuário comum;
- quais itens aparecem conforme acesso/capacidade;
- quando uma página tem menu, menu vazio ou menu dinâmico.

Regra central:

```txt
PAGINAS define existência.
MENUS define navegação.
```

O frontend não decide a estrutura de navegação. Ele apenas renderiza aquilo que o backend define.

## `MENU_PRINCIPAL`

Define os itens principais da aplicação.

Exemplo:

```ts
menuItem('Minhas Páginas', { pagina: PAGINAS.minhasPaginas })
```

## `MENUS_INTERNOS`

Define a navegação completa de áreas internas.

Exemplo:

```ts
artista: [
    menuItem('Minhas Imagens', { pagina: PAGINAS.minhasPaginas.artista.minhasImagens }),
    menuItem('Adicionar Nova Imagem', { pagina: PAGINAS.minhasPaginas.artista.adicionarImagem }),
    menuGrupo('Insígnias', [
        menuItem('Upload de Insígnias', { pagina: PAGINAS.minhasPaginas.artista.insignias.uploadRecursosInsignias }),
    ]),
],
```

## `MENUS_INTERNOS_LAYOUTCONTEXTO`

Define qual menu contextual cada página com layout contextualizado deve exibir.

Exemplo:

```ts
insignias: {
    uploadRecursosInsignias: MENUS_INTERNOS.PAGINAS.minhasPaginas.artista,
},
```

Isso significa que, quando o usuário estiver em `uploadRecursosInsignias`, o layout contextualizado deve exibir o menu de artista.

## Página sem menu

Páginas com:

```ts
menuVazio()
```

não exibem o menu lateral contextual.

Normalmente são páginas cujo fluxo de navegação é manual, com botões como “Voltar”, “Sair” ou ações internas.

Atenção: dificilmente uma página deve ser apontada em algum menu navegável se ela mesma usa `menuVazio()`, porque isso pode criar ida sem volta pela navegação lateral.

## Menu dinâmico

Páginas com:

```ts
menuDinamico()
```

mantêm o conceito/área de menu, mas o conteúdo provavelmente será calculado dinamicamente, por exemplo com dados vindos do banco ou variações por usuário.

## Tipagem forte

`MenusInternos<typeof PAGINAS>` e `MenusInternosLayoutContexto<typeof PAGINAS>` garantem que o menu acompanhe a estrutura real de `PAGINAS`.

Isso impede:

- chaves inventadas;
- páginas inexistentes;
- menus fora da estrutura;
- ausência de mapeamento em páginas contextualizadas.

## Filtro por acesso

O backend também é responsável por regras de exposição de menu.

Se o usuário não tem capacidade para nenhum item de um menu, esse item/grupo não deve ser exposto.

Essa responsabilidade é de gerenciamento/backend, não de renderização/frontend.

---

# 3. Arquivo raiz da rota Next

Arquivo padrão:

```txt
src\app\(paginas)\...\page.tsx
```

Exemplo:

```txt
src\app\(paginas)\minhas-paginas\artista\insignias\page.tsx
```

## Responsabilidade

Esse arquivo só possui três responsabilidades:

1. definir a URL física da rota pelo padrão de pastas do Next;
2. manter o `default export` obrigatório do Next;
3. chamar o componente default client da mesma pasta.

Ele não deve conter:

- regra de negócio;
- consulta;
- contexto;
- layout;
- acesso;
- formulário;
- listagem;
- decisão de fluxo;
- renderização real da página.

## Padrão

```tsx
import PaginaArtistaInsignia_Client from "./componentes";

export default function PaginaArtistaInsignia() { return <PaginaArtistaInsignia_Client /> };
```

Esse arquivo é dispensável em processos de debug funcional porque ele não deve conter lógica.

## Slugs e params

Páginas com slug/parâmetro podem receber params do Next e repassar para `componentes.tsx`, quando o caso for explicitamente apontado.

---

# 4. Ponte entre Next e estrutura UdM

Arquivo padrão:

```txt
src\app\(paginas)\...\componentes.tsx
```

Exemplo:

```txt
src\app\(paginas)\minhas-paginas\artista\insignias\componentes.tsx
```

## Responsabilidade

Esse arquivo é a ponte obrigatória entre a rota Next e a estrutura do UdM.

Ele deve:

- definir o componente default chamado por `page.tsx`;
- importar `PAGINAS` de `types-nora-api`;
- chamar obrigatoriamente `<ControladorSlot>`;
- passar exatamente a página definida no backend;
- renderizar o conteiner/contexto raiz da funcionalidade;
- fazer apenas pequenas tratativas de params/slug quando necessário.

## Padrão

```tsx
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaArtistaInsignia } from 'Conteineres/PaginaArtistaInsignia/conteiner';

export default function PaginaArtistaInsignia_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.insignias.uploadRecursosInsignias}>
            <Conteiner__PaginaArtistaInsignia />
        </ControladorSlot>
    );
};
```

## `ControladorSlot`

`ControladorSlot` conecta o frontend com a definição do backend.

Ele é responsável por:

- receber `pagina: PaginaFolha`;
- chamar `checkAuth(pagina.template)`;
- decidir acesso com `decidirAcessoPagina`;
- redirecionar quando usuário não está autenticado;
- redirecionar quando usuário não tem capacidade;
- identificar se a página usa layout contextualizado;
- aplicar `layoutContextualizadoInicial` no Redux;
- resolver menu contextual via `obterMenuInternoLayoutContexto`;
- aplicar menu contextual via `setMenuLeaf`;
- renderizar `LayoutContextualizado` quando necessário;
- renderizar menu lateral quando existir;
- renderizar `Cabecalho` quando `comCabecalho` estiver ativo;
- suportar menu estático, `menuVazio()` e `menuDinamico()`.

## Sobre `'use client'`

`componentes.tsx` não precisa obrigatoriamente ter `'use client'`.

Use apenas quando o próprio arquivo precisar.

---

# 5. Conteiner da página

Arquivo padrão:

```txt
src\conteineres\PaginaX\conteiner.tsx
```

Exemplo:

```txt
src\conteineres\PaginaArtistaInsignia\conteiner.tsx
```

## Responsabilidade

`Conteiner` é uma nomenclatura própria do UdM para páginas com comportamento SPA.

O Conteiner é o **controlador de fluxo da página**.

Ele não é:

- página visual;
- contexto;
- componente de renderização final;
- lugar para UI.

Ele decide qual subfluxo deve ser renderizado de acordo com o estado atual da página.

## Estrutura obrigatória

Todo conteiner de SPA deve seguir esta estrutura:

```txt
1. function Conteiner__PaginaX
2. Conteiner__PaginaX__Interno
3. resolveSaida
4. useEstado
```

## Exemplo

```tsx
'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaArtistaInsignia__Props, Contexto__PaginaArtistaInsignia__Provider, useContexto__PaginaArtistaInsignia } from 'Contextos/Contexto__PaginaArtistaInsignia/contexto';
import { Contexto__PaginaArtistaInsignia__NovaInsignia__Provider } from 'Contextos/Contexto__PaginaArtistaInsignia__NovaInsignia/contexto';
import { Contexto__PaginaArtistaInsignia__Listagem__Provider } from 'Contextos/Contexto__PaginaArtistaInsignia__Listagem/contexto';

export function Conteiner__PaginaArtistaInsignia() {
    return (
        <Contexto__PaginaArtistaInsignia__Provider>
            <Conteiner__PaginaArtistaInsignia__Interno />
        </Contexto__PaginaArtistaInsignia__Provider>
    );
};

export const Conteiner__PaginaArtistaInsignia__Interno = criaConteiner<PropsConteiner__PaginaArtistaInsignia>({ useEstado, resolveSaida });

type PropsConteiner__PaginaArtistaInsignia = Contexto__PaginaArtistaInsignia__Props;

function resolveSaida(props: PropsConteiner__PaginaArtistaInsignia): SaidaConteiner {
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaArtistaInsignia__NovaInsignia__Provider, { });
    
    return criaSaidaConteiner(Contexto__PaginaArtistaInsignia__Listagem__Provider, { listagemInsignias: props.listagemInsignias, estaEmProcessoCriacao: props.estaEmProcessoCriacao, setEstaEmProcessoCriacao: props.setEstaEmProcessoCriacao });
};

function useEstado(): PropsConteiner__PaginaArtistaInsignia { return useContexto__PaginaArtistaInsignia(); };
```

## `Conteiner__PaginaX`

Responsabilidades:

- função pública importada por `componentes.tsx`;
- embrulha o conteúdo com o contexto geral da página;
- não decide fluxo diretamente.

## `Conteiner__PaginaX__Interno`

Responsabilidades:

- aplica `criaConteiner`;
- conecta `useEstado` e `resolveSaida`;
- transforma estado em saída renderizável.

## `resolveSaida`

Responsabilidades:

- controlar o fluxo da SPA;
- decidir branch atual da página;
- escolher entre listagem, criação, edição, detalhe, seleção etc.;
- retornar `SaidaConteiner`;
- usar `criaSaidaConteiner(Provider, props)`;
- não retornar JSX diretamente;
- não conter renderização visual.

## `useEstado`

Responsabilidades:

- ler o contexto geral da página;
- retornar as props usadas pelo fluxo;
- não decidir branch;
- não renderizar;
- não chamar API diretamente;
- não conter lógica visual.

## Nomenclatura

A nomenclatura com `__` é intencional.

Ela separa hierarquia e papel arquitetural:

```txt
Conteiner__PaginaArtistaInsignia
Contexto__PaginaArtistaInsignia
Contexto__PaginaArtistaInsignia__Listagem
Contexto__PaginaArtistaInsignia__NovaInsignia
SPA__PaginaArtistaInsignia__Listagem
SPA__PaginaArtistaInsignia__NovaInsignia
```

Esse padrão deixa claro:

- qual página está sendo tratada;
- qual subfluxo está ativo;
- se o arquivo é Conteiner, Contexto ou SPA;
- onde procurar regra de fluxo;
- onde procurar regra de subfluxo;
- onde procurar renderização.

---

# 6. Contexto de Controle de Fluxo

Arquivo padrão:

```txt
src\contextos\Contexto__PaginaX\contexto.tsx
```

Exemplo:

```txt
src\contextos\Contexto__PaginaArtistaInsignia\contexto.tsx
```

## Responsabilidade

Esse contexto embrulha todo o conteiner e fornece recursos/dados estruturais para os fluxos da página.

Ele é o **Contexto de Controle de Fluxo**.

Ele deve conter dados que podem ser usados por diferentes subfluxos da SPA e pelo `resolveSaida`.

## Estrutura obrigatória

```txt
1. interface que atende ao createContext
2. const de definição do createContext
3. hook exportável useContexto__
4. __Provider
5. execução GraphQL, se necessário
```

## Exemplo

```tsx
'use client';

import { createContext, useContext, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaArtistaInsignia__Props {
    listagemInsignias: ReturnType<typeof obtemListagemInsignias>;
    estaEmProcessoCriacao: boolean;
    setEstaEmProcessoCriacao: (v: boolean) => void;
};

const Contexto__PaginaArtistaInsignia = createContext<Contexto__PaginaArtistaInsignia__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia = (): Contexto__PaginaArtistaInsignia__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia precisa estar dentro de um Contexto__PaginaArtistaInsignia');
    return context;
};

export const Contexto__PaginaArtistaInsignia__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemInsignias = obtemListagemInsignias();
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);

    return (
        <Contexto__PaginaArtistaInsignia.Provider value={{ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            {children}
        </Contexto__PaginaArtistaInsignia.Provider>
    );
};

//

function obtemListagemInsignias() {
    return useNoraGraphQLListagem('ArquivoTipadoInsignia', {
        select: ['id', 'arquivo'],
        itensPorPagina: 12,
        carregando: 'Buscando Insígnias',
        mensagemErro: 'Houve um erro recuperando suas Insígnias',
        mensagemListaVazia: 'Nenhuma insígnia encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma insígnia encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
```

## O que pode ficar aqui

Pode ficar neste contexto:

- listagem principal da página;
- dados compartilhados por subfluxos;
- estado de criação ativa;
- estado de seleção;
- item selecionado derivado da listagem;
- funções de seleção/deseleção;
- flags usadas por `resolveSaida`.

## O que não deve ficar aqui

Não deve ficar aqui:

- dezenas de states de formulário;
- lógica específica de uma branch isolada;
- montagem de payload de criação/edição;
- chamada de endpoint de save de um subfluxo;
- renderização visual.

Formulários devem ir para contextos específicos de criação/edição, preferencialmente usando `useFormularioCreate`.

## `useNoraGraphQLListagem`

`useNoraGraphQLListagem` é o orquestrador padrão de listagens GraphQL no frontend.

Ele retorna uma estrutura compatível com `ListagemComposta`, incluindo:

- registros;
- carregando;
- erro;
- mensagem de lista vazia;
- filtros de consulta;
- filtros de visualização;
- carregar mais;
- contador;
- ações;
- rodapé.

Ele encapsula:

- paginação;
- total de registros;
- filtros remotos;
- filtros locais;
- acumulação de páginas;
- contador padrão;
- seleção de campos GraphQL;
- campos de filtro disponíveis de acordo com o `select`.

---

# 7. Contexto de SPA: listagem

Arquivo padrão:

```txt
src\contextos\Contexto__PaginaX__Listagem\contexto.tsx
```

Exemplo:

```txt
src\contextos\Contexto__PaginaArtistaInsignia__Listagem\contexto.tsx
```

## Responsabilidade

Esse é um **Contexto de SPA/Subfluxo**.

Ele é renderizado pelo `resolveSaida` quando a página está no fluxo de listagem.

Ele recebe dados vindos do Contexto de Controle de Fluxo e expõe apenas aquilo que a SPA de listagem precisa renderizar.

## Características

- recebe props vindas do contexto controlador de fluxo;
- usa tipos derivados do contexto pai;
- não renderiza `{children}`;
- renderiza diretamente a SPA correspondente;
- não refaz GraphQL;
- não decide fluxo principal;
- não contém UI.

## Exemplo

```tsx
'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaArtistaInsignia__Props } from '../Contexto__PaginaArtistaInsignia/contexto';
import SPA__PaginaArtistaInsignia__Listagem from 'Conteineres/PaginaArtistaInsignia/paginas/SPA__PaginaArtistaInsignia__Listagem/SPA__PaginaArtistaInsignia__Listagem';

interface Contexto__PaginaArtistaInsignia__Listagem__Props {
    listagemInsignias: Contexto__PaginaArtistaInsignia__Props['listagemInsignias'];
    estaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['estaEmProcessoCriacao'];
    setEstaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['setEstaEmProcessoCriacao'];
};

const Contexto__PaginaArtistaInsignia__Listagem = createContext<Contexto__PaginaArtistaInsignia__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia__Listagem = (): Contexto__PaginaArtistaInsignia__Listagem__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia__Listagem);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia__Listagem precisa estar dentro de um Contexto__PaginaArtistaInsignia__Listagem');
    return context;
};

export const Contexto__PaginaArtistaInsignia__Listagem__Provider = ({ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }: { listagemInsignias: Contexto__PaginaArtistaInsignia__Props['listagemInsignias']; estaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['estaEmProcessoCriacao']; setEstaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['setEstaEmProcessoCriacao']; }) => {
    return (
        <Contexto__PaginaArtistaInsignia__Listagem.Provider value={{ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            <SPA__PaginaArtistaInsignia__Listagem />
        </Contexto__PaginaArtistaInsignia__Listagem.Provider>
    );
};
```

---

# 8. SPA de renderização: listagem

Arquivo padrão:

```txt
src\conteineres\PaginaX\paginas\SPA__PaginaX__Listagem\SPA__PaginaX__Listagem.tsx
```

Exemplo:

```txt
src\conteineres\PaginaArtistaInsignia\paginas\SPA__PaginaArtistaInsignia__Listagem\SPA__PaginaArtistaInsignia__Listagem.tsx
```

## Responsabilidade

Esse arquivo é componente de renderização.

Ele deve consumir o contexto do subfluxo de listagem e renderizar a tela.

Ele não deve conter:

- `useState` de fluxo;
- chamada de API;
- chamada GraphQL;
- montagem de payload;
- decisão de branch da SPA.

## Padrão com `ListagemComposta`

Para listagens comuns, use `ListagemComposta`.

Exemplo:

```tsx
import { useContexto__PaginaArtistaInsignia__Listagem } from 'Contextos/Contexto__PaginaArtistaInsignia__Listagem/contexto';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

type RegistroInsignia = ReturnType<typeof useContexto__PaginaArtistaInsignia__Listagem>['listagemInsignias']['registros'][number];

export default function SPA__PaginaArtistaInsignia__Listagem() {
    const { listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao } = useContexto__PaginaArtistaInsignia__Listagem();

    return (
        <ListagemComposta
            listagem={listagemInsignias}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={insignia => insignia.id}
            renderizarItem={insignia => <RenderizaRegistroInsignia key={insignia.id} insignia={insignia} />}
            novoRegistro={{ estaEmProcessoCriacao, aoIniciarCriacao: () => setEstaEmProcessoCriacao(true), textoBotao: 'Novo' }}
        />
    );
};

function RenderizaRegistroInsignia({ insignia }: { insignia: RegistroInsignia }) {
    return (
        <></>
    );
};
```

`RenderizaRegistroInsignia` pode existir nesse arquivo quando for apenas renderização local do item.

---

# 9. Contexto de SPA: criação/edição/detalhe

Arquivo padrão:

```txt
src\contextos\Contexto__PaginaX__NovaEntidade\contexto.tsx
```

Exemplo:

```txt
src\contextos\Contexto__PaginaArtistaInsignia__NovaInsignia\contexto.tsx
```

## Responsabilidade

Esse é o contexto do subfluxo de criação.

Ele é renderizado pelo `resolveSaida` quando a página entra em estado de criação.

Ele deve conter lógica e ações específicas desse fluxo, mantendo a SPA limpa.

## Características

- recebe props vindas do contexto controlador de fluxo quando necessário;
- pode configurar layout contextualizado, subtítulo e botão de voltar;
- pode criar formulário com `useFormularioCreate`;
- define o submit do formulário;
- chama endpoint do subfluxo;
- expõe apenas o objeto de formulário ou ações necessárias;
- renderiza diretamente a SPA correspondente;
- não renderiza `{children}`.

## Padrão recomendado com `useFormularioCreate`

```tsx
'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaArtistaInsignia__NovaInsignia from 'Conteineres/PaginaArtistaInsignia/paginas/SPA__PaginaArtistaInsignia__NovaInsignia/SPA__PaginaArtistaInsignia__NovaInsignia';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';

type DTO__CREATE__Insignia = {
    readonly nome: string;
    readonly descricao: string;
};

const FORMULARIO_CREATE_INSIGNIA = defineFormularioCreate<DTO__CREATE__Insignia>({
    valoresIniciais: {
        nome: '',
        descricao: '',
    },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Nome da insígnia' },
        descricao: { tipo: 'textarea', label: 'Descrição', obrigatorio: true, maxLength: 2000, placeholder: 'Descrição da insígnia' },
    },
});

interface Contexto__PaginaArtistaInsignia__NovaInsignia__Props {
    formularioNovaInsignia: FormularioCreateEstado<DTO__CREATE__Insignia>;
};

const Contexto__PaginaArtistaInsignia__NovaInsignia = createContext<Contexto__PaginaArtistaInsignia__NovaInsignia__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia__NovaInsignia = (): Contexto__PaginaArtistaInsignia__NovaInsignia__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia__NovaInsignia);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia__NovaInsignia precisa estar dentro de um Contexto__PaginaArtistaInsignia__NovaInsignia');
    return context;
};

export const Contexto__PaginaArtistaInsignia__NovaInsignia__Provider = ({ setEstaEmProcessoCriacao }: { setEstaEmProcessoCriacao: (v: boolean) => void; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Criando novo registro', fecharProps: { tipo: 'acao', executar: () => setEstaEmProcessoCriacao(false), tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovaInsignia = useFormularioNovaInsignia();

    return (
        <Contexto__PaginaArtistaInsignia__NovaInsignia.Provider value={{ formularioNovaInsignia }}>
            <SPA__PaginaArtistaInsignia__NovaInsignia />
        </Contexto__PaginaArtistaInsignia__NovaInsignia.Provider>
    );
};

function useFormularioNovaInsignia(): FormularioCreateEstado<DTO__CREATE__Insignia> {
    return useFormularioCreate(FORMULARIO_CREATE_INSIGNIA, async payload => {
        console.log('Criar nova insígnia', payload);
    });
};
```

## Regra de clareza

O contexto de criação não deve voltar a ter dezenas de states manuais.

Errado:

```ts
const [nome, setNome] = useState('');
const [descricao, setDescricao] = useState('');
const [salvando, setSalvando] = useState(false);
```

Preferido:

```ts
const formularioNovaInsignia = useFormularioNovaInsignia();
```

A lógica fica clara:

```txt
este contexto configura o layout
ele cria o formulário
ele define como salvar
```

---

# 10. SPA de renderização: criação/edição/detalhe

Arquivo padrão:

```txt
src\conteineres\PaginaX\paginas\SPA__PaginaX__NovaEntidade\SPA__PaginaX__NovaEntidade.tsx
```

Exemplo:

```txt
src\conteineres\PaginaArtistaInsignia\paginas\SPA__PaginaArtistaInsignia__NovaInsignia\SPA__PaginaArtistaInsignia__NovaInsignia.tsx
```

## Responsabilidade

Esse arquivo é componente de renderização.

Ele renderiza o formulário/tela do subfluxo consumindo o contexto específico.

Ele não deve:

- usar `useState` para lógica;
- chamar endpoint diretamente;
- montar payload;
- executar GraphQL;
- decidir se está em criação ou listagem;
- alterar layout contextualizado diretamente.

## Exemplo

```tsx
import { useContexto__PaginaArtistaInsignia__NovaInsignia } from 'Contextos/Contexto__PaginaArtistaInsignia__NovaInsignia/contexto';

export default function SPA__PaginaArtistaInsignia__NovaInsignia() {
    const { formularioNovaInsignia } = useContexto__PaginaArtistaInsignia__NovaInsignia();

    return (
        <section>
            <label>
                <span>Nome</span>
                <input type="text" {...formularioNovaInsignia.input('nome')} />
                {formularioNovaInsignia.erro('nome') && <small>{formularioNovaInsignia.erro('nome')}</small>}
            </label>

            <label>
                <span>Descrição</span>
                <textarea {...formularioNovaInsignia.textarea('descricao')} />
                {formularioNovaInsignia.erro('descricao') && <small>{formularioNovaInsignia.erro('descricao')}</small>}
            </label>

            <button type="button" onClick={formularioNovaInsignia.salvar} disabled={!formularioNovaInsignia.podeSalvar}>
                {formularioNovaInsignia.salvando ? 'Salvando...' : 'Salvar'}
            </button>
        </section>
    );
};
```

---

# Padrão de nomes

A nomenclatura é parte essencial da arquitetura.

## Página/feature

Use nome conceitual da página:

```txt
PaginaArtistaInsignia
PaginaModeradorEmblemas
```

Esse nome aparece em:

```txt
Conteiner__PaginaArtistaInsignia
Contexto__PaginaArtistaInsignia
SPA__PaginaArtistaInsignia__Listagem
```

## Conteiner

```txt
Conteiner__PaginaX
Conteiner__PaginaX__Interno
PropsConteiner__PaginaX
```

## Contexto geral

```txt
Contexto__PaginaX
Contexto__PaginaX__Props
Contexto__PaginaX__Provider
useContexto__PaginaX
```

## Contexto de subfluxo

```txt
Contexto__PaginaX__Listagem
Contexto__PaginaX__Listagem__Props
Contexto__PaginaX__Listagem__Provider
useContexto__PaginaX__Listagem
```

```txt
Contexto__PaginaX__NovaEntidade
Contexto__PaginaX__NovaEntidade__Props
Contexto__PaginaX__NovaEntidade__Provider
useContexto__PaginaX__NovaEntidade
```

## SPA

```txt
SPA__PaginaX__Listagem
SPA__PaginaX__NovaEntidade
```

## Por que `__`?

O `__` separa níveis semânticos da arquitetura.

Exemplo:

```txt
Contexto__PaginaArtistaInsignia__NovaInsignia
```

Leitura:

```txt
Contexto
da página PaginaArtistaInsignia
do subfluxo NovaInsignia
```

Isso permite entender o papel do arquivo sem abrir o conteúdo.

---

# Organização de pastas

## Backend

```txt
src\modules\paginas\paginas.const.ts
src\modules\menus\menus.const.ts
```

## Frontend: rota Next

```txt
src\app\(paginas)\minhas-paginas\artista\insignias\page.tsx
src\app\(paginas)\minhas-paginas\artista\insignias\componentes.tsx
```

## Frontend: conteiner

```txt
src\conteineres\PaginaArtistaInsignia\conteiner.tsx
```

## Frontend: contextos

```txt
src\contextos\Contexto__PaginaArtistaInsignia\contexto.tsx
src\contextos\Contexto__PaginaArtistaInsignia__Listagem\contexto.tsx
src\contextos\Contexto__PaginaArtistaInsignia__NovaInsignia\contexto.tsx
```

## Frontend: SPAs

```txt
src\conteineres\PaginaArtistaInsignia\paginas\SPA__PaginaArtistaInsignia__Listagem\SPA__PaginaArtistaInsignia__Listagem.tsx
src\conteineres\PaginaArtistaInsignia\paginas\SPA__PaginaArtistaInsignia__NovaInsignia\SPA__PaginaArtistaInsignia__NovaInsignia.tsx
```

CSS module da SPA, quando necessário:

```txt
src\conteineres\PaginaArtistaInsignia\paginas\SPA__PaginaArtistaInsignia__NovaInsignia\styles.module.css
```

---

# Checklist para criar uma nova página SPA

## Backend

- [ ] Criar página em `PAGINAS`.
- [ ] Usar `paginaComLayoutContextualizado`, salvo exceção explícita.
- [ ] Usar `CAPACIDADES`, nunca string manual.
- [ ] Adicionar item/grupo em `MENUS_INTERNOS`, se a página for navegável por menu.
- [ ] Adicionar entrada em `MENUS_INTERNOS_LAYOUTCONTEXTO`.
- [ ] Usar `menuVazio()` apenas quando a página realmente não deve ter menu lateral.
- [ ] Usar `menuDinamico()` apenas quando o menu será calculado dinamicamente.

## Frontend rota

- [ ] Criar `page.tsx` mínimo.
- [ ] Criar `componentes.tsx` com `ControladorSlot`.
- [ ] Passar a página correta de `PAGINAS`.
- [ ] Renderizar o `Conteiner__PaginaX`.

## Frontend SPA

- [ ] Criar `Conteiner__PaginaX`.
- [ ] Criar `Contexto__PaginaX` como controle de fluxo.
- [ ] Criar `Contexto__PaginaX__Listagem`.
- [ ] Criar `SPA__PaginaX__Listagem`.
- [ ] Criar `Contexto__PaginaX__NovaEntidade` se houver criação.
- [ ] Criar `SPA__PaginaX__NovaEntidade` se houver criação.
- [ ] Usar `ListagemComposta` para listagens comuns.
- [ ] Usar `useFormularioCreate` para formulários comuns.

---

# Regras finais

- Backend é o berço da página.
- Frontend apenas renderiza contratos e estrutura oficial.
- `page.tsx` é mínimo.
- `componentes.tsx` é ponte obrigatória com `ControladorSlot`.
- `Conteiner` controla fluxo SPA.
- Contexto geral controla dados/estado de fluxo.
- Contexto de SPA controla lógica do subfluxo.
- SPA renderiza.
- Menu é regra de navegação/backend, não escolha visual local.
- Nomes com `__` são parte do padrão e não devem ser simplificados.
- Cada arquivo deve ter uma responsabilidade clara.
