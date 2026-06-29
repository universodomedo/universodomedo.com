# componente-selecionador-udm

Padrão reutilizável para **selecionar UM registro de uma entidade** e devolver seu id via callback. Substitui `<select>` soltos, listas ad-hoc e modais de escolha espalhados. Sempre que alguma parte do sistema precisar de "escolher um registro da Entidade X", usa um `Componente_Selecionador__<Entidade>` — não reinventa.

## Quando usar
- Escolher uma Arte de Capa, uma Música, um Ser, um Avatar, um Emblema, um Card… qualquer "pick one record".
- Em vez de `<select>` cru ou de buscar/listar na mão dentro da página.

## Arquitetura (2 camadas)

### 1. Genérico — `componentes/Selecionadores/Componente_Selecionador/`
`Componente_Selecionador<TRegistro>` é o dono da **seleção** e da **confirmação**. NÃO é modal — quem renderiza decide onde (inline, num SPA/Conteiner). Props:

```ts
{
    listagem: ListagemCompostaListagem<TRegistro>;        // dados (REST embrulhado OU useNoraGraphQLListagem)
    obterIdRegistro: (registro) => string | number;       // id de cada registro
    renderizarItem: (registro, selecionado) => ReactNode; // conteúdo visual de cada card
    aoConfirmar: (idRegistro) => void | Promise<void>;    // callback ao confirmar
    idInicial?: string | number | null;                   // pré-seleção
    modoExibicao?: 'grade' | 'linha';                     // default 'grade'
    itensPorLinha?: number;                                // default 3
    textoConfirmar?: string; titulo?: string; subtitulo?: string;
}
```
Ele renderiza um `ListagemComposta`, envolve cada item num `DivClicavel` com highlight (`.item`/`.item_selecionado`) + `onClick` que seta o id selecionado, e um botão de confirmação (desabilitado até selecionar) que chama `aoConfirmar(idSelecionado)`.

### 2. Instância — `componentes/Selecionadores/Componente_Selecionador__<Entidade>/`
Embrulha o genérico com a fonte de dados + o render de cada registro. Recebe e repassa o callback (`aoConfirmar(id)`). Exemplo (`Componente_Selecionador__ArteCapa`): carrega `listaCapasArte3D()` (REST) em estado, embrulha no formato `ListagemCompostaListagem`, e renderiza a miniatura de cada capa.

## Fonte de dados (REST ou GraphQL)
`ListagemComposta` é **agnóstico de fonte** — só recebe `{ registros, carregando, erro, mensagemListaVazia, ...(opcionais) }`.
- **GraphQL** (entidade existe em `GraphqlLeituras`): `const listagem = useNoraGraphQLListagem('ArquivoTipadoMusica', { select, itensPorPagina, ... })` — já vem no formato (com filtros/paginação grátis).
- **REST / custom**: estado local `registros/carregando/erro` + `useEffect` que busca, `useMemo(() => ({ registros, carregando, erro, mensagemListaVazia }))`. (Padrão do `Contexto__Modal__ConfiguradorAvatar` e do `Componente_Selecionador__ArteCapa`.)

## Armadilhas (NÃO esquecer)
- **Altura**: o root do `ListagemComposta` é `flex:1; height:0` → SÓ ganha altura se o pai for **flex-column com altura definida**. O genérico já trata: `.listagem` é `display:flex; flex-direction:column; height: min(55vh, 32em)`. Se embutir o ListagemComposta em outro lugar, garanta um pai com altura — senão o scrollable colapsa em 0 e a lista some.
- **Contraste**: registros com conteúdo escuro (ex.: render 3D) somem no fundo escuro → `.item` tem moldura/card visível por padrão (`border` + `background-color` sutis), além do destaque dourado no selecionado.
- **id**: `obterIdRegistro` deve casar com `idInicial` e com o que `aoConfirmar` espera (number → `Number(id)` na ponte, já que `ListagemCompostaIdRegistro = string | number`).

## Uso típico (inline, revelado por botão)
```tsx
const [selecionando, setSelecionando] = useState(false);
// ...
selecionando
  ? <Componente_Selecionador__ArteCapa idInicial={idAtual} aoConfirmar={id => { aplica(id); setSelecionando(false); }} />
  : <button onClick={() => setSelecionando(true)}>Trocar Arte de Capa</button>
```

## Existente para espelhar
- `Componente_Selecionador` + `Componente_Selecionador__ArteCapa` (este padrão).
- Referência legada (modal, NÃO copiar a parte do Modal): `Contexto__Modal__ConfiguradorArteCapa` / `Modal__ConfiguradorAvatar` — mostram o `ListagemComposta` + seleção + REST/GraphQL.
- Skills relacionadas: `paginas-udm-frontend`, `conteiner-contexto-spa-udm`, `graphql-frontend-udm`.
