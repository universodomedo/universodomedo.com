import type { Vetor3 } from '../editor/editor3D.tipos';

export type ModoDesenhoEditor3D = 'PONTOS' | 'LINHAS' | 'TRIANGULOS';

export interface GeometriaEditor3D {
    readonly vertices: Float32Array;
    readonly normais: Float32Array;
    readonly quantidadeVertices: number;
    readonly modo: ModoDesenhoEditor3D;
};

export interface GuiaEditor3D {
    readonly geometria: GeometriaEditor3D;
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
};

export interface Ponto2DEditor3D {
    readonly x: number;
    readonly y: number;
};