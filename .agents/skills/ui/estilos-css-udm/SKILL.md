---
name: estilos-css-udm
description: Use quando a tarefa envolver CSS, CSS Modules, SASS/SCSS, styles.module.css, organização de estilos, responsividade, estados visuais, hover, disabled, pseudo-elementos, sombras, cores, quebra de arquivos de estilo ou componentes visuais no frontend do Universo do Medo.
---

# Skill — Estilos CSS no frontend UDM

Esta skill define o padrão de estilos no frontend `universodomedo.com`.

## Regra central

CSS deve ser organizado por responsabilidade visual.

Não criar CSS gigante, genérico ou compartilhado por dezenas de componentes sem responsabilidade clara.

Estilo deve acompanhar o componente, SPA ou bloco visual que ele realmente representa.

## CSS Modules e escopo

Preferir CSS Modules para estilos de componentes, SPAs e blocos visuais específicos.

Não criar CSS global sem necessidade real.

Não criar um único arquivo de CSS para controlar múltiplas telas ou componentes independentes.

Regra obrigatória:

- estilo de uma SPA deve ficar próximo da SPA;
- estilo de componente reutilizável deve ficar próximo do componente;
- CSS de página não deve virar depósito visual de todos os subcomponentes;
- classes não devem criar contrato invisível entre componentes distantes;
- não referenciar o mesmo CSS module em dezenas de arquivos independentes.

## Tamanho e responsabilidade

CSS grande é sinal forte de responsabilidade excessiva.

Regra prática:

- arquivo de estilo acima de 100 linhas é yellow flag;
- arquivo de estilo acima de 300 linhas exige justificativa forte;
- CSS com centenas de linhas normalmente indica que ele deveria ser dividido;
- CSS único sendo referenciado por muitos componentes é forte indício de acoplamento ruim.

Dividir CSS por componente, subcomponente, SPA, bloco visual reutilizável, responsabilidade visual e estado visual independente.

Não dividir por estética vazia. Dividir quando isso melhora clareza, reutilização e manutenção.

## Unidades

Não usar `px`.

Preferir `%` ou `em`.

Manter escala relativa e adaptável.

## SASS/SCSS aninhado

Usar aninhamento quando ele melhora clareza.

O aninhamento é especialmente recomendado quando o mesmo seletor possui `:hover`, `:focus`, `:active`, `:disabled`, `:not(...)`, pseudo-elementos, variações de cor, variações de sombra, múltiplos estados visuais ou modificadores de classe.

Exemplo preferido:

```scss
button {
    &:not(.disabled) {
        cursor: pointer;
    }

    &:hover:not(.disabled) {
        box-shadow: 0 0.2em 0.6em rgba(0, 0, 0, 0.2);
    }

    &.disabled {
        opacity: 0.5;
        cursor: default;
    }
}
```

Isso é melhor do que espalhar seletores separados difíceis de acompanhar:

```scss
button:not(.disabled) { }
button:hover:not(.disabled) { }
button.disabled { }
```

A intenção é deixar claro que os estados pertencem ao mesmo elemento.

## Limite do aninhamento

Não aninhar múltiplos elementos um dentro do outro sem necessidade.

Aninhamento ruim:

```scss
.card {
    .header {
        .title {
            span {
                strong {
                }
            }
        }
    }
}
```

Isso cria acoplamento estrutural demais.

Aninhamento bom:

```scss
.card {
    &:hover {
    }

    &.selecionado {
    }

    &::before {
    }
}
```

Regra:

- aninhar estados do mesmo elemento é recomendado;
- aninhar árvore profunda de elementos é suspeito;
- aninhamento deve explicar relação visual, não esconder complexidade;
- se o aninhamento passa de 3 níveis, avaliar quebra de componente ou classe.

## Estados visuais

Estados devem ser explícitos e próximos do seletor base.

Estados que devem ficar agrupados quando possível: base, hover, focus, active, disabled, selected, loading, erro, sucesso, vazio, expandido/recolhido.

Não espalhar estados do mesmo elemento por lugares distantes do arquivo.

## Classes e nomes

Classes devem comunicar função visual.

Evitar nomes genéricos demais como `container`, `content`, `item`, `box`, exceto quando o escopo do CSS module deixa a responsabilidade óbvia.

Preferir nomes que indiquem papel, como `cardSessao`, `cabecalhoCard`, `acoesCard`, `botaoSelecionar`, `listaParticipantes`.

## Componentes finais

Quando um componente visual final tem responsabilidade própria, ele deve ter estilo próprio ou receber classes claramente controladas pelo componente pai.

Não criar componente visual reutilizável que depende de classes internas de uma página distante.

Não fazer um CSS de SPA controlar detalhes internos de muitos componentes filhos independentes.

## Responsividade

Responsividade deve ficar próxima da responsabilidade visual correspondente.

Não criar media queries globais para componentes específicos.

Não duplicar breakpoint sem necessidade.

Não alterar responsividade existente sem entender impacto visual.

## Identidade visual (não inventar por página)

O UDM tem UMA identidade visual (gótico-horror), e ela é a fonte — extraída de `globals.css` e dos módulos: ouro velho `#B79051` (cor de marca: títulos de jogo, seleção, ação primária), pergaminho `#EBE0C9` (nomes/headings), fundo quase-preto, toques paranormais em roxo/magenta.

Regra: NÃO criar uma identidade visual nova a cada página/componente. Reaproveitar a paleta + os padrões já existentes. NÃO inventar cor fora da paleta de marca (ex.: teal `#00A8B8` NÃO é da marca).

### Padrão de botão — `<button>` dentro de `ConteudoForm.AreaBotoes`
NÃO há componente `Botao` (removido — era indireção inútil). O botão de ação on-brand vem do **rodapé `ConteudoForm.AreaBotoes`** (`componentes/Elementos/ConteudoForm`), que estiliza os `<button>` que recebe: ponha um `<button>` direto dentro do `<ConteudoForm.AreaBotoes>` e ele já fica on-brand. Variante via atributo `data-variante`:

- (sem atributo) — primário: ouro velho `#B79051` (ação principal / confirmar);
- `data-variante="secundario"` — contorno pergaminho `#EBE0C9` (cancelar / ação leve);
- `data-variante="perigo"` — contorno vermelho de aviso `#DB4747` (destrutiva, ex.: deletar).

Todos CAIXA-ALTA + `letter-spacing`, `min-height ~3em`. NÃO estilizar `<button>` de ação na mão por página — pôr dentro do `AreaBotoes`. Variante nova → adicionar no CSS do `AreaBotoes`. (Botão inline raro fora do rodapé — ex.: salvar de campo — pode ter estilo modesto local da SPA.)

### Estrutura corpo + ações — usar `ConteudoForm`
TODA página/fluxo com corpo + botões usa o compound **`ConteudoForm`** (`componentes/Elementos/ConteudoForm`): `<ConteudoForm><ConteudoForm.AreaCorpo>…corpo…</ConteudoForm.AreaCorpo><ConteudoForm.AreaBotoes><button …>…</button></ConteudoForm.AreaBotoes></ConteudoForm>`. O `AreaCorpo` preenche; o `AreaBotoes` já é o rodapé padronizado (centralizado, fixo na base, separador) que ESTILIZA os `<button>` que recebe (variante via `data-variante`). NÃO reimplementar `.acoes`/rodapé de botões na mão por página.

## Bloqueios

É bloqueado:

- criar identidade visual nova por página/componente em vez de reusar a paleta de marca, ou usar cor fora dela (ex.: teal `#00A8B8`);
- estilizar `<button>` de ação na mão por página em vez de pôr dentro do `ConteudoForm.AreaBotoes` (que já estiliza);
- usar `px`;
- criar CSS global sem necessidade real;
- criar CSS module único para dezenas de componentes;
- criar CSS gigante para página inteira com vários blocos independentes;
- espalhar estados do mesmo elemento por várias partes do arquivo;
- usar aninhamento profundo para mascarar componente grande demais;
- criar classe genérica que vira contrato invisível entre arquivos;
- estilizar componente filho reutilizável a partir de CSS distante sem necessidade;
- remover responsividade existente sem autorização;
- alterar visual/UX como efeito colateral de refactor técnico.
