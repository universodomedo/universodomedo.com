export type ModoTransformEditor3D = 'translate' | 'rotate' | 'scale';

export const ROTULO_MODO_TRANSFORM_EDITOR3D: Record<ModoTransformEditor3D, string> = { translate: 'Mover', rotate: 'Rotacionar', scale: 'Escalar' };

export type CampoTransformEditor3D = 'posicao' | 'rotacao' | 'escala';

// Seleção de nós de primeira classe reusa o estado único `idSelecionado` (não são objetos com id próprio). Origem usa -1; câmera usa -2; título da Capa de Arte usa -3; corpo do Personagem usa -4.
export const SELECAO_CAMERA_EDITOR3D = -2;
export const SELECAO_TITULO_CAPA_ARTE_EDITOR3D = -3;
export const SELECAO_CORPO_PERSONAGEM_EDITOR3D = -4;
