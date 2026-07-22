// Modo (ferramenta) ativo do Editor. 'select' é o estado base (só clica/seleciona, sem gizmo); os demais ativam o gizmo de transform.
export type ModoTransformEditor3D = 'select' | 'translate' | 'rotate' | 'scale';

export const ROTULO_MODO_TRANSFORM_EDITOR3D: Record<ModoTransformEditor3D, string> = { select: 'Selecionar', translate: 'Mover', rotate: 'Rotacionar', scale: 'Escalar' };

// Cursor de rotação DESENHADO: seta circular branca com contorno escuro (visível sobre o viewport escuro E objetos claros); hotspot no centro.
const svgCursorRotacaoEditor3D = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5A7 7 0 1 1 5 12M3.5 14.6 5 12 6.5 14.6" stroke="black" stroke-opacity="0.5" stroke-width="4.2"/><path d="M12 5A7 7 0 1 1 5 12M3.5 14.6 5 12 6.5 14.6" stroke="white" stroke-width="2.2"/></g></svg>';
export const CURSOR_ROTACAO_EDITOR3D = `url("data:image/svg+xml,${encodeURIComponent(svgCursorRotacaoEditor3D)}") 13 13, auto`;

// Cursor que REPRESENTA cada modo (o quadro do indicador e o viewport aplicam). Rotate = ícone de rotação desenhado; select/move/scale = cursores CSS nativos (translate/scale ainda provisórios).
export const CURSOR_MODO_TRANSFORM_EDITOR3D: Record<ModoTransformEditor3D, string> = { select: 'default', translate: 'move', rotate: CURSOR_ROTACAO_EDITOR3D, scale: 'nwse-resize' };

export type CampoTransformEditor3D = 'posicao' | 'rotacao' | 'escala';

// Cores canônicas dos eixos (X vermelho, Y verde, Z azul) — as mesmas do gizmo de navegação e do painel Transform.
export const CORES_EIXOS_EDITOR3D: readonly [string, string, string] = ['#c0392b', '#27ae60', '#2980b9'];

// Travas de eixo do gesto (mecânica de lock do painel Transform): eixo travado NÃO é alterado pela manipulação direta
// (mover/rotacionar/escalar). Estado do EDITOR (não do projeto): não serializa; a digitação no campo numérico segue livre.
export type TravasTransformEditor3D = Record<CampoTransformEditor3D, readonly [boolean, boolean, boolean]>;
export const TRAVAS_TRANSFORM_INICIAL_EDITOR3D: TravasTransformEditor3D = { posicao: [false, false, false], rotacao: [false, false, false], escala: [false, false, false] };

// Grupo do painel que o modo atual edita (barrinha de cor acesa nessas linhas). 'select' não edita nenhum.
export const CAMPO_DO_MODO_TRANSFORM_EDITOR3D: Record<ModoTransformEditor3D, CampoTransformEditor3D | null> = { select: null, translate: 'posicao', rotate: 'rotacao', scale: 'escala' };

// Seleção de nós de primeira classe reusa o estado único `idSelecionado` (não são objetos com id próprio). Origem usa -1; câmera usa -2; título da Capa de Arte usa -3; corpo do Personagem usa -4.
export const SELECAO_CAMERA_EDITOR3D = -2;
export const SELECAO_TITULO_CAPA_ARTE_EDITOR3D = -3;
export const SELECAO_CORPO_PERSONAGEM_EDITOR3D = -4;
