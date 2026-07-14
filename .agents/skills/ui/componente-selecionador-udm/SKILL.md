---
name: componente-selecionador-udm
description: Use quando a tarefa envolver escolher UM registro de uma entidade no frontend do Universo do Medo, Componente_Selecionador, Componente_Selecionador__Entidade, selecionador reutilizável, ListagemComposta para seleção, aoConfirmar com id, pré-seleção idInicial ou substituir select cru/lista ad-hoc/modal de escolha por um seletor padronizado.
---

# componente-selecionador-udm

Padrão reutilizável para **selecionar UM registro de uma entidade** e devolver via callback. Substitui `<select>` soltos, listas ad-hoc e modais de escolha espalhados. Sempre que precisar "escolher um registro da Entidade X", usa um `Componente_Selecionador__<Entidade>` — não reinventa.

## Quando usar
- Escolher uma Arte de Capa, uma Música, um Ser, um Avatar, um Emblema, um Card… qualquer "pick one record".
- Em vez de `<select>` cru ou de buscar/listar na mão dentro da página.

## Arquitetura (2 camadas)

### 1. Genérico — `componentes/Selecionadores/Componente_Selecionador/`
`Componente_Selecionador<TRegistro>` é o dono da **seleção** e da **confirmação/cancelamento**. NÃO é modal — quem renderiza decide onde (inline, num SPA/Conteiner). Props:

```ts
{
    listagem: ListagemCompostaListagem<TRegistro>;              // dados (REST embrulhado OU useNoraGraphQLListagem)
    obterIdRegistro: (registro) => string | number;
    renderizarItem: (registro, selecionado) => ReactNode;
    aoConfirmar: (registro: TRegistro) => void | Promise<void>; // recebe o REGISTRO INTEIRO (não só o id); a instância mapeia (ex.: capa.idProjeto)
    aoCancelar?: () => void;                                     // se passado, vira o botão Cancelar do rodapé
    idInicial?: string | number | null;
    modoExibicao?: 'grade' | 'linha';                           // default 'grade'
    itensPorLinha?: number;
    textoConfirmar?: string;
}
```

Preview rico de um registro (áudio, render 3D…) mora DENTRO do card, via `renderizarItem` — nunca num painel lateral do selecionador (feedback do usuário 12/07/2026: "n quero um elemento lateral"). Ex.: Música toca no item; Mapa renderiza `MiniaturaMapa3D` no item.

### 2. Instância — `componentes/Selecionadores/Componente_Selecionador__<Entidade>/`
Embrulha o genérico com a fonte de dados + o render de cada registro. Mapeia o callback (ex.: ArteCapa → `aoConfirmar(capa.idProjeto)`; Música → `(musica.id, musica.nome)`).

## Estrutura: `ConteudoForm` + dono dos DOIS botões
O genérico usa o compound **`ConteudoForm`** (`componentes/Elementos/ConteudoForm`): a `ListagemComposta` vai no `<ConteudoForm.AreaCorpo>` e os botões — **Cancelar (se `aoCancelar`) + Confirmar** — no `<ConteudoForm.AreaBotoes>` (rodapé já centralizado/fixo na base, com separador). NÃO reimplementar o rodapé na mão, NÃO deixar botão solto nem o Cancelar no componente pai. O Confirmar fica desabilitado até haver seleção e chama `aoConfirmar(registro)`.

## NAVEGAÇÃO NÃO É DO COMPONENTE
O `Componente_Selecionador` NÃO tem `titulo`/`subtitulo` próprios. Título/subtítulo de navegação são do `useConfigurarLayoutContextualizado` da página/contexto (skill `navegacao-layout-contextualizado`). Componente reutilizável NUNCA empilha o próprio cabeçalho de navegação (vira "subtítulo dentro de componente dentro de subtítulo"). E **não copiar o cabeçalho de um Modal pra um componente inline** — modal pode ter header, inline não.

## Botões: `<button>` dentro do `AreaBotoes`
O rodapé (`ConteudoForm.AreaBotoes`) ESTILIZA os `<button>` que recebe — então é `<button>` direto: Confirmar (primário, sem atributo) + Cancelar (`data-variante="secundario"`). NÃO há componente `Botao` (removido — era indireção inútil); NÃO estilizar botão na mão. Ver `estilos-css-udm`.

## Fonte de dados (REST ou GraphQL)
`ListagemComposta` é agnóstico de fonte — `{ registros, carregando, erro, mensagemListaVazia, ...(opcionais) }`.
- **GraphQL** (entidade em `GraphqlLeituras`): `useNoraGraphQLListagem('Entidade', { select, ... })` — já vem no formato (filtros/paginação grátis). Ver `graphql-frontend-udm`.
- **REST/custom**: estado local `registros/carregando/erro` + `useEffect` + `useMemo` no formato `ListagemCompostaListagem` (padrão do `Componente_Selecionador__ArteCapa`).

## Armadilhas (NÃO esquecer)
- **Altura**: o root do `ListagemComposta` é `flex:1; height:0` → só ganha altura num pai **flex-column com altura definida**. O `ConteudoForm` trata (`.conteudo_form { height:100% }` + `AreaCorpo { flex:1; display:flex; flex-direction:column }`); dentro do `AreaCorpo` a `.listagem` tem `flex:1; min-height:18em` — o `min-height` é fallback pro uso INLINE (senão o scrollable colapsa em 0). Em full-page a `.listagem` cresce e o `AreaBotoes` fixa na base.
- **Contraste**: registros escuros (render 3D) somem no fundo escuro → `.item` tem moldura/card visível por padrão + destaque dourado no selecionado.
- **id**: `obterIdRegistro` casa com `idInicial` e com o que `aoConfirmar` precisa.

## Uso típico (inline, revelado por botão)
```tsx
const [selecionando, setSelecionando] = useState(false);
selecionando
  ? <Componente_Selecionador__ArteCapa idInicial={idAtual} aoConfirmar={id => { aplica(id); setSelecionando(false); }} aoCancelar={() => setSelecionando(false)} />
  : <button onClick={() => setSelecionando(true)}>Trocar Arte de Capa</button>
```

## Existente para espelhar
- `Componente_Selecionador` + `Componente_Selecionador__ArteCapa` (REST) + `Componente_Selecionador__MusicaDeFundo` (GraphQL `MusicaConfigurada`, modo linha, preview de áudio).
- `Componente_Selecionador__Mapa` (REST `listaMapas3D`, grade em que cada card renderiza o mapa em 3D real via `MiniaturaMapa3D`).
- Referência legada (modal, NÃO copiar a parte do Modal): `Contexto__Modal__ConfiguradorArteCapa`.
- Skills relacionadas: `navegacao-layout-contextualizado`, `estilos-css-udm`, `paginas-udm-frontend`, `conteiner-contexto-spa-udm`, `graphql-frontend-udm`.
