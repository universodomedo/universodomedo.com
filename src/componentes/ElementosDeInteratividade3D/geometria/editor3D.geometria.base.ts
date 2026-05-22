import type { GeometriaEditor3D, ModoDesenhoEditor3D, Ponto2DEditor3D } from './editor3D.geometria.types';
import type { Vetor3 } from '../editor/editor3D.tipos';

export function adicionaVerticeEditor3D(vertices: number[], normais: number[], posicao: Vetor3, normal: Vetor3): void {
    vertices.push(posicao[0], posicao[1], posicao[2]);
    normais.push(normal[0], normal[1], normal[2]);
};

export function adicionaLinhaEditor3D(vertices: number[], normais: number[], a: Vetor3, b: Vetor3, normal: Vetor3): void {
    adicionaVerticeEditor3D(vertices, normais, a, normal);
    adicionaVerticeEditor3D(vertices, normais, b, normal);
};

export function adicionaTrianguloEditor3D(vertices: number[], normais: number[], a: Vetor3, b: Vetor3, c: Vetor3, normal: Vetor3): void {
    adicionaVerticeEditor3D(vertices, normais, a, normal);
    adicionaVerticeEditor3D(vertices, normais, b, normal);
    adicionaVerticeEditor3D(vertices, normais, c, normal);
};

export function criaGeometriaEditor3D(vertices: number[], normais: number[], modo: ModoDesenhoEditor3D): GeometriaEditor3D { return { vertices: new Float32Array(vertices), normais: new Float32Array(normais), quantidadeVertices: vertices.length / 3, modo }; };

export function criaPontosCirculoEditor3D(totalPontos: number): Ponto2DEditor3D[] {
    const pontos: Ponto2DEditor3D[] = [];

    for (let indice = 0; indice < totalPontos; indice++) {
        const angulo = (Math.PI * 2 * indice) / totalPontos;

        pontos.push({ x: Math.cos(angulo), y: Math.sin(angulo) });
    }

    return pontos;
};

export function normalizaVetorEditor3D(x: number, y: number, z: number): Vetor3 {
    const tamanho = Math.sqrt((x * x) + (y * y) + (z * z));

    if (tamanho === 0) return [0, 0, 1];

    return [x / tamanho, y / tamanho, z / tamanho];
};