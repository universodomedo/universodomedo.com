import { adicionaTrianguloEditor3D, criaFaceEditor3D, criaGeometriaEditor3D, criaPontosCirculoEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D, TrianguloFaceEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

export function criaGeometriaCirculoEditor3D(quantidadeVertices: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const triangulosFace: TrianguloFaceEditor3D[] = [];
    const pontos = criaPontosCirculoEditor3D(quantidadeVertices);
    const normal: Vetor3 = [0, 0, 1];
    const centro: Vetor3 = [0, 0, 0];

    for (let indice = 0; indice < pontos.length; indice++) {
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];
        const a: Vetor3 = [atual.x * 0.62, atual.y * 0.62, 0];
        const b: Vetor3 = [proximo.x * 0.62, proximo.y * 0.62, 0];

        adicionaTrianguloEditor3D(vertices, normais, centro, a, b, normal);
        triangulosFace.push([centro, a, b]);
    }

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS', [criaFaceEditor3D('circulo-frente', 'Face', triangulosFace)]);
}