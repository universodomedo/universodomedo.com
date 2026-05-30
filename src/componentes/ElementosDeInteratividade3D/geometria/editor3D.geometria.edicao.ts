import { adicionaTrianguloEditor3D, adicionaVerticeEditor3D, calculaNormalTrianguloEditor3D, criaGeometriaEditor3D } from './editor3D.geometria.base';
import { obtemArestasMalhaEditavelEditor3D, type ArestaMalhaEditavelEditor3D } from './editor3D.geometria.malhaEditavel';
import type { GeometriaEditor3D } from './editor3D.geometria.types';
import type { MalhaEditavelEditor3D, Vetor3 } from '../editor/editor3D.tipos';

const normalOverlayEdicaoEditor3D: Vetor3 = [0, 0, 1];
const raioArestaEdicaoEditor3D = 0.0008;
const verticesPorArestaEdicaoEditor3D = 36;

export interface GeometriaArestasEdicaoEditor3D {
    readonly geometria: GeometriaEditor3D;
    readonly arestas: readonly ArestaMalhaEditavelEditor3D[];
    readonly verticesPorAresta: number;
};

function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
function subtraiVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
function multiplicaVetorEditor3D(vetor: Vetor3, escala: number): Vetor3 { return [vetor[0] * escala, vetor[1] * escala, vetor[2] * escala]; };
function produtoEscalarEditor3D(a: Vetor3, b: Vetor3): number { return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]); };
function produtoVetorialEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [(a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0])]; };

function normalizaVetorEditor3D(vetor: Vetor3): Vetor3 | null {
    const tamanho = Math.sqrt(produtoEscalarEditor3D(vetor, vetor));

    if (tamanho <= 0.000001) return null;

    return [vetor[0] / tamanho, vetor[1] / tamanho, vetor[2] / tamanho];
};

function adicionaFacePrismaArestaEditor3D(vertices: number[], normais: number[], a: Vetor3, b: Vetor3, c: Vetor3, d: Vetor3): void {
    const normal = calculaNormalTrianguloEditor3D(a, b, c);

    adicionaTrianguloEditor3D(vertices, normais, a, b, c, normal);
    adicionaTrianguloEditor3D(vertices, normais, a, c, d, normal);
};

function adicionaPrismaArestaEditor3D(vertices: number[], normais: number[], origem: Vetor3, destino: Vetor3): void {
    const direcao = normalizaVetorEditor3D(subtraiVetoresEditor3D(destino, origem));

    if (direcao === null) return;

    const referencia: Vetor3 = Math.abs(produtoEscalarEditor3D(direcao, [0, 0, 1])) > 0.86 ? [0, 1, 0] : [0, 0, 1];
    const lateralA = normalizaVetorEditor3D(produtoVetorialEditor3D(direcao, referencia));

    if (lateralA === null) return;

    const lateralB = normalizaVetorEditor3D(produtoVetorialEditor3D(direcao, lateralA));

    if (lateralB === null) return;

    const a = multiplicaVetorEditor3D(lateralA, raioArestaEdicaoEditor3D);
    const b = multiplicaVetorEditor3D(lateralB, raioArestaEdicaoEditor3D);
    const origem1 = somaVetoresEditor3D(origem, somaVetoresEditor3D(a, b));
    const origem2 = somaVetoresEditor3D(origem, somaVetoresEditor3D(multiplicaVetorEditor3D(a, -1), b));
    const origem3 = somaVetoresEditor3D(origem, somaVetoresEditor3D(multiplicaVetorEditor3D(a, -1), multiplicaVetorEditor3D(b, -1)));
    const origem4 = somaVetoresEditor3D(origem, somaVetoresEditor3D(a, multiplicaVetorEditor3D(b, -1)));
    const destino1 = somaVetoresEditor3D(destino, somaVetoresEditor3D(a, b));
    const destino2 = somaVetoresEditor3D(destino, somaVetoresEditor3D(multiplicaVetorEditor3D(a, -1), b));
    const destino3 = somaVetoresEditor3D(destino, somaVetoresEditor3D(multiplicaVetorEditor3D(a, -1), multiplicaVetorEditor3D(b, -1)));
    const destino4 = somaVetoresEditor3D(destino, somaVetoresEditor3D(a, multiplicaVetorEditor3D(b, -1)));

    adicionaFacePrismaArestaEditor3D(vertices, normais, origem1, destino1, destino2, origem2);
    adicionaFacePrismaArestaEditor3D(vertices, normais, origem2, destino2, destino3, origem3);
    adicionaFacePrismaArestaEditor3D(vertices, normais, origem3, destino3, destino4, origem4);
    adicionaFacePrismaArestaEditor3D(vertices, normais, origem4, destino4, destino1, origem1);
    adicionaFacePrismaArestaEditor3D(vertices, normais, origem4, origem1, origem2, origem3);
    adicionaFacePrismaArestaEditor3D(vertices, normais, destino1, destino4, destino3, destino2);
};

export function criaGeometriaVerticesEdicaoEditor3D(malha: MalhaEditavelEditor3D): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];

    malha.vertices.forEach(vertice => adicionaVerticeEditor3D(vertices, normais, vertice, normalOverlayEdicaoEditor3D));

    return criaGeometriaEditor3D(vertices, normais, 'PONTOS');
};

export function criaGeometriaArestasEdicaoEditor3D(malha: MalhaEditavelEditor3D): GeometriaArestasEdicaoEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const arestas = obtemArestasMalhaEditavelEditor3D(malha);

    arestas.forEach(aresta => {
        const origem = malha.vertices[aresta.indiceOrigem];
        const destino = malha.vertices[aresta.indiceDestino];

        if (origem === undefined || destino === undefined) return;

        adicionaPrismaArestaEditor3D(vertices, normais, origem, destino);
    });

    return { geometria: criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS'), arestas, verticesPorAresta: verticesPorArestaEdicaoEditor3D };
};
