import type { Vetor3 } from '../editor/editor3D.tipos';

export type ModoDesenhoEditor3D = 'PONTOS' | 'LINHAS' | 'TRIANGULOS';
export type TrianguloFaceEditor3D = readonly [Vetor3, Vetor3, Vetor3];

export interface FaceGeometriaEditor3D {
    readonly id: string;
    readonly nome: string;
    readonly triangulos: readonly TrianguloFaceEditor3D[];
};

export interface GeometriaEditor3D {
    readonly vertices: Float32Array;
    readonly normais: Float32Array;
    readonly quantidadeVertices: number;
    readonly modo: ModoDesenhoEditor3D;
    readonly faces: readonly FaceGeometriaEditor3D[];
};

export interface GuiaEditor3D {
    readonly geometria: GeometriaEditor3D;
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
};

export interface Ponto2DEditor3D {
    readonly x: number;
    readonly y: number;
}