// SSOT do esquema de controle de câmera do jogo 3D (produto principal).
// Definição semântica e agnóstica de biblioteca: descreve INTENÇÃO (qual botão faz o quê, limites),
// não a implementação. Qualquer visão 3D do jogo deve consumir um perfil daqui, nunca redefinir controles ad-hoc.

export type AcaoBotaoCameraJogo3D = 'rotacionar' | 'pan' | 'zoom' | 'nenhum';

export interface PerfilControleCameraJogo3D {
    readonly botaoEsquerdo: AcaoBotaoCameraJogo3D;
    readonly botaoMeio: AcaoBotaoCameraJogo3D;
    readonly botaoDireito: AcaoBotaoCameraJogo3D;
    readonly rodaZoom: boolean;
    readonly amortecimento: boolean;
    readonly anguloPolarMinFator: number;
    readonly anguloPolarMaxFator: number;
};

// Perfil tático (estilo XCOM): botão esquerdo reservado para seleção, meio rotaciona, direito faz pan, roda dá zoom.
export const PERFIL_CAMERA_TATICA: PerfilControleCameraJogo3D = {
    botaoEsquerdo: 'nenhum',
    botaoMeio: 'rotacionar',
    botaoDireito: 'pan',
    rodaZoom: true,
    amortecimento: true,
    anguloPolarMinFator: 0.15,
    anguloPolarMaxFator: 0.46,
};
