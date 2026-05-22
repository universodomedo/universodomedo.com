import { adicionaTrianguloEditor3D, criaFaceEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

export function criaGeometriaPlanoEditor3D(): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const normal: Vetor3 = [0, 0, 1];
    const a: Vetor3 = [-0.6, -0.6, 0];
    const b: Vetor3 = [0.6, -0.6, 0];
    const c: Vetor3 = [0.6, 0.6, 0];
    const d: Vetor3 = [-0.6, 0.6, 0];

    adicionaTrianguloEditor3D(vertices, normais, a, b, c, normal);
    adicionaTrianguloEditor3D(vertices, normais, a, c, d, normal);

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS', [criaFaceEditor3D('plano-frente', 'Face', [[a, b, c], [a, c, d]])]);
}