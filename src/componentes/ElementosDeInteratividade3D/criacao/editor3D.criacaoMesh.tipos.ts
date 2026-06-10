export type PosicaoMenuCriacaoMeshEditor3D = PosicaoPontualMenuCriacaoMeshEditor3D | PosicaoInferiorEsquerdaMenuCriacaoMeshEditor3D;

export interface PosicaoPontualMenuCriacaoMeshEditor3D {
    readonly tipo: 'PONTO';
    readonly x: number;
    readonly y: number;
};

export interface PosicaoInferiorEsquerdaMenuCriacaoMeshEditor3D {
    readonly tipo: 'INFERIOR_ESQUERDO';
};