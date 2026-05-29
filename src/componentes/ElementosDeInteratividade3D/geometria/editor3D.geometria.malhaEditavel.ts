import { adicionaTrianguloEditor3D, calculaNormalTrianguloEditor3D, criaFaceEditor3D, criaGeometriaEditor3D } from './editor3D.geometria.base';
import type { FaceGeometriaEditor3D, GeometriaEditor3D, TrianguloFaceEditor3D } from './editor3D.geometria.types';
import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, Vetor3 } from '../editor/editor3D.tipos';

interface ArestaContadaMalhaEditavelEditor3D {
    readonly a: number;
    readonly b: number;
    ocorrencias: number;
};

const toleranciaVerticeMalhaEditavelEditor3D = 0.000001;

function distanciaQuadradaVetoresEditor3D(a: Vetor3, b: Vetor3): number {
    const x = a[0] - b[0];
    const y = a[1] - b[1];
    const z = a[2] - b[2];

    return (x * x) + (y * y) + (z * z);
};

function vetoresSaoIguaisEditor3D(a: Vetor3, b: Vetor3): boolean { return distanciaQuadradaVetoresEditor3D(a, b) <= toleranciaVerticeMalhaEditavelEditor3D; };

function obtemOuAdicionaVerticeEditor3D(vertices: Vetor3[], ponto: Vetor3): number {
    const indiceExistente = vertices.findIndex(vertice => vetoresSaoIguaisEditor3D(vertice, ponto));

    if (indiceExistente >= 0) return indiceExistente;

    vertices.push(ponto);

    return vertices.length - 1;
};

function criaChaveArestaEditor3D(a: number, b: number): string { return a < b ? `${a}:${b}` : `${b}:${a}`; };

function adicionaArestaContadaEditor3D(arestas: Map<string, ArestaContadaMalhaEditavelEditor3D>, a: number, b: number): void {
    if (a === b) return;

    const chave = criaChaveArestaEditor3D(a, b);
    const aresta = arestas.get(chave);

    if (aresta !== undefined) {
        aresta.ocorrencias += 1;

        return;
    }

    arestas.set(chave, { a, b, ocorrencias: 1 });
};

function adicionaAdjacenciaEditor3D(adjacencias: Map<number, number[]>, a: number, b: number): void {
    const vizinhosA = adjacencias.get(a) ?? [];
    const vizinhosB = adjacencias.get(b) ?? [];

    if (!vizinhosA.includes(b)) adjacencias.set(a, [...vizinhosA, b]);
    if (!vizinhosB.includes(a)) adjacencias.set(b, [...vizinhosB, a]);
};

function ordenaVerticesBordaEditor3D(arestasBorda: readonly ArestaContadaMalhaEditavelEditor3D[]): number[] | null {
    if (arestasBorda.length < 3) return null;

    const adjacencias = new Map<number, number[]>();

    arestasBorda.forEach(aresta => adicionaAdjacenciaEditor3D(adjacencias, aresta.a, aresta.b));

    if (Array.from(adjacencias.values()).some(vizinhos => vizinhos.length !== 2)) return null;

    const primeiro = arestasBorda[0].a;
    const segundo = arestasBorda[0].b;
    const ordenados = [primeiro, segundo];

    while (ordenados.length < adjacencias.size) {
        const atual = ordenados[ordenados.length - 1];
        const anterior = ordenados[ordenados.length - 2];
        const vizinhos = adjacencias.get(atual);

        if (vizinhos === undefined) return null;

        const proximo = vizinhos.find(vizinho => vizinho !== anterior);

        if (proximo === undefined || ordenados.includes(proximo)) return null;

        ordenados.push(proximo);
    }

    const ultimo = ordenados[ordenados.length - 1];
    const vizinhosUltimo = adjacencias.get(ultimo);

    if (vizinhosUltimo === undefined || !vizinhosUltimo.includes(primeiro)) return null;

    return ordenados;
};

function produtoEscalarEditor3D(a: Vetor3, b: Vetor3): number { return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]); };

function inverteIndicesSeNecessarioEditor3D(indices: readonly number[], vertices: readonly Vetor3[], triangulos: readonly TrianguloFaceEditor3D[]): number[] {
    if (indices.length < 3 || triangulos.length === 0) return [...indices];

    const normalReferencia = calculaNormalTrianguloEditor3D(triangulos[0][0], triangulos[0][1], triangulos[0][2]);
    const normalOrdenada = calculaNormalTrianguloEditor3D(vertices[indices[0]], vertices[indices[1]], vertices[indices[2]]);

    if (produtoEscalarEditor3D(normalReferencia, normalOrdenada) >= 0) return [...indices];

    return [...indices].reverse();
};

function obtemIndicesPoligonoFaceEditor3D(face: FaceGeometriaEditor3D): { readonly vertices: readonly Vetor3[]; readonly indices: readonly number[] } | null {
    const verticesLocais: Vetor3[] = [];
    const triangulosLocais: number[][] = [];
    const arestas = new Map<string, ArestaContadaMalhaEditavelEditor3D>();

    face.triangulos.forEach(triangulo => {
        const a = obtemOuAdicionaVerticeEditor3D(verticesLocais, triangulo[0]);
        const b = obtemOuAdicionaVerticeEditor3D(verticesLocais, triangulo[1]);
        const c = obtemOuAdicionaVerticeEditor3D(verticesLocais, triangulo[2]);

        if (a === b || b === c || c === a) return;

        triangulosLocais.push([a, b, c]);
        adicionaArestaContadaEditor3D(arestas, a, b);
        adicionaArestaContadaEditor3D(arestas, b, c);
        adicionaArestaContadaEditor3D(arestas, c, a);
    });

    if (triangulosLocais.length === 0) return null;

    const arestasBorda = Array.from(arestas.values()).filter(aresta => aresta.ocorrencias === 1);
    const indicesBorda = ordenaVerticesBordaEditor3D(arestasBorda);

    if (indicesBorda === null) return null;

    return { vertices: verticesLocais, indices: inverteIndicesSeNecessarioEditor3D(indicesBorda, verticesLocais, face.triangulos) };
};

export function criaMalhaEditavelPorGeometriaEditor3D(geometria: GeometriaEditor3D): MalhaEditavelEditor3D | null {
    const vertices: Vetor3[] = [];
    const faces: FaceMalhaEditavelEditor3D[] = [];

    for (const face of geometria.faces) {
        const poligono = obtemIndicesPoligonoFaceEditor3D(face);

        if (poligono === null) return null;

        const indicesVertices = poligono.indices.map(indiceLocal => obtemOuAdicionaVerticeEditor3D(vertices, poligono.vertices[indiceLocal]));

        faces.push({ id: face.id, nome: face.nome, indicesVertices });
    }

    return { vertices, faces, proximoIdFace: 1 };
};

export function criaGeometriaMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const faces: FaceGeometriaEditor3D[] = [];

    malha.faces.forEach(face => {
        const pontos = face.indicesVertices.map(indice => malha.vertices[indice]);
        const triangulos: TrianguloFaceEditor3D[] = [];

        if (pontos.length < 3) return;

        const normal = calculaNormalTrianguloEditor3D(pontos[0], pontos[1], pontos[2]);

        for (let indice = 1; indice < pontos.length - 1; indice++) {
            const triangulo: TrianguloFaceEditor3D = [pontos[0], pontos[indice], pontos[indice + 1]];

            adicionaTrianguloEditor3D(vertices, normais, triangulo[0], triangulo[1], triangulo[2], normal);
            triangulos.push(triangulo);
        }

        faces.push(criaFaceEditor3D(face.id, face.nome, triangulos));
    });

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS', faces);
};
