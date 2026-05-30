import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, Vetor3 } from '../editor/editor3D.tipos';

export interface ResultadoInsetFaceEditor3D {
    readonly malha: MalhaEditavelEditor3D;
    readonly idFaceInterna: string;
};

export const escalaInsetInicialEditor3D = 0.68;
const toleranciaGeometriaInsetFaceEditor3D = 0.00001;
const escalaInsetMinimaEditor3D = 0.08;
const escalaInsetMaximaEditor3D = 0.96;

function subtraiVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
function multiplicaVetorEditor3D(vetor: Vetor3, escala: number): Vetor3 { return [vetor[0] * escala, vetor[1] * escala, vetor[2] * escala]; };
function produtoEscalarEditor3D(a: Vetor3, b: Vetor3): number { return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]); };
function produtoVetorialEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [(a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0])]; };
function tamanhoVetorEditor3D(vetor: Vetor3): number { return Math.sqrt(produtoEscalarEditor3D(vetor, vetor)); };

function normalizaVetorEditor3D(vetor: Vetor3): Vetor3 | null {
    const tamanho = tamanhoVetorEditor3D(vetor);

    if (tamanho <= toleranciaGeometriaInsetFaceEditor3D) return null;

    return [vetor[0] / tamanho, vetor[1] / tamanho, vetor[2] / tamanho];
};

function obtemFaceMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D, idFace: string): FaceMalhaEditavelEditor3D | null { return malha.faces.find(face => face.id === idFace) ?? null; };

function obtemPontosFaceEditor3D(malha: MalhaEditavelEditor3D, face: FaceMalhaEditavelEditor3D): Vetor3[] | null {
    const pontos: Vetor3[] = [];

    for (const indiceVertice of face.indicesVertices) {
        const ponto = malha.vertices[indiceVertice];

        if (ponto === undefined) return null;

        pontos.push(ponto);
    }

    return pontos;
};

function calculaCentroFaceEditor3D(pontos: readonly Vetor3[]): Vetor3 {
    const soma = pontos.reduce<Vetor3>((total, ponto) => somaVetoresEditor3D(total, ponto), [0, 0, 0]);
    const fator = 1 / pontos.length;

    return multiplicaVetorEditor3D(soma, fator);
};

function calculaNormalFaceEditor3D(pontos: readonly Vetor3[]): Vetor3 | null {
    const origem = pontos[0];

    for (let indice = 1; indice < pontos.length - 1; indice++) {
        const normal = normalizaVetorEditor3D(produtoVetorialEditor3D(subtraiVetoresEditor3D(pontos[indice], origem), subtraiVetoresEditor3D(pontos[indice + 1], origem)));

        if (normal !== null) return normal;
    }

    return null;
};

function faceEhPlanaEditor3D(pontos: readonly Vetor3[], normal: Vetor3): boolean {
    const origem = pontos[0];

    return pontos.every(ponto => Math.abs(produtoEscalarEditor3D(subtraiVetoresEditor3D(ponto, origem), normal)) <= toleranciaGeometriaInsetFaceEditor3D);
};

function faceEhConvexaEditor3D(pontos: readonly Vetor3[], normal: Vetor3): boolean {
    let encontrouAnguloValido = false;

    for (let indice = 0; indice < pontos.length; indice++) {
        const anterior = pontos[(indice + pontos.length - 1) % pontos.length];
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];
        const paraAnterior = subtraiVetoresEditor3D(atual, anterior);
        const paraProximo = subtraiVetoresEditor3D(proximo, atual);
        const sinal = produtoEscalarEditor3D(produtoVetorialEditor3D(paraAnterior, paraProximo), normal);

        if (sinal < -toleranciaGeometriaInsetFaceEditor3D) return false;
        if (sinal > toleranciaGeometriaInsetFaceEditor3D) encontrouAnguloValido = true;
    }

    return encontrouAnguloValido;
};

function facePodeReceberInsetEditor3D(pontos: readonly Vetor3[]): boolean {
    if (pontos.length < 3) return false;

    const normal = calculaNormalFaceEditor3D(pontos);

    if (normal === null) return false;
    if (!faceEhPlanaEditor3D(pontos, normal)) return false;

    return faceEhConvexaEditor3D(pontos, normal);
};

function criaIdFaceEditadaEditor3D(proximoIdFace: number): string { return `edit-face-${proximoIdFace}`; };

export function normalizaEscalaInsetFaceEditor3D(escala: number): number { return Math.min(escalaInsetMaximaEditor3D, Math.max(escalaInsetMinimaEditor3D, escala)); };

function criaPontosInternosInsetEditor3D(pontos: readonly Vetor3[], escalaInset: number): Vetor3[] {
    const centro = calculaCentroFaceEditor3D(pontos);

    return pontos.map(ponto => somaVetoresEditor3D(centro, multiplicaVetorEditor3D(subtraiVetoresEditor3D(ponto, centro), escalaInset)));
};

export function aplicaInsetFaceMalhaEditavelComEscalaEditor3D(malha: MalhaEditavelEditor3D, idFace: string, escala: number): ResultadoInsetFaceEditor3D | null {
    const face = obtemFaceMalhaEditavelEditor3D(malha, idFace);

    if (face === null) return null;
    if (new Set(face.indicesVertices).size !== face.indicesVertices.length) return null;

    const pontos = obtemPontosFaceEditor3D(malha, face);

    if (pontos === null || !facePodeReceberInsetEditor3D(pontos)) return null;

    const escalaInset = normalizaEscalaInsetFaceEditor3D(escala);
    const pontosInternos = criaPontosInternosInsetEditor3D(pontos, escalaInset);
    const indicePrimeiroVerticeInterno = malha.vertices.length;
    const vertices = [...malha.vertices, ...pontosInternos];
    const faces: FaceMalhaEditavelEditor3D[] = [];
    let proximoIdFace = malha.proximoIdFace;

    malha.faces.forEach(faceAtual => {
        if (faceAtual.id !== face.id) {
            faces.push(faceAtual);

            return;
        }

        faceAtual.indicesVertices.forEach((indiceVertice, indice) => {
            const indiceProximo = (indice + 1) % faceAtual.indicesVertices.length;
            const idFaceAnel = criaIdFaceEditadaEditor3D(proximoIdFace);
            const indiceVerticeProximo = faceAtual.indicesVertices[indiceProximo];
            const indiceInterno = indicePrimeiroVerticeInterno + indice;
            const indiceInternoProximo = indicePrimeiroVerticeInterno + indiceProximo;

            faces.push({ id: idFaceAnel, nome: `Inset Ring ${indice + 1}`, indicesVertices: [indiceVertice, indiceVerticeProximo, indiceInternoProximo, indiceInterno] });
            proximoIdFace += 1;
        });
    });

    const idFaceInterna = criaIdFaceEditadaEditor3D(proximoIdFace);
    const indicesFaceInterna = pontosInternos.map((_, indice) => indicePrimeiroVerticeInterno + indice);

    faces.push({ id: idFaceInterna, nome: 'Inset Face', indicesVertices: indicesFaceInterna });
    proximoIdFace += 1;

    return { malha: { vertices, faces, proximoIdFace }, idFaceInterna };
};

export function aplicaInsetFaceMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D, idFace: string): ResultadoInsetFaceEditor3D | null {
    return aplicaInsetFaceMalhaEditavelComEscalaEditor3D(malha, idFace, escalaInsetInicialEditor3D);
};
