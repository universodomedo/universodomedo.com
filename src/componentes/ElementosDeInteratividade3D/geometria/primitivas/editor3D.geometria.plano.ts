import { adicionaTrianguloEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

export function criaGeometriaPlanoEditor3D(): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const normal: Vetor3 = [0, 0, 1];

    adicionaTrianguloEditor3D(vertices, normais, [-0.6, -0.6, 0], [0.6, -0.6, 0], [0.6, 0.6, 0], normal);
    adicionaTrianguloEditor3D(vertices, normais, [-0.6, -0.6, 0], [0.6, 0.6, 0], [-0.6, 0.6, 0], normal);

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
};