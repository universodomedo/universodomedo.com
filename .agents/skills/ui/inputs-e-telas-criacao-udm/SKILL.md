---
name: inputs-e-telas-criacao-udm
description: Use quando a tarefa envolver renderizar inputs/campos em telas de criação, edição ou configuração no frontend do Universo do Medo — formulário, ConteudoForm, InputComRotulo, AlternaOpcao (boolean), SelecionadorOpcoes (dropdown/MultiSelect), InputNumerico, InputData, ou substituir input/checkbox/select cru pelos componentes padronizados.
---

# Skill — Inputs e telas de criação/edição/configuração no frontend UDM

Esta skill é A FONTE do padrão visual e de composição de **qualquer tela de criação, edição ou configuração** no `universodomedo.com`. Se a tela tem campos pro usuário preencher, ela obedece este padrão.

## Regra central

Campos são renderizados com a **biblioteca de inputs do UDM** (`componentes/Elementos/Inputs/`), NUNCA com HTML cru. `<input type="text|number|checkbox|radio">`, `<select>`/`<option>`, label solta (`<label>`/`<span>`) e estilização de campo na mão são **bloqueados**.

Referência viva a espelhar: `src/app/(paginas)/minhas-paginas/mestre/(temporario)/criar-sessao-unica/componentes.tsx`.

## Estrutura da tela

- **Corpo + ações** = compound **`ConteudoForm`** (`componentes/Elementos/ConteudoForm`): campos em `<ConteudoForm.AreaCorpo>`, botões `<button>` em `<ConteudoForm.AreaBotoes>` (rodapé padronizado; variante via `data-variante`). Ver `estilos-css-udm` e `conteiner-contexto-spa-udm`.
- **Cada campo** = **`InputComRotulo rotulo="…">{input}</InputComRotulo>`** (`componentes/Elementos/Inputs/InputComRotulo`). O `InputComRotulo` JÁ É o card completo: borda + fundo gradiente + label `<h3>` CAIXA-ALTA centralizado + estilo do input interno. NÃO pôr label na mão, NÃO criar `.campo`/`.rotulo`/`.input` por página.
- **Layout** = grade de cards (flex-wrap ou grid); campo largo pode ocupar a linha inteira (`flex-basis:100%`). O CSS da página é só o LAYOUT — o card vem do `InputComRotulo`.

## Qual componente pra cada tipo de campo

| Tipo | Componente | Import (alias `Componentes/…`) |
|---|---|---|
| **Texto** | `<input type="text">` DENTRO do `InputComRotulo` (o wrapper estiliza) | — |
| **Número** | **`InputNumerico`** (`value: number`, `onChange: (n: number) => void`) | `Elementos/Inputs/InputNumerico/InputNumerico` |
| **Boolean** | **`AlternaOpcao`** (`opcao: boolean`, `onChange: (b: boolean) => void`) — pílula toggle | `Elementos/Inputs/AlternaOpcao/AlternaOpcao` |
| **Data** | **`InputData`** | `Elementos/Inputs/InputData/InputData` |
| **Escolher de OPÇÕES FIXAS (1 ou N)** | **`SelecionadorOpcoes`** — dropdown react-select com busca/tags | `Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes` |
| **Escolher UM REGISTRO de uma ENTIDADE** | **`Componente_Selecionador__<Entidade>`** (ver skill `componente-selecionador-udm`) | `Selecionadores/Componente_Selecionador__…` |

## `SelecionadorOpcoes` (o dropdown genérico de opções fixas)

`SelecionadorOpcoes` substitui o `<select>` cru pra listas de `{value: string; label: string}` **fixas** (enum, categoria, tipo, capacidades, etc.):

- single: `<SelecionadorOpcoes opcoes={...} valor={x} onChange={v => ...} />` — `onChange: (valor: string | null)`;
- multi: `<SelecionadorOpcoes isMulti opcoes={...} valores={xs} onChange={vs => ...} />` — `onChange: (valores: string[])`. **É o MultiSelect esperado** (tags + busca), no lugar de checklist na mão.

Construído sobre `criarSelecionadorBase` (react-select + estilo UDM), o mesmo padrão dos selecionadores de entidade (`SelecionadorUsuarioEmCache`, `SelecionadorRascunho`, `SelecionadorPersonagem`).

## Distinção crítica: `SelecionadorOpcoes` ≠ `Componente_Selecionador`

- **`SelecionadorOpcoes`** (`Elementos/Inputs/Selecionadores/`) = dropdown de **opções fixas** (`{value,label}`), inline e pequeno.
- **`Componente_Selecionador__<Entidade>`** (`componentes/Selecionadores/`) = pick de **UM REGISTRO de entidade** via `ListagemComposta` (`aoConfirmar`/`idInicial`). Ver `componente-selecionador-udm`.

Opção fixa → `SelecionadorOpcoes`. Registro de entidade (Música, Ser, Arte, Usuário…) → `Componente_Selecionador`. Nunca trocar um pelo outro.

## Navegação/título não vão no corpo

Título/subtítulo da tela vêm do `useConfigurarLayoutContextualizado` da página/subfluxo (skill `navegacao-layout-contextualizado`), NUNCA como header no corpo. O `InputComRotulo` é rótulo de CAMPO, não cabeçalho de navegação.

## Bloqueios

- `<input type="checkbox">` / `<input type="radio">` cru → **`AlternaOpcao`**;
- `<select>`/`<option>` cru → **`SelecionadorOpcoes`** (opções fixas) ou **`Componente_Selecionador__<Entidade>`** (registro);
- checklist ou multi-select montado na mão → **`SelecionadorOpcoes isMulti`**;
- label solta ou `.campo`/`.rotulo`/`.input` estilizados por página → **`InputComRotulo`**;
- estilizar o card/input na mão (o `InputComRotulo` já faz);
- `<input type="number">` cru → **`InputNumerico`**;
- montar o rodapé de botões na mão em vez de `ConteudoForm.AreaBotoes`.

## Referências

- **Viva:** `minhas-paginas/mestre/(temporario)/criar-sessao-unica/componentes.tsx`.
- **Componente genérico criado como parte deste padrão:** `Elementos/Inputs/Selecionadores/SelecionadorOpcoes`.
- **Skills relacionadas:** `componente-selecionador-udm`, `estilos-css-udm`, `conteiner-contexto-spa-udm`, `navegacao-layout-contextualizado`, `paginas-udm-frontend`.
