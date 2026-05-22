import { adicionaTrianguloEditor3D, criaGeometriaEditor3D, criaPontosCirculoEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

export function criaGeometriaCirculoEditor3D(quantidadeVertices: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const pontos = criaPontosCirculoEditor3D(quantidadeVertices);
    const normal: Vetor3 = [0, 0, 1];

    for (let indice = 0; indice < pontos.length; indice++) {
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];

        adicionaTrianguloEditor3D(vertices, normais, [0, 0, 0], [atual.x * 0.62, atual.y * 0.62, 0], [proximo.x * 0.62, proximo.y * 0.62, 0], normal);
    }

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
};