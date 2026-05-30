import type { TipoModoEditor3D } from '../modos/editor3D.modo.tipos';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';
import type { ModoOperacaoEditor3D, TipoSelecaoEdicaoEditor3D } from '../modoOperacao/editor3D.modoOperacao.tipos';
import { modosVisualizacaoViewportEditor3D, type ModoVisualizacaoViewportEditor3D } from '../viewport/editor3D.viewport.tipos';

export type CategoriaComandoAreaInterativa3D = 'Modo' | 'Visualizacao' | 'Atalho' | 'Mouse' | 'Viewport' | 'Sala de Jogo';
export type BotaoMouseComandoAreaInterativa3D = 0 | 1 | 2;
export type ModificadorComandoAreaInterativa3D = boolean | null;
export type DirecaoMovimentoSala3DComandoAreaInterativa3D = 'FRENTE' | 'TRAS' | 'DIREITA' | 'ESQUERDA';
export type IconeComandoAreaInterativa3D = 'arrow-up' | 'axis' | 'backspace' | 'check' | 'compass' | 'cursor' | 'dolly' | 'edge' | 'enter' | 'escape' | 'face' | 'gizmo' | 'keyboard' | 'move' | 'mouse-pointer' | 'number' | 'orbit' | 'plus' | 'rotate' | 'scale' | 'selection' | 'tab' | 'trash' | 'vertex';

export interface AtalhoTecladoComandoAreaInterativa3D {
    readonly teclas: readonly string[];
    readonly shift: ModificadorComandoAreaInterativa3D;
    readonly ctrlOuMeta: ModificadorComandoAreaInterativa3D;
    readonly alt: ModificadorComandoAreaInterativa3D;
}

export interface GestoMouseComandoAreaInterativa3D {
    readonly botao: BotaoMouseComandoAreaInterativa3D;
    readonly shift: ModificadorComandoAreaInterativa3D;
    readonly ctrlOuMeta: ModificadorComandoAreaInterativa3D;
    readonly alt: ModificadorComandoAreaInterativa3D;
}

export interface EventoTecladoComandoAreaInterativa3D {
    readonly key: string;
    readonly shiftKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly altKey: boolean;
}

export interface EventoMouseComandoAreaInterativa3D {
    readonly button: number;
    readonly shiftKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly altKey: boolean;
}

export interface ComandoAreaInterativa3D {
    readonly id: string;
    readonly categoria: CategoriaComandoAreaInterativa3D;
    readonly nome: string;
    readonly descricao: string;
    readonly atalho: string | null;
    readonly icone: IconeComandoAreaInterativa3D;
    readonly tituloToolbar?: string;
    readonly subtituloToolbar?: string;
    readonly iconeToolbar?: IconeComandoAreaInterativa3D;
    readonly teclado?: AtalhoTecladoComandoAreaInterativa3D;
    readonly mouse?: GestoMouseComandoAreaInterativa3D;
    readonly rodaMouse?: boolean;
}

export interface EstadoToolbarComandoAreaInterativa3D {
    readonly titulo: string;
    readonly subtitulo: string | null;
    readonly icone: IconeComandoAreaInterativa3D;
    readonly atalho: string | null;
}

interface CategoriaListaComandosAreaInterativa3D {
    readonly key: CategoriaComandoAreaInterativa3D;
    readonly titulo: string;
}

const teclasMovimentoSala3DComandoAreaInterativa3D = ['w', 'a', 's', 'd'] as const;
const teclasEntradaNumericaRotateComandoAreaInterativa3D = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', '.', ','] as const;

const direcaoMovimentoSala3DPorTeclaComandoAreaInterativa3D: Record<typeof teclasMovimentoSala3DComandoAreaInterativa3D[number], DirecaoMovimentoSala3DComandoAreaInterativa3D> = {
    w: 'FRENTE',
    a: 'ESQUERDA',
    s: 'TRAS',
    d: 'DIREITA'
};

// Todo Modo e Atalho nasce aqui.
// Nao registre novo comportamento acionavel da area interativa em listeners sem declarar um ComandoAreaInterativa3D neste arquivo.
const comandosAreaInterativa3D = [
    {
        id: 'selecionar',
        categoria: 'Modo',
        nome: 'Movimentacao',
        descricao: 'Modo base para selecionar por clique e navegar a camera pela cena.',
        atalho: null,
        icone: 'move',
        subtituloToolbar: 'Cursor: Move'
    },
    {
        id: 'shift-modo-selecionar',
        categoria: 'Modo',
        nome: 'Selecionar',
        descricao: 'Modo temporario para selecao multipla e area de selecao enquanto Shift esta pressionado.',
        atalho: 'Hold Shift',
        icone: 'cursor',
        subtituloToolbar: 'Cursor: Default',
        teclado: { teclas: ['shift'], shift: true, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'mover',
        categoria: 'Modo',
        nome: 'Mover',
        descricao: 'Transforma a selecao por deslocamento no espaco 3D.',
        atalho: 'G',
        icone: 'move',
        teclado: { teclas: ['g'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'rotacionar',
        categoria: 'Modo',
        nome: 'Rotacionar',
        descricao: 'Transforma a selecao por rotacao livre ou numerica.',
        atalho: 'R',
        icone: 'rotate',
        teclado: { teclas: ['r'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'escalar',
        categoria: 'Modo',
        nome: 'Escalar',
        descricao: 'Transforma a selecao por escala uniforme.',
        atalho: 'S',
        icone: 'scale',
        teclado: { teclas: ['s'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'tab-modo-operacao',
        categoria: 'Atalho',
        nome: 'Alternar Objeto/Edicao',
        descricao: 'Alterna entre manipulacao de objeto e edicao de faces.',
        atalho: 'Tab',
        icone: 'tab',
        teclado: { teclas: ['tab'], shift: false, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'shift-a-add-mesh',
        categoria: 'Atalho',
        nome: 'Adicionar mesh',
        descricao: 'Abre o menu de criacao de primitivas e objetos de cena.',
        atalho: 'Shift + A',
        icone: 'plus',
        teclado: { teclas: ['a'], shift: true, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'ctrl-a-apply',
        categoria: 'Atalho',
        nome: 'Aplicar transform',
        descricao: 'Aplica posicao, rotacao e escala atuais no objeto selecionado.',
        atalho: 'Ctrl/Cmd + A',
        icone: 'check',
        teclado: { teclas: ['a'], shift: false, ctrlOuMeta: true, alt: false }
    },
    {
        id: 'r-rotacionar-livre',
        categoria: 'Atalho',
        nome: 'Rotacao livre',
        descricao: 'No modo rotacao, alterna para rotacao livre sem eixo travado.',
        atalho: 'R',
        icone: 'rotate',
        teclado: { teclas: ['r'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'xyz-eixo',
        categoria: 'Atalho',
        nome: 'Travar eixo',
        descricao: 'Trava transformacoes e rotacoes numericas nos eixos X, Y ou Z.',
        atalho: 'X / Y / Z',
        icone: 'axis',
        teclado: { teclas: ['x', 'y', 'z'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'enter-rotacao-eixo',
        categoria: 'Atalho',
        nome: 'Confirmar rotacao numerica',
        descricao: 'Confirma a rotacao digitada para o eixo ativo.',
        atalho: 'Enter',
        icone: 'enter',
        teclado: { teclas: ['enter'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'escape-rotacao-numerica',
        categoria: 'Atalho',
        nome: 'Cancelar rotacao numerica',
        descricao: 'Cancela a entrada numerica de rotacao e restaura o valor anterior.',
        atalho: 'Esc',
        icone: 'escape',
        teclado: { teclas: ['escape'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'backspace-rotacao-numerica',
        categoria: 'Atalho',
        nome: 'Apagar valor numerico',
        descricao: 'Remove o ultimo caractere digitado no valor de rotacao.',
        atalho: 'Backspace',
        icone: 'backspace',
        teclado: { teclas: ['backspace'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'valor-rotacao-numerica',
        categoria: 'Atalho',
        nome: 'Digitar rotacao numerica',
        descricao: 'Insere valores numericos para rotacionar no eixo ativo.',
        atalho: '0-9 / - / + / . / ,',
        icone: 'number',
        teclado: { teclas: teclasEntradaNumericaRotateComandoAreaInterativa3D, shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'delete-objetos',
        categoria: 'Atalho',
        nome: 'Remover selecao',
        descricao: 'Remove objetos selecionados ou faces selecionadas em modo edicao.',
        atalho: 'Delete / Backspace',
        icone: 'trash',
        teclado: { teclas: ['delete', 'backspace'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'i-inset-faces',
        categoria: 'Atalho',
        nome: 'Inset Faces',
        descricao: 'Inicia um inset interativo na face selecionada em Edit Mode com Selecao de Face ativa.',
        atalho: 'I',
        icone: 'face',
        tituloToolbar: 'Inset Faces',
        subtituloToolbar: 'Ajustando tamanho',
        iconeToolbar: 'face',
        teclado: { teclas: ['i'], shift: false, ctrlOuMeta: false, alt: false }
    },
    {
        id: '1-selecao-vertice-edicao',
        categoria: 'Modo',
        nome: 'Selecao de Vertice',
        descricao: 'No Edit Mode, seleciona vertices e permite puxar o vertice clicado.',
        atalho: '1',
        icone: 'vertex',
        tituloToolbar: 'Edit Mode',
        subtituloToolbar: 'Selecao de Vertice',
        iconeToolbar: 'vertex',
        teclado: { teclas: ['1'], shift: false, ctrlOuMeta: false, alt: false }
    },
    {
        id: '2-selecao-aresta-edicao',
        categoria: 'Modo',
        nome: 'Selecao de Aresta',
        descricao: 'No Edit Mode, seleciona arestas e permite puxar a aresta clicada.',
        atalho: '2',
        icone: 'edge',
        tituloToolbar: 'Edit Mode',
        subtituloToolbar: 'Selecao de Aresta',
        iconeToolbar: 'edge',
        teclado: { teclas: ['2'], shift: false, ctrlOuMeta: false, alt: false }
    },
    {
        id: '3-selecao-face-edicao',
        categoria: 'Modo',
        nome: 'Selecao de Face',
        descricao: 'No Edit Mode, seleciona faces e permite puxar a face clicada.',
        atalho: '3',
        icone: 'face',
        tituloToolbar: 'Edit Mode',
        subtituloToolbar: 'Selecao de Face',
        iconeToolbar: 'face',
        teclado: { teclas: ['3'], shift: false, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'alt-1-visualizacao-solido',
        categoria: 'Visualizacao',
        nome: 'Solido',
        descricao: 'Exibe objetos com faces preenchidas, volume legivel e aparencia neutra para edicao e inspecao de forma.',
        atalho: 'Alt + 1',
        icone: 'gizmo',
        teclado: { teclas: ['1'], shift: false, ctrlOuMeta: false, alt: true }
    },
    {
        id: 'alt-2-visualizacao-estrutura',
        categoria: 'Visualizacao',
        nome: 'Estrutura',
        descricao: 'Exibe objetos como estrutura de malha e arestas para visualizar topologia, divisao de faces e densidade.',
        atalho: 'Alt + 2',
        icone: 'edge',
        teclado: { teclas: ['2'], shift: false, ctrlOuMeta: false, alt: true }
    },
    {
        id: 'alt-3-visualizacao-materiais',
        categoria: 'Visualizacao',
        nome: 'Materiais',
        descricao: 'Exibe materiais, cores e texturas aplicadas com iluminacao de preview controlada pelo editor.',
        atalho: 'Alt + 3',
        icone: 'face',
        teclado: { teclas: ['3'], shift: false, ctrlOuMeta: false, alt: true }
    },
    {
        id: 'alt-4-visualizacao-renderizado',
        categoria: 'Visualizacao',
        nome: 'Renderizado',
        descricao: 'Exibe a cena o mais proximo possivel do resultado final usando os recursos visuais disponiveis no viewport.',
        atalho: 'Alt + 4',
        icone: 'check',
        teclado: { teclas: ['4'], shift: false, ctrlOuMeta: false, alt: true }
    },
    {
        id: 'alt-x-visualizacao-xray',
        categoria: 'Visualizacao',
        nome: 'X-Ray',
        descricao: 'Alterna transparencia do viewport nas visualizacoes Solido e Estrutura para enxergar elementos ocultos.',
        atalho: 'Alt + X',
        icone: 'gizmo',
        teclado: { teclas: ['x'], shift: false, ctrlOuMeta: false, alt: true }
    },
    {
        id: 'enter-confirma-inset-face',
        categoria: 'Atalho',
        nome: 'Confirmar Inset Faces',
        descricao: 'Confirma o inset interativo em andamento.',
        atalho: 'Enter',
        icone: 'enter',
        teclado: { teclas: ['enter'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'escape-cancela-inset-face',
        categoria: 'Atalho',
        nome: 'Cancelar Inset Faces',
        descricao: 'Cancela o inset interativo e restaura a face original.',
        atalho: 'Esc',
        icone: 'escape',
        teclado: { teclas: ['escape'], shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'rmb-add-mesh',
        categoria: 'Mouse',
        nome: 'Menu de criacao',
        descricao: 'Abre o menu contextual para adicionar elementos na cena.',
        atalho: 'Botao direito fora do canvas',
        icone: 'mouse-pointer',
        mouse: { botao: 2, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'lmb-seleciona-elemento',
        categoria: 'Mouse',
        nome: 'Selecionar elemento',
        descricao: 'Seleciona o objeto ou o elemento editavel clicado sem arrastar a camera.',
        atalho: 'Clique esquerdo',
        icone: 'move',
        mouse: { botao: 0, shift: false, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'lmb-arrasta-selecao-edicao',
        categoria: 'Mouse',
        nome: 'Puxar selecao de edicao',
        descricao: 'No Edit Mode, arrasta o vertice, aresta ou face clicada para editar a geometria.',
        atalho: 'Clique esquerdo + arrastar em Vertice/Aresta/Face',
        icone: 'move',
        mouse: { botao: 0, shift: false, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'shift-lmb-seleciona-elemento',
        categoria: 'Mouse',
        nome: 'Selecionar multiplo',
        descricao: 'Adiciona o elemento clicado a selecao atual no modo Selecionar.',
        atalho: 'Shift + clique esquerdo',
        icone: 'cursor',
        tituloToolbar: 'Selecionar',
        subtituloToolbar: 'Cursor: Default',
        iconeToolbar: 'cursor',
        mouse: { botao: 0, shift: true, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'shift-lmb-area-selecao',
        categoria: 'Mouse',
        nome: 'Area de selecao',
        descricao: 'Arrasta uma area para selecionar todos os elementos dentro dela.',
        atalho: 'Shift + clique esquerdo + arrastar',
        icone: 'selection',
        tituloToolbar: 'Selecionar',
        subtituloToolbar: 'Area de Selecao',
        iconeToolbar: 'cursor',
        mouse: { botao: 0, shift: true, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'lmb-confirma-transform',
        categoria: 'Mouse',
        nome: 'Confirmar transform',
        descricao: 'Confirma a transformacao em andamento.',
        atalho: 'Clique esquerdo',
        icone: 'mouse-pointer',
        mouse: { botao: 0, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'lmb-confirma-inset-face',
        categoria: 'Mouse',
        nome: 'Confirmar Inset Faces',
        descricao: 'Confirma o inset interativo em andamento.',
        atalho: 'Clique esquerdo',
        icone: 'mouse-pointer',
        mouse: { botao: 0, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'mouse-ajusta-inset-face',
        categoria: 'Mouse',
        nome: 'Ajustar Inset Faces',
        descricao: 'Move o mouse apos iniciar Inset Faces para aumentar ou diminuir a face interna antes de confirmar.',
        atalho: 'Mover mouse apos I',
        icone: 'face'
    },
    {
        id: 'rmb-cancela-inset-face',
        categoria: 'Mouse',
        nome: 'Cancelar Inset Faces',
        descricao: 'Cancela o inset interativo em andamento.',
        atalho: 'Botao direito',
        icone: 'mouse-pointer',
        mouse: { botao: 2, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'rmb-cancela-transform',
        categoria: 'Mouse',
        nome: 'Cancelar transform',
        descricao: 'Cancela a transformacao em andamento.',
        atalho: 'Botao direito',
        icone: 'mouse-pointer',
        mouse: { botao: 2, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'lmb-orbita-camera',
        categoria: 'Viewport',
        nome: 'Orbitar camera',
        descricao: 'Gira a camera do editor ao redor do alvo da viewport.',
        atalho: 'Clique esquerdo + arrastar',
        icone: 'orbit',
        tituloToolbar: 'Movimentacao',
        subtituloToolbar: 'Rotacionando',
        iconeToolbar: 'move',
        mouse: { botao: 0, shift: false, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'rmb-pan-camera',
        categoria: 'Viewport',
        nome: 'Mover camera',
        descricao: 'Move a camera no X e Y da propria visao sem alterar a rotacao.',
        atalho: 'Botao direito + arrastar',
        icone: 'move',
        tituloToolbar: 'Movimentacao',
        subtituloToolbar: 'Movendo',
        iconeToolbar: 'move',
        mouse: { botao: 2, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'shift-mmb-pan-camera',
        categoria: 'Viewport',
        nome: 'Pan da camera',
        descricao: 'Move lateralmente o alvo da camera da viewport.',
        atalho: 'Shift + botao do meio',
        icone: 'move',
        tituloToolbar: 'Movimentacao',
        subtituloToolbar: 'Movendo',
        iconeToolbar: 'move',
        mouse: { botao: 1, shift: true, ctrlOuMeta: null, alt: false }
    },
    {
        id: 'mmb-dolly-camera',
        categoria: 'Viewport',
        nome: 'Avancar/recuar camera',
        descricao: 'Move a camera para frente ou para tras no eixo de profundidade.',
        atalho: 'Botao do meio + arrastar',
        icone: 'dolly',
        tituloToolbar: 'Movimentacao',
        subtituloToolbar: 'Profundidade',
        iconeToolbar: 'move',
        mouse: { botao: 1, shift: false, ctrlOuMeta: null, alt: false }
    },
    {
        id: 'scroll-dolly-camera',
        categoria: 'Viewport',
        nome: 'Avancar/recuar com scroll',
        descricao: 'Move a camera para frente ou para tras com o scroll do mouse.',
        atalho: 'Scroll',
        icone: 'dolly',
        rodaMouse: true
    },
    {
        id: 'alt-mmb-snap-orbital',
        categoria: 'Viewport',
        nome: 'Snap orbital',
        descricao: 'Arrasta a direcao de snap para encaixar a camera em vistas ortogonais.',
        atalho: 'Alt + botao do meio',
        icone: 'compass',
        tituloToolbar: 'Movimentacao',
        subtituloToolbar: 'Ajustando vista',
        iconeToolbar: 'move',
        mouse: { botao: 1, shift: null, ctrlOuMeta: null, alt: true }
    },
    {
        id: 'gizmo-viewport',
        categoria: 'Viewport',
        nome: 'Gizmo de viewport',
        descricao: 'Clica nos eixos do gizmo para mudar a orientacao da camera.',
        atalho: 'Clique no gizmo',
        icone: 'gizmo',
        mouse: { botao: 0, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'wasd-sala-3d',
        categoria: 'Sala de Jogo',
        nome: 'Mover jogador',
        descricao: 'Move o avatar pelo ambiente 3D da Sala de Jogo.',
        atalho: 'W / A / S / D',
        icone: 'keyboard',
        teclado: { teclas: teclasMovimentoSala3DComandoAreaInterativa3D, shift: null, ctrlOuMeta: false, alt: false }
    },
    {
        id: 'mouse-sala-3d',
        categoria: 'Sala de Jogo',
        nome: 'Olhar ao redor',
        descricao: 'Ativa o controle de mouse e controla a direcao da camera em primeira pessoa.',
        atalho: 'Clique esquerdo + mouse',
        icone: 'mouse-pointer',
        mouse: { botao: 0, shift: null, ctrlOuMeta: null, alt: null }
    },
    {
        id: 'espaco-sala-3d',
        categoria: 'Sala de Jogo',
        nome: 'Pular',
        descricao: 'Aplica impulso vertical no jogador quando houver suporte de fisica.',
        atalho: 'Espaco',
        icone: 'arrow-up',
        teclado: { teclas: [' '], shift: null, ctrlOuMeta: false, alt: false }
    }
] as const satisfies readonly ComandoAreaInterativa3D[];

export type IdComandoAreaInterativa3D = typeof comandosAreaInterativa3D[number]['id'];

export const categoriasComandosAreaInterativa3D = [
    { key: 'Modo', titulo: 'Modos' },
    { key: 'Visualizacao', titulo: 'Visualizacao do Viewport' },
    { key: 'Atalho', titulo: 'Atalhos' },
    { key: 'Mouse', titulo: 'Mouse' },
    { key: 'Viewport', titulo: 'Viewport' },
    { key: 'Sala de Jogo', titulo: 'Sala de Jogo' }
] as const satisfies readonly CategoriaListaComandosAreaInterativa3D[];

const comandoPorModoEditor3D: Record<TipoModoEditor3D, IdComandoAreaInterativa3D> = {
    NENHUM: 'selecionar',
    GRAB: 'mover',
    ROTATE: 'rotacionar',
    SCALE: 'escalar'
};

const comandoPorFerramentaMouseEditor3D: Record<FerramentaMouseEditor3D, IdComandoAreaInterativa3D> = {
    SELECIONAR: 'selecionar',
    SELECIONAR_MULTIPLO: 'shift-modo-selecionar',
    AREA_SELECAO: 'shift-lmb-area-selecao',
    ROTACIONAR: 'lmb-orbita-camera',
    PAN: 'rmb-pan-camera',
    DOLLY: 'mmb-dolly-camera',
    ROTACIONAR_RAPIDO: 'alt-mmb-snap-orbital'
};

const comandoPorTipoSelecaoEdicaoEditor3D: Record<TipoSelecaoEdicaoEditor3D, IdComandoAreaInterativa3D> = {
    VERTICE: '1-selecao-vertice-edicao',
    ARESTA: '2-selecao-aresta-edicao',
    FACE: '3-selecao-face-edicao'
};

const comandoPorModoVisualizacaoViewportEditor3D: Record<ModoVisualizacaoViewportEditor3D, IdComandoAreaInterativa3D> = {
    SOLIDO: 'alt-1-visualizacao-solido',
    ESTRUTURA: 'alt-2-visualizacao-estrutura',
    MATERIAIS: 'alt-3-visualizacao-materiais',
    RENDERIZADO: 'alt-4-visualizacao-renderizado'
};

export function obtemComandosAreaInterativa3D(): readonly ComandoAreaInterativa3D[] {
    return comandosAreaInterativa3D;
}

export function obtemComandosAreaInterativa3DPorCategoria(categoria: CategoriaComandoAreaInterativa3D): readonly ComandoAreaInterativa3D[] {
    return comandosAreaInterativa3D.filter(comando => comando.categoria === categoria);
}

export function obtemComandoAreaInterativa3D(id: IdComandoAreaInterativa3D): ComandoAreaInterativa3D {
    const comando = comandosAreaInterativa3D.find(comandoAtual => comandoAtual.id === id);
    if (comando === undefined) {
        throw new Error(`Comando da area interativa nao cadastrado: ${id}`);
    }

    return comando;
}

export function obtemComandoInteracaoAtualEditor3D(tipoModo: TipoModoEditor3D, ferramentaMouse: FerramentaMouseEditor3D): ComandoAreaInterativa3D {
    const idComando = tipoModo === 'NENHUM' ? comandoPorFerramentaMouseEditor3D[ferramentaMouse] : comandoPorModoEditor3D[tipoModo];
    return obtemComandoAreaInterativa3D(idComando);
}

export function obtemEstadoToolbarInteracaoAtualEditor3D(tipoModo: TipoModoEditor3D, ferramentaMouse: FerramentaMouseEditor3D, modoOperacao: ModoOperacaoEditor3D, tipoSelecaoEdicao: TipoSelecaoEdicaoEditor3D, insetFaceAtivo: boolean): EstadoToolbarComandoAreaInterativa3D {
    const comando = insetFaceAtivo ? obtemComandoAreaInterativa3D('i-inset-faces') : tipoModo === 'NENHUM' && ferramentaMouse === 'SELECIONAR' && modoOperacao === 'EDICAO' ? obtemComandoAreaInterativa3D(comandoPorTipoSelecaoEdicaoEditor3D[tipoSelecaoEdicao]) : obtemComandoInteracaoAtualEditor3D(tipoModo, ferramentaMouse);

    return { titulo: comando.tituloToolbar ?? comando.nome, subtitulo: comando.subtituloToolbar ?? null, icone: comando.iconeToolbar ?? comando.icone, atalho: comando.atalho };
}

export function obtemComandoModoVisualizacaoViewportEditor3D(modo: ModoVisualizacaoViewportEditor3D): ComandoAreaInterativa3D {
    return obtemComandoAreaInterativa3D(comandoPorModoVisualizacaoViewportEditor3D[modo]);
}

export function obtemModoVisualizacaoViewportPorAtalhoEditor3D(event: EventoTecladoComandoAreaInterativa3D): ModoVisualizacaoViewportEditor3D | null {
    for (const modo of modosVisualizacaoViewportEditor3D) {
        if (comandoTecladoAreaInterativa3DEstaAtivo(comandoPorModoVisualizacaoViewportEditor3D[modo], event)) return modo;
    }

    return null;
}

export function obtemTextoComandosAreaInterativa3D(): string {
    return categoriasComandosAreaInterativa3D.map(categoria => {
        const comandos = obtemComandosAreaInterativa3DPorCategoria(categoria.key);
        const linhas = comandos.map(comando => `- ${comando.nome}${comando.atalho === null ? '' : ` (${comando.atalho})`}: ${comando.descricao}`);

        return [`${categoria.titulo}:`, ...linhas].join('\n');
    }).join('\n\n');
}

export function obtemTeclasComandoTecladoAreaInterativa3D(id: IdComandoAreaInterativa3D): readonly string[] {
    const comando = obtemComandoAreaInterativa3D(id);
    return comando.teclado?.teclas ?? [];
}

export function teclaMovimentoSala3DComandoAreaInterativa3DEstaAtiva(tecla: string): boolean {
    return obtemDirecaoMovimentoSala3DComandoAreaInterativa3D(tecla) !== null;
}

export function obtemDirecaoMovimentoSala3DComandoAreaInterativa3D(tecla: string): DirecaoMovimentoSala3DComandoAreaInterativa3D | null {
    const teclaNormalizada = tecla.toLowerCase();

    if (!teclaMovimentoSala3DComandoAreaInterativa3DEstaRegistrada(teclaNormalizada)) {
        return null;
    }

    return direcaoMovimentoSala3DPorTeclaComandoAreaInterativa3D[teclaNormalizada];
}

export function comandoTecladoAreaInterativa3DEstaAtivo(id: IdComandoAreaInterativa3D, event: EventoTecladoComandoAreaInterativa3D): boolean {
    const comando = obtemComandoAreaInterativa3D(id);

    if (comando.teclado === undefined) {
        return false;
    }

    return comando.teclado.teclas.includes(event.key.toLowerCase()) && modificadorComandoAreaInterativa3DConfere(comando.teclado.shift, event.shiftKey) && modificadorComandoAreaInterativa3DConfere(comando.teclado.ctrlOuMeta, event.ctrlKey || event.metaKey) && modificadorComandoAreaInterativa3DConfere(comando.teclado.alt, event.altKey);
}

export function comandoTecladoAreaInterativa3DUsaTecla(id: IdComandoAreaInterativa3D, tecla: string): boolean {
    const comando = obtemComandoAreaInterativa3D(id);

    if (comando.teclado === undefined) {
        return false;
    }

    return comando.teclado.teclas.includes(tecla.toLowerCase());
}

export function comandoMouseAreaInterativa3DEstaAtivo(id: IdComandoAreaInterativa3D, event: EventoMouseComandoAreaInterativa3D): boolean {
    const comando = obtemComandoAreaInterativa3D(id);

    if (comando.mouse === undefined) {
        return false;
    }

    return comando.mouse.botao === event.button && modificadorComandoAreaInterativa3DConfere(comando.mouse.shift, event.shiftKey) && modificadorComandoAreaInterativa3DConfere(comando.mouse.ctrlOuMeta, event.ctrlKey || event.metaKey) && modificadorComandoAreaInterativa3DConfere(comando.mouse.alt, event.altKey);
}

export function comandoRodaMouseAreaInterativa3DEstaAtivo(id: IdComandoAreaInterativa3D): boolean {
    return obtemComandoAreaInterativa3D(id).rodaMouse === true;
}

function modificadorComandoAreaInterativa3DConfere(esperado: ModificadorComandoAreaInterativa3D, atual: boolean): boolean {
    return esperado === null || esperado === atual;
}

function teclaMovimentoSala3DComandoAreaInterativa3DEstaRegistrada(tecla: string): tecla is typeof teclasMovimentoSala3DComandoAreaInterativa3D[number] {
    return teclasMovimentoSala3DComandoAreaInterativa3D.some(teclaComando => teclaComando === tecla);
}
