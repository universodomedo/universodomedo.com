import type { FaceGeometriaEditor3D, GeometriaEditor3D, ModoDesenhoEditor3D, Ponto2DEditor3D, TrianguloFaceEditor3D } from './editor3D.geometria.types';
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

export function criaGeometriaEditor3D(vertices: number[], normais: number[], modo: ModoDesenhoEditor3D, faces: readonly FaceGeometriaEditor3D[] = []): GeometriaEditor3D { return { vertices: new Float32Array(vertices), normais: new Float32Array(normais), quantidadeVertices: vertices.length / 3, modo, faces }; };

export function criaFaceEditor3D(id: string, nome: string, triangulos: readonly TrianguloFaceEditor3D[]): FaceGeometriaEditor3D { return { id, nome, triangulos }; };

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

function subtraiVetor(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
function produtoVetorial(a: Vetor3, b: Vetor3): Vetor3 { return [(a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0])]; };

export function calculaNormalTrianguloEditor3D(a: Vetor3, b: Vetor3, c: Vetor3): Vetor3 {
    const ab = subtraiVetor(b, a);
    const ac = subtraiVetor(c, a);
    const normal = produtoVetorial(ab, ac);

    return normalizaVetorEditor3D(normal[0], normal[1], normal[2]);
};

export function criaGeometriaFaceEditor3D(face: FaceGeometriaEditor3D): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];

    face.triangulos.forEach(triangulo => {
        const normal = calculaNormalTrianguloEditor3D(triangulo[0], triangulo[1], triangulo[2]);

        adicionaTrianguloEditor3D(vertices, normais, triangulo[0], triangulo[1], triangulo[2], normal);
    });

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
}