import { adicionaTrianguloEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function adicionaFace(vertices: number[], normais: number[], pontos: readonly [Vetor3, Vetor3, Vetor3, Vetor3], normal: Vetor3): void {
    adicionaTrianguloEditor3D(vertices, normais, pontos[0], pontos[1], pontos[2], normal);
    adicionaTrianguloEditor3D(vertices, normais, pontos[0], pontos[2], pontos[3], normal);
};

export function criaGeometriaCuboEditor3D(): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const s = 0.5;

    adicionaFace(vertices, normais, [[-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]], [0, 0, 1]);
    adicionaFace(vertices, normais, [[s, -s, -s], [-s, -s, -s], [-s, s, -s], [s, s, -s]], [0, 0, -1]);
    adicionaFace(vertices, normais, [[-s, s, s], [s, s, s], [s, s, -s], [-s, s, -s]], [0, 1, 0]);
    adicionaFace(vertices, normais, [[-s, -s, -s], [s, -s, -s], [s, -s, s], [-s, -s, s]], [0, -1, 0]);
    adicionaFace(vertices, normais, [[s, -s, s], [s, -s, -s], [s, s, -s], [s, s, s]], [1, 0, 0]);
    adicionaFace(vertices, normais, [[-s, -s, -s], [-s, -s, s], [-s, s, s], [-s, s, -s]], [-1, 0, 0]);

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
};