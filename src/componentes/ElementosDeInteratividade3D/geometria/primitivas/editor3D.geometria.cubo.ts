import { adicionaTrianguloEditor3D, criaFaceEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { FaceGeometriaEditor3D, GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function adicionaFace(vertices: number[], normais: number[], id: string, nome: string, pontos: readonly [Vetor3, Vetor3, Vetor3, Vetor3], normal: Vetor3): FaceGeometriaEditor3D {
    adicionaTrianguloEditor3D(vertices, normais, pontos[0], pontos[1], pontos[2], normal);
    adicionaTrianguloEditor3D(vertices, normais, pontos[0], pontos[2], pontos[3], normal);

    return criaFaceEditor3D(id, nome, [[pontos[0], pontos[1], pontos[2]], [pontos[0], pontos[2], pontos[3]]]);
};

export function criaGeometriaCuboEditor3D(): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const faces: FaceGeometriaEditor3D[] = [];
    const s = 0.5;

    faces.push(adicionaFace(vertices, normais, 'cubo-frente', 'Front', [[-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]], [0, 0, 1]));
    faces.push(adicionaFace(vertices, normais, 'cubo-costas', 'Back', [[s, -s, -s], [-s, -s, -s], [-s, s, -s], [s, s, -s]], [0, 0, -1]));
    faces.push(adicionaFace(vertices, normais, 'cubo-cima', 'Top', [[-s, s, s], [s, s, s], [s, s, -s], [-s, s, -s]], [0, 1, 0]));
    faces.push(adicionaFace(vertices, normais, 'cubo-baixo', 'Bottom', [[-s, -s, -s], [s, -s, -s], [s, -s, s], [-s, -s, s]], [0, -1, 0]));
    faces.push(adicionaFace(vertices, normais, 'cubo-direita', 'Right', [[s, -s, s], [s, -s, -s], [s, s, -s], [s, s, s]], [1, 0, 0]));
    faces.push(adicionaFace(vertices, normais, 'cubo-esquerda', 'Left', [[-s, -s, -s], [-s, -s, s], [-s, s, s], [-s, s, -s]], [-1, 0, 0]));

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS', faces);
}