---
name: coordenadas-ponteiro-conteiner-escalavel
description: Tratar coordenadas de ponteiro (clientX/clientY) ao implementar arraste, área de seleção, canvas/SVG, pan, zoom, hit-test ou qualquer mapeamento ponteiro→conteúdo no frontend do Universo do Medo, que é escalado globalmente pelo ConteinerEscalavel via transform CSS --scale. Converter com getScreenCTM().inverse() ou dividir deltas de tela pela escala efetiva; nunca tratar pixel de tela como pixel de layout.
---

# UdM Frontend — Coordenadas de ponteiro sob o ConteinerEscalavel

## Regra central

O app inteiro do `universodomedo.com` é renderizado dentro do `ConteinerEscalavel` (`src/componentes/ElementosVisuais/ConteinerEscalavel/ConteinerEscalavel.tsx`), que aplica um `transform: scale(var(--scale))` para encaixar um palco lógico de **1920×1080** na viewport real. Ou seja: **existe uma escala global entre pixel de tela e pixel de layout**, e ela quase nunca é 1.

Qualquer código que converta um evento de ponteiro (`clientX`/`clientY`, deltas de arraste) em coordenada de conteúdo (DOM, SVG, canvas) **precisa** considerar essa escala. Ignorá-la é a causa do bug recorrente: o cursor "anda num offset diferente" da interação — o elemento arrastado descola do mouse, o retângulo de seleção (marquee) não acompanha o ponteiro, o hit-test erra.

## Sintoma típico

- Arrastar um elemento ou desenhar uma área de seleção: o conteúdo se move mais rápido ou mais devagar que o cursor; o erro cresce quanto mais longe do ponto inicial.
- O offset some quando a janela está num tamanho que faz `--scale ≈ 1` e reaparece em qualquer outro tamanho. Esse é o sinal claro de escala não compensada.

## Causa

- `clientX`/`clientY` estão em **pixels reais de tela**.
- O conteúdo vive dentro de `transform: scale(S)`, então **1 px de layout = S px de tela**.
- `getBoundingClientRect()` retorna o retângulo **já escalado** (pós-transform).
- Fazer `clientX - rect.left` e tratar isso como pixel de layout, ou dividir só pelo seu zoom interno, **ignora S** e erra por esse fator.

## Solução correta

### SVG (caminho preferido)

Use a matriz de tela do próprio grupo transformado. `getScreenCTM()` já embute **escala da plataforma + layout do SVG + seu pan + seu zoom**; basta inverter:

```ts
const grupoRef = useRef<SVGGElement | null>(null);
// <g ref={grupoRef} transform={`translate(${vista.x},${vista.y}) scale(${vista.z})`}> ... </g>

const cursorMundo = (clientX: number, clientY: number) => {
    const ctm = grupoRef.current?.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    return { x: inv.a * clientX + inv.c * clientY + inv.e, y: inv.b * clientX + inv.d * clientY + inv.f };
};
```

Para converter um **delta de pixel de tela** em delta do espaço de pan (que não passa pelo `<g>`), divida pela escala do SVG raiz:

```ts
const escalaTela = () => svgRef.current?.getScreenCTM()?.a ?? 1; // a = escala da plataforma no raiz
// pan: vista.x += (clientX - sx) / escalaTela();
```

Para arrastar elementos, trabalhe sempre em coordenadas de mundo: guarde o **offset de pega** no mousedown (`pos - cursorMundo(start)`) e no mousemove faça `cursorMundo(atual) + offset`. Nada de dividir por `vista.z` na mão.

### DOM/HTML (sem SVG)

Calcule a escala efetiva pelo próprio elemento e divida tudo por ela:

```ts
const rect = el.getBoundingClientRect();
const escala = rect.width / el.offsetWidth; // = S (ou leia getComputedStyle(document.documentElement).getPropertyValue('--scale'))
const localX = (clientX - rect.left) / escala;
const deltaLayout = (clientX - clientXAnterior) / escala;
```

## Proibido

- Tratar `clientX - rect.left` como pixel de layout/conteúdo.
- Dividir o delta de ponteiro apenas pelo zoom interno do componente, esquecendo `--scale`.
- Usar `offsetX`/`offsetY`/`layerX` para coordenada de conteúdo (mudam de referência por alvo e não compõem com a escala).
- Posicionar overlay HTML por `getBoundingClientRect` (tela) misturado com conteúdo que vive em espaço de layout — escolha um espaço só e seja consistente (dentro do ConteinerEscalavel, prefira o espaço de layout).

## Validação

Teste sempre com a janela em **tamanhos diferentes** (forçando `--scale ≠ 1`) e **fora do centro**:

- arrastar um elemento: ele deve ficar grudado no cursor o tempo todo;
- desenhar a área de seleção: o canto do retângulo deve coincidir com o ponteiro;
- clicar para selecionar: o hit-test deve bater no que está sob o cursor.

Se algum desses descola, a escala não está sendo compensada.

## Referências no código

- Fonte da escala: `src/componentes/ElementosVisuais/ConteinerEscalavel/ConteinerEscalavel.tsx` (define `--scale` e `--vvh`).
- Exemplo canônico já corrigido: `cursorMundo`/`escalaTela` na SPA do Fluxograma do Painel do Medo (`src/conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Fluxograma/`).
