export type ModoTransformEditor3D = 'translate' | 'rotate' | 'scale';

export const ROTULO_MODO_TRANSFORM_EDITOR3D: Record<ModoTransformEditor3D, string> = { translate: 'Mover', rotate: 'Rotacionar', scale: 'Escalar' };

export type CampoTransformEditor3D = 'posicao' | 'rotacao' | 'escala';

// Seleção da câmera-output reusa o estado único `idSelecionado` (a câmera não é um objeto com id próprio). Origem usa -1; câmera usa -2; título da Capa de Arte usa -3.
export const SELECAO_CAMERA_EDITOR3D = -2;
export const SELECAO_TITULO_CAPA_ARTE_EDITOR3D = -3;
