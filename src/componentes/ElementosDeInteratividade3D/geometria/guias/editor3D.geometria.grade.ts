import { adicionaLinhaEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { PlanoGuiaEditor3D } from '../../editor/editor3D.camera';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function obtemNormalPlano(plano: PlanoGuiaEditor3D): Vetor3 {
    if (plano === 'XZ') return [0, 1, 0];
    if (plano === 'YZ') return [1, 0, 0];

    return [0, 0, 1];
};

function criaPontoPlano(plano: PlanoGuiaEditor3D, a: number, b: number): Vetor3 {
    if (plano === 'XZ') return [a, 0, b];
    if (plano === 'YZ') return [0, a, b];

    return [a, b, 0];
};

export function criaGeometriaGradeEditor3D(plano: PlanoGuiaEditor3D, tamanho: number, divisoes: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const normal = obtemNormalPlano(plano);
    const metade = tamanho / 2;
    const passo = tamanho / divisoes;

    for (let indice = 0; indice <= divisoes; indice++) {
        const valor = -metade + (passo * indice);

        adicionaLinhaEditor3D(vertices, normais, criaPontoPlano(plano, -metade, valor), criaPontoPlano(plano, metade, valor), normal);
        adicionaLinhaEditor3D(vertices, normais, criaPontoPlano(plano, valor, -metade), criaPontoPlano(plano, valor, metade), normal);
    }

    return criaGeometriaEditor3D(vertices, normais, 'LINHAS');
};