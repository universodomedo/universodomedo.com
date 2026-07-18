# `src/pages/` = mundo "v2" (lousa limpa)

Tudo sob `src/pages/` é a **nova versão da interface**, servida pelo **Pages Router** e
deliberadamente **isolada** do App Router (`src/app/`), que é o app atual (a virar legado):

- **não** passa pelo `src/app/layout.tsx` (nenhum wrapper/provider/fonte do app atual);
- **não** recebe o `src/app/globals.css` (pipelines de CSS separados);
- **sem** `ConteinerEscalavel` / variável `--scale`: o layout é **responsivo** (adapta a
  retrato/paisagem, mobile/desktop), não um palco fixo 1920×1080;
- **sem** trava de orientação (o app atual força paisagem; a v2 não).

Rota pública inicial: `/v2` (`src/pages/v2/index.tsx`). Sem autenticação/chaveamento — qualquer um entra.

A `/v2` é **intencionalmente uma rota experimental fora de `PAGINAS`/`MENUS`** (não é página
"oficial" do produto, não passa por `ControladorSlot`, não precisa de contrato na Nora-Api).
É justamente por isso que ela vive no Pages Router, isolada.

## Isenção de skills (decidido com o dono — 2026-07-18)

As skills de UI em `.agents/skills/ui/` descrevem o **paradigma do app atual** (escalado,
identidade gótico-horror única, biblioteca de inputs compartilhada). A `/v2` é um **conceito
visual novo** e está **isenta das regras de paradigma** dessas skills:

- **`coordenadas-ponteiro-conteiner-escalavel`** — não se aplica: sem `--scale`, `clientX`/`clientY`
  já são coordenada de layout (nada a compensar);
- **`estilos-css-udm`** — a identidade visual da v2 é **do designer** (não reusar a paleta atual);
  unidades responsivas (`rem`/`clamp`/`dvh`/`vw`) no lugar de `em` acoplado ao `--scale`;
- **`inputs-e-telas-criacao-udm`** — a v2 **não** usa a biblioteca de inputs do app
  (`ConteudoForm`, `InputComRotulo`, `SelecionadorOpcoes`, …).

**Mantido** dessas skills (higiene neutra de paradigma): CSS Modules com escopo, arquivos
pequenos perto do componente, sem CSS global gigante, nomes de classe por papel, estados
agrupados. O **único** CSS global é o reset em `_globais-v2.css` (necessidade real).
