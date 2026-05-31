import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, Vetor3 } from '../editor/editor3D.tipos';

export interface ArestaBevelMalhaEditavelEditor3D {
    readonly indiceOrigem: number;
    readonly indiceDestino: number;
};

export interface ResultadoBevelMalhaEditavelEditor3D {
    readonly malha: MalhaEditavelEditor3D;
    readonly idsFacesBevel: readonly string[];
};

interface OcorrenciaArestaBevelEditor3D {
    readonly chave: string;
    readonly indiceFace: number;
    readonly indiceAresta: number;
    readonly indiceOrigem: number;
    readonly indiceDestino: number;
    readonly pontoOrigemOffset: Vetor3;
    readonly pontoDestinoOffset: Vetor3;
    readonly indiceOrigemOffset: number;
    readonly indiceDestinoOffset: number;
};

interface LinhaSegmentoBevelEditor3D {
    readonly indiceOrigem: number;
    readonly indiceDestino: number;
};

interface Vetor2BevelEditor3D {
    readonly x: number;
    readonly y: number;
};

interface BaseFaceBevelEditor3D {
    readonly origem: Vetor3;
    readonly eixoU: Vetor3;
    readonly eixoV: Vetor3;
};

interface LinhaOffsetBevelEditor3D {
    readonly ponto: Vetor2BevelEditor3D;
    readonly direcao: Vetor2BevelEditor3D;
};

const toleranciaBevelEditor3D = 0.000001;
const larguraBevelMaximaEditor3D = 1;
const segmentosBevelMaximoEditor3D = 16;

function criaChaveArestaBevelEditor3D(indiceA: number, indiceB: number): string { return indiceA < indiceB ? `${indiceA}:${indiceB}` : `${indiceB}:${indiceA}`; };
function subtraiVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
function multiplicaVetorEditor3D(vetor: Vetor3, escala: number): Vetor3 { return [vetor[0] * escala, vetor[1] * escala, vetor[2] * escala]; };
function interpolaVetoresEditor3D(a: Vetor3, b: Vetor3, fator: number): Vetor3 { return somaVetoresEditor3D(a, multiplicaVetorEditor3D(subtraiVetoresEditor3D(b, a), fator)); };
function produtoEscalarEditor3D(a: Vetor3, b: Vetor3): number { return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]); };
function produtoVetorialEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [(a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0])]; };
function tamanhoVetorEditor3D(vetor: Vetor3): number { return Math.sqrt(produtoEscalarEditor3D(vetor, vetor)); };

function normalizaVetorEditor3D(vetor: Vetor3): Vetor3 | null {
    const tamanho = tamanhoVetorEditor3D(vetor);

    if (tamanho <= toleranciaBevelEditor3D) return null;

    return [vetor[0] / tamanho, vetor[1] / tamanho, vetor[2] / tamanho];
};

function calculaCentroFaceEditor3D(vertices: readonly Vetor3[], face: FaceMalhaEditavelEditor3D): Vetor3 | null {
    let soma: Vetor3 = [0, 0, 0];

    for (const indiceVertice of face.indicesVertices) {
        const vertice = vertices[indiceVertice];

        if (vertice === undefined) return null;

        soma = somaVetoresEditor3D(soma, vertice);
    }

    return multiplicaVetorEditor3D(soma, 1 / face.indicesVertices.length);
};

function calculaNormalFaceEditor3D(vertices: readonly Vetor3[], face: FaceMalhaEditavelEditor3D): Vetor3 | null {
    const origem = vertices[face.indicesVertices[0]];

    if (origem === undefined) return null;

    for (let indice = 1; indice < face.indicesVertices.length - 1; indice++) {
        const a = vertices[face.indicesVertices[indice]];
        const b = vertices[face.indicesVertices[indice + 1]];

        if (a === undefined || b === undefined) return null;

        const normal = normalizaVetorEditor3D(produtoVetorialEditor3D(subtraiVetoresEditor3D(a, origem), subtraiVetoresEditor3D(b, origem)));

        if (normal !== null) return normal;
    }

    return null;
};

function calculaPontoMedioEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return multiplicaVetorEditor3D(somaVetoresEditor3D(a, b), 0.5); };

function obtemDirecaoInternaArestaFaceEditor3D(origem: Vetor3, destino: Vetor3, centro: Vetor3, normalFace: Vetor3): Vetor3 | null {
    const direcaoAresta = normalizaVetorEditor3D(subtraiVetoresEditor3D(destino, origem));

    if (direcaoAresta === null) return null;

    const pontoMedio = calculaPontoMedioEditor3D(origem, destino);
    const direcaoCentro = subtraiVetoresEditor3D(centro, pontoMedio);
    const candidato = normalizaVetorEditor3D(produtoVetorialEditor3D(normalFace, direcaoAresta));

    if (candidato === null) return null;

    return produtoEscalarEditor3D(candidato, direcaoCentro) >= 0 ? candidato : multiplicaVetorEditor3D(candidato, -1);
};

function obtemLarguraSeguraFaceEditor3D(origem: Vetor3, destino: Vetor3, centro: Vetor3, largura: number): number {
    const pontoMedio = calculaPontoMedioEditor3D(origem, destino);
    const distanciaAteCentro = tamanhoVetorEditor3D(subtraiVetoresEditor3D(centro, pontoMedio));

    if (distanciaAteCentro <= toleranciaBevelEditor3D) return 0;

    return Math.min(largura, distanciaAteCentro * 0.86);
};

function criaOcorrenciaArestaBevelEditor3D(malha: MalhaEditavelEditor3D, face: FaceMalhaEditavelEditor3D, indiceFace: number, indiceAresta: number, largura: number, vertices: Vetor3[]): OcorrenciaArestaBevelEditor3D | null {
    const indiceOrigem = face.indicesVertices[indiceAresta];
    const indiceDestino = face.indicesVertices[(indiceAresta + 1) % face.indicesVertices.length];
    const origem = malha.vertices[indiceOrigem];
    const destino = malha.vertices[indiceDestino];
    const centro = calculaCentroFaceEditor3D(malha.vertices, face);
    const normalFace = calculaNormalFaceEditor3D(malha.vertices, face);

    if (origem === undefined || destino === undefined || centro === null || normalFace === null) return null;

    const direcaoInterna = obtemDirecaoInternaArestaFaceEditor3D(origem, destino, centro, normalFace);

    if (direcaoInterna === null) return null;

    const larguraSegura = obtemLarguraSeguraFaceEditor3D(origem, destino, centro, largura);
    const pontoOrigemOffset = somaVetoresEditor3D(origem, multiplicaVetorEditor3D(direcaoInterna, larguraSegura));
    const pontoDestinoOffset = somaVetoresEditor3D(destino, multiplicaVetorEditor3D(direcaoInterna, larguraSegura));
    const indiceOrigemOffset = vertices.length;
    const indiceDestinoOffset = vertices.length + 1;

    vertices.push(pontoOrigemOffset, pontoDestinoOffset);

    return { chave: criaChaveArestaBevelEditor3D(indiceOrigem, indiceDestino), indiceFace, indiceAresta, indiceOrigem, indiceDestino, pontoOrigemOffset, pontoDestinoOffset, indiceOrigemOffset, indiceDestinoOffset };
};

function normalizaArestasBevelEditor3D(arestas: readonly ArestaBevelMalhaEditavelEditor3D[]): ArestaBevelMalhaEditavelEditor3D[] {
    const chaves = new Set<string>();
    const arestasNormalizadas: ArestaBevelMalhaEditavelEditor3D[] = [];

    arestas.forEach(aresta => {
        if (aresta.indiceOrigem === aresta.indiceDestino) return;

        const chave = criaChaveArestaBevelEditor3D(aresta.indiceOrigem, aresta.indiceDestino);

        if (chaves.has(chave)) return;

        chaves.add(chave);
        arestasNormalizadas.push(aresta);
    });

    return arestasNormalizadas;
};

function obtemOcorrenciaFaceArestaEditor3D(ocorrencias: readonly OcorrenciaArestaBevelEditor3D[], indiceFace: number, indiceAresta: number): OcorrenciaArestaBevelEditor3D | null {
    return ocorrencias.find(ocorrencia => ocorrencia.indiceFace === indiceFace && ocorrencia.indiceAresta === indiceAresta) ?? null;
};

function criaFacesOriginaisComBevelEditor3D(malha: MalhaEditavelEditor3D, ocorrencias: readonly OcorrenciaArestaBevelEditor3D[]): FaceMalhaEditavelEditor3D[] {
    return malha.faces.map((face, indiceFace) => {
        const indicesVertices: number[] = [];

        face.indicesVertices.forEach((indiceVertice, indiceAresta) => {
            const ocorrencia = obtemOcorrenciaFaceArestaEditor3D(ocorrencias, indiceFace, indiceAresta);
            const indiceArestaAnterior = (indiceAresta + face.indicesVertices.length - 1) % face.indicesVertices.length;
            const ocorrenciaAnterior = obtemOcorrenciaFaceArestaEditor3D(ocorrencias, indiceFace, indiceArestaAnterior);

            if (ocorrencia !== null) {
                indicesVertices.push(ocorrencia.indiceOrigemOffset, ocorrencia.indiceDestinoOffset);

                return;
            }

            if (ocorrenciaAnterior === null) indicesVertices.push(indiceVertice);
        });

        return { ...face, indicesVertices };
    }).filter(face => face.indicesVertices.length >= 3);
};

function obtemOffsetCanonicoOcorrenciaEditor3D(ocorrencia: OcorrenciaArestaBevelEditor3D, indiceCanonicoOrigem: number): LinhaSegmentoBevelEditor3D {
    if (ocorrencia.indiceOrigem === indiceCanonicoOrigem) return { indiceOrigem: ocorrencia.indiceOrigemOffset, indiceDestino: ocorrencia.indiceDestinoOffset };

    return { indiceOrigem: ocorrencia.indiceDestinoOffset, indiceDestino: ocorrencia.indiceOrigemOffset };
};

function criaIdFaceBevelEditor3D(proximoIdFace: number): string { return `edit-face-${proximoIdFace}`; };

function criaLinhaInterpoladaBevelEditor3D(origem: LinhaSegmentoBevelEditor3D, destino: LinhaSegmentoBevelEditor3D, vertices: Vetor3[], fator: number): LinhaSegmentoBevelEditor3D {
    const pontoOrigemA = vertices[origem.indiceOrigem];
    const pontoOrigemB = vertices[origem.indiceDestino];
    const pontoDestinoA = vertices[destino.indiceOrigem];
    const pontoDestinoB = vertices[destino.indiceDestino];

    if (pontoOrigemA === undefined || pontoOrigemB === undefined || pontoDestinoA === undefined || pontoDestinoB === undefined) return origem;

    const indiceOrigem = vertices.length;
    const indiceDestino = vertices.length + 1;

    vertices.push(interpolaVetoresEditor3D(pontoOrigemA, pontoDestinoA, fator), interpolaVetoresEditor3D(pontoOrigemB, pontoDestinoB, fator));

    return { indiceOrigem, indiceDestino };
};

function criaFacesSegmentosBevelEditor3D(origem: LinhaSegmentoBevelEditor3D, destino: LinhaSegmentoBevelEditor3D, segmentos: number, vertices: Vetor3[], proximoIdFaceInicial: number): { readonly faces: FaceMalhaEditavelEditor3D[]; readonly proximoIdFace: number } {
    const linhas: LinhaSegmentoBevelEditor3D[] = [origem];
    const faces: FaceMalhaEditavelEditor3D[] = [];
    let proximoIdFace = proximoIdFaceInicial;

    for (let indice = 1; indice < segmentos; indice++) {
        linhas.push(criaLinhaInterpoladaBevelEditor3D(origem, destino, vertices, indice / segmentos));
    }

    linhas.push(destino);

    for (let indice = 0; indice < linhas.length - 1; indice++) {
        const linhaAtual = linhas[indice];
        const proximaLinha = linhas[indice + 1];

        faces.push({ id: criaIdFaceBevelEditor3D(proximoIdFace), nome: `Bevel ${indice + 1}`, indicesVertices: [linhaAtual.indiceOrigem, linhaAtual.indiceDestino, proximaLinha.indiceDestino, proximaLinha.indiceOrigem] });
        proximoIdFace += 1;
    }

    return { faces, proximoIdFace };
};

function criaFacesBevelPorArestaEditor3D(malha: MalhaEditavelEditor3D, vertices: Vetor3[], ocorrencias: readonly OcorrenciaArestaBevelEditor3D[], arestas: readonly ArestaBevelMalhaEditavelEditor3D[], segmentos: number): { readonly faces: FaceMalhaEditavelEditor3D[]; readonly proximoIdFace: number } {
    const facesBevel: FaceMalhaEditavelEditor3D[] = [];
    let proximoIdFace = malha.proximoIdFace;

    arestas.forEach(aresta => {
        const chave = criaChaveArestaBevelEditor3D(aresta.indiceOrigem, aresta.indiceDestino);
        const ocorrenciasAresta = ocorrencias.filter(ocorrencia => ocorrencia.chave === chave);

        if (ocorrenciasAresta.length === 0) return;

        const origem: LinhaSegmentoBevelEditor3D = { indiceOrigem: aresta.indiceOrigem, indiceDestino: aresta.indiceDestino };
        const destinoA = obtemOffsetCanonicoOcorrenciaEditor3D(ocorrenciasAresta[0], aresta.indiceOrigem);
        const destinoB = ocorrenciasAresta.length > 1 ? obtemOffsetCanonicoOcorrenciaEditor3D(ocorrenciasAresta[1], aresta.indiceOrigem) : origem;
        const resultado = criaFacesSegmentosBevelEditor3D(destinoA, destinoB, segmentos, vertices, proximoIdFace);

        facesBevel.push(...resultado.faces);
        proximoIdFace = resultado.proximoIdFace;
    });

    return { faces: facesBevel, proximoIdFace };
};

function obtemFaceMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D, idFace: string): FaceMalhaEditavelEditor3D | null { return malha.faces.find(face => face.id === idFace) ?? null; };
function subtraiVetores2DBevelEditor3D(a: Vetor2BevelEditor3D, b: Vetor2BevelEditor3D): Vetor2BevelEditor3D { return { x: a.x - b.x, y: a.y - b.y }; };
function somaVetores2DBevelEditor3D(a: Vetor2BevelEditor3D, b: Vetor2BevelEditor3D): Vetor2BevelEditor3D { return { x: a.x + b.x, y: a.y + b.y }; };
function multiplicaVetor2DBevelEditor3D(vetor: Vetor2BevelEditor3D, escala: number): Vetor2BevelEditor3D { return { x: vetor.x * escala, y: vetor.y * escala }; };
function produtoVetorial2DBevelEditor3D(a: Vetor2BevelEditor3D, b: Vetor2BevelEditor3D): number { return (a.x * b.y) - (a.y * b.x); };
function produtoEscalar2DBevelEditor3D(a: Vetor2BevelEditor3D, b: Vetor2BevelEditor3D): number { return (a.x * b.x) + (a.y * b.y); };
function tamanhoVetor2DBevelEditor3D(vetor: Vetor2BevelEditor3D): number { return Math.sqrt(produtoEscalar2DBevelEditor3D(vetor, vetor)); };

function normalizaVetor2DBevelEditor3D(vetor: Vetor2BevelEditor3D): Vetor2BevelEditor3D | null {
    const tamanho = tamanhoVetor2DBevelEditor3D(vetor);

    if (tamanho <= toleranciaBevelEditor3D) return null;

    return { x: vetor.x / tamanho, y: vetor.y / tamanho };
};

function obtemPontosFaceBevelEditor3D(malha: MalhaEditavelEditor3D, face: FaceMalhaEditavelEditor3D): Vetor3[] | null {
    const pontos: Vetor3[] = [];

    for (const indiceVertice of face.indicesVertices) {
        const ponto = malha.vertices[indiceVertice];

        if (ponto === undefined) return null;

        pontos.push(ponto);
    }

    return pontos;
};

function calculaNormalPontosFaceBevelEditor3D(pontos: readonly Vetor3[]): Vetor3 | null {
    const origem = pontos[0];

    if (origem === undefined) return null;

    for (let indice = 1; indice < pontos.length - 1; indice++) {
        const normal = normalizaVetorEditor3D(produtoVetorialEditor3D(subtraiVetoresEditor3D(pontos[indice], origem), subtraiVetoresEditor3D(pontos[indice + 1], origem)));

        if (normal !== null) return normal;
    }

    return null;
};

function faceEhPlanaBevelEditor3D(pontos: readonly Vetor3[], normal: Vetor3): boolean {
    const origem = pontos[0];

    return pontos.every(ponto => Math.abs(produtoEscalarEditor3D(subtraiVetoresEditor3D(ponto, origem), normal)) <= toleranciaBevelEditor3D);
};

function criaBaseFaceBevelEditor3D(pontos: readonly Vetor3[], normal: Vetor3): BaseFaceBevelEditor3D | null {
    const origem = pontos[0];

    if (origem === undefined) return null;

    for (let indice = 1; indice < pontos.length; indice++) {
        const eixoU = normalizaVetorEditor3D(subtraiVetoresEditor3D(pontos[indice], origem));

        if (eixoU === null) continue;

        const eixoV = normalizaVetorEditor3D(produtoVetorialEditor3D(normal, eixoU));

        if (eixoV !== null) return { origem, eixoU, eixoV };
    }

    return null;
};

function projetaPontoFaceBevelEditor3D(base: BaseFaceBevelEditor3D, ponto: Vetor3): Vetor2BevelEditor3D {
    const relativo = subtraiVetoresEditor3D(ponto, base.origem);

    return { x: produtoEscalarEditor3D(relativo, base.eixoU), y: produtoEscalarEditor3D(relativo, base.eixoV) };
};

function reconstroiPontoFaceBevelEditor3D(base: BaseFaceBevelEditor3D, ponto: Vetor2BevelEditor3D): Vetor3 {
    return somaVetoresEditor3D(base.origem, somaVetoresEditor3D(multiplicaVetorEditor3D(base.eixoU, ponto.x), multiplicaVetorEditor3D(base.eixoV, ponto.y)));
};

function calculaAreaPoligono2DBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[]): number {
    let area = 0;

    pontos.forEach((ponto, indice) => {
        const proximo = pontos[(indice + 1) % pontos.length];

        area += (ponto.x * proximo.y) - (proximo.x * ponto.y);
    });

    return area * 0.5;
};

function poligonoConvexo2DBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[], orientacao: number): boolean {
    let encontrouAnguloValido = false;

    for (let indice = 0; indice < pontos.length; indice++) {
        const anterior = pontos[(indice + pontos.length - 1) % pontos.length];
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];
        const sinal = produtoVetorial2DBevelEditor3D(subtraiVetores2DBevelEditor3D(atual, anterior), subtraiVetores2DBevelEditor3D(proximo, atual));

        if (orientacao > 0 && sinal < -toleranciaBevelEditor3D) return false;
        if (orientacao < 0 && sinal > toleranciaBevelEditor3D) return false;
        if (Math.abs(sinal) > toleranciaBevelEditor3D) encontrouAnguloValido = true;
    }

    return encontrouAnguloValido;
};

function calculaCentroPontos2DBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[]): Vetor2BevelEditor3D {
    const soma = pontos.reduce<Vetor2BevelEditor3D>((total, ponto) => somaVetores2DBevelEditor3D(total, ponto), { x: 0, y: 0 });

    return multiplicaVetor2DBevelEditor3D(soma, 1 / pontos.length);
};

function calculaDistanciaPontoLinha2DBevelEditor3D(ponto: Vetor2BevelEditor3D, origem: Vetor2BevelEditor3D, destino: Vetor2BevelEditor3D): number {
    const direcao = subtraiVetores2DBevelEditor3D(destino, origem);
    const tamanho = tamanhoVetor2DBevelEditor3D(direcao);

    if (tamanho <= toleranciaBevelEditor3D) return 0;

    return Math.abs(produtoVetorial2DBevelEditor3D(direcao, subtraiVetores2DBevelEditor3D(ponto, origem))) / tamanho;
};

function obtemLarguraSeguraFaceBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[], largura: number): number {
    const centro = calculaCentroPontos2DBevelEditor3D(pontos);
    let menorDistancia = Number.POSITIVE_INFINITY;

    pontos.forEach((ponto, indice) => {
        const proximo = pontos[(indice + 1) % pontos.length];
        const distancia = calculaDistanciaPontoLinha2DBevelEditor3D(centro, ponto, proximo);

        menorDistancia = Math.min(menorDistancia, distancia);
    });

    if (!Number.isFinite(menorDistancia) || menorDistancia <= toleranciaBevelEditor3D) return 0;

    return Math.min(largura, menorDistancia * 0.86);
};

function obtemNormalInternaAresta2DBevelEditor3D(origem: Vetor2BevelEditor3D, destino: Vetor2BevelEditor3D, orientacao: number): Vetor2BevelEditor3D | null {
    const direcao = normalizaVetor2DBevelEditor3D(subtraiVetores2DBevelEditor3D(destino, origem));

    if (direcao === null) return null;

    return orientacao > 0 ? { x: -direcao.y, y: direcao.x } : { x: direcao.y, y: -direcao.x };
};

function criaLinhasOffsetFaceBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[], distancia: number, orientacao: number): LinhaOffsetBevelEditor3D[] | null {
    const linhas: LinhaOffsetBevelEditor3D[] = [];

    for (let indice = 0; indice < pontos.length; indice++) {
        const origem = pontos[indice];
        const destino = pontos[(indice + 1) % pontos.length];
        const normalInterna = obtemNormalInternaAresta2DBevelEditor3D(origem, destino, orientacao);

        if (normalInterna === null) return null;

        linhas.push({ ponto: somaVetores2DBevelEditor3D(origem, multiplicaVetor2DBevelEditor3D(normalInterna, distancia)), direcao: subtraiVetores2DBevelEditor3D(destino, origem) });
    }

    return linhas;
};

function calculaInterseccaoLinhas2DBevelEditor3D(a: LinhaOffsetBevelEditor3D, b: LinhaOffsetBevelEditor3D): Vetor2BevelEditor3D | null {
    const denominador = produtoVetorial2DBevelEditor3D(a.direcao, b.direcao);

    if (Math.abs(denominador) <= toleranciaBevelEditor3D) return null;

    const delta = subtraiVetores2DBevelEditor3D(b.ponto, a.ponto);
    const fator = produtoVetorial2DBevelEditor3D(delta, b.direcao) / denominador;

    return somaVetores2DBevelEditor3D(a.ponto, multiplicaVetor2DBevelEditor3D(a.direcao, fator));
};

function criaPontosOffsetFaceBevelEditor3D(pontos: readonly Vetor2BevelEditor3D[], distancia: number, orientacao: number): Vetor2BevelEditor3D[] | null {
    const linhas = criaLinhasOffsetFaceBevelEditor3D(pontos, distancia, orientacao);

    if (linhas === null) return null;

    const pontosOffset: Vetor2BevelEditor3D[] = [];

    for (let indice = 0; indice < pontos.length; indice++) {
        const linhaAnterior = linhas[(indice + linhas.length - 1) % linhas.length];
        const linhaAtual = linhas[indice];
        const ponto = calculaInterseccaoLinhas2DBevelEditor3D(linhaAnterior, linhaAtual);

        if (ponto === null) return null;

        pontosOffset.push(ponto);
    }

    const areaOffset = calculaAreaPoligono2DBevelEditor3D(pontosOffset);

    if (Math.abs(areaOffset) <= toleranciaBevelEditor3D) return null;
    if ((areaOffset > 0) !== (orientacao > 0)) return null;
    if (!poligonoConvexo2DBevelEditor3D(pontosOffset, orientacao)) return null;

    return pontosOffset;
};

function criaAnelOffsetFaceBevelEditor3D(face: FaceMalhaEditavelEditor3D, vertices: Vetor3[], base: BaseFaceBevelEditor3D, pontos2D: readonly Vetor2BevelEditor3D[], distancia: number, orientacao: number): number[] | null {
    if (Math.abs(distancia) <= toleranciaBevelEditor3D) return [...face.indicesVertices];

    const pontosOffset = criaPontosOffsetFaceBevelEditor3D(pontos2D, distancia, orientacao);

    if (pontosOffset === null) return null;

    return pontosOffset.map(ponto => {
        const indiceVertice = vertices.length;

        vertices.push(reconstroiPontoFaceBevelEditor3D(base, ponto));

        return indiceVertice;
    });
};

function facePodeReceberBevelPorContornoEditor3D(pontos: readonly Vetor3[], pontos2D: readonly Vetor2BevelEditor3D[], normal: Vetor3, orientacao: number): boolean {
    if (pontos.length < 3) return false;
    if (!faceEhPlanaBevelEditor3D(pontos, normal)) return false;

    return poligonoConvexo2DBevelEditor3D(pontos2D, orientacao);
};

function criaMapaSubstituicaoVerticesBevelEditor3D(face: FaceMalhaEditavelEditor3D, anelExterno: readonly number[]): Map<number, number> {
    const substituicoes = new Map<number, number>();

    face.indicesVertices.forEach((indiceVertice, indice) => {
        const indiceExterno = anelExterno[indice];

        if (indiceExterno !== undefined) substituicoes.set(indiceVertice, indiceExterno);
    });

    return substituicoes;
};

function criaChavesArestasFaceBevelEditor3D(face: FaceMalhaEditavelEditor3D): Set<string> {
    const chaves = new Set<string>();

    face.indicesVertices.forEach((indiceOrigem, indice) => {
        const indiceDestino = face.indicesVertices[(indice + 1) % face.indicesVertices.length];

        chaves.add(criaChaveArestaBevelEditor3D(indiceOrigem, indiceDestino));
    });

    return chaves;
};

function faceCompartilhaArestaBevelEditor3D(face: FaceMalhaEditavelEditor3D, chavesArestas: ReadonlySet<string>): boolean {
    return face.indicesVertices.some((indiceOrigem, indice) => {
        const indiceDestino = face.indicesVertices[(indice + 1) % face.indicesVertices.length];

        return chavesArestas.has(criaChaveArestaBevelEditor3D(indiceOrigem, indiceDestino));
    });
};

function substituiContornoFaceVizinhaBevelEditor3D(face: FaceMalhaEditavelEditor3D, chavesArestasFaceBevel: ReadonlySet<string>, substituicoes: ReadonlyMap<number, number>): FaceMalhaEditavelEditor3D {
    if (!faceCompartilhaArestaBevelEditor3D(face, chavesArestasFaceBevel)) return face;

    const indicesVertices = face.indicesVertices.map(indiceVertice => substituicoes.get(indiceVertice) ?? indiceVertice);

    return { ...face, indicesVertices };
};

export function normalizaLarguraBevelEditor3D(largura: number): number { return Math.max(0, Math.min(larguraBevelMaximaEditor3D, largura)); };
export function normalizaSegmentosBevelEditor3D(segmentos: number): number { return Math.max(1, Math.min(segmentosBevelMaximoEditor3D, Math.round(segmentos))); };

export function aplicaBevelFaceMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D, idFace: string, largura: number, segmentos: number): ResultadoBevelMalhaEditavelEditor3D | null {
    const face = obtemFaceMalhaEditavelEditor3D(malha, idFace);
    const larguraNormalizada = normalizaLarguraBevelEditor3D(largura);
    const segmentosNormalizados = normalizaSegmentosBevelEditor3D(segmentos);

    if (face === null) return null;
    if (new Set(face.indicesVertices).size !== face.indicesVertices.length) return null;
    if (larguraNormalizada <= toleranciaBevelEditor3D) return { malha, idsFacesBevel: [] };

    const pontos = obtemPontosFaceBevelEditor3D(malha, face);
    const normal = pontos === null ? null : calculaNormalPontosFaceBevelEditor3D(pontos);
    const base = pontos === null || normal === null ? null : criaBaseFaceBevelEditor3D(pontos, normal);

    if (pontos === null || normal === null || base === null) return null;

    const pontos2D = pontos.map(ponto => projetaPontoFaceBevelEditor3D(base, ponto));
    const area = calculaAreaPoligono2DBevelEditor3D(pontos2D);

    if (Math.abs(area) <= toleranciaBevelEditor3D) return null;
    if (!facePodeReceberBevelPorContornoEditor3D(pontos, pontos2D, normal, area)) return null;

    const larguraSegura = obtemLarguraSeguraFaceBevelEditor3D(pontos2D, larguraNormalizada);

    if (larguraSegura <= toleranciaBevelEditor3D) return { malha, idsFacesBevel: [] };

    const vertices: Vetor3[] = [...malha.vertices];
    const aneis: number[][] = [];

    for (let segmento = 0; segmento <= segmentosNormalizados; segmento++) {
        const distancia = -larguraSegura + ((larguraSegura * 2) * (segmento / segmentosNormalizados));
        const anel = criaAnelOffsetFaceBevelEditor3D(face, vertices, base, pontos2D, distancia, area);

        if (anel === null) return null;

        aneis.push(anel);
    }

    const anelExterno = aneis[0];
    const chavesArestasFaceBevel = criaChavesArestasFaceBevelEditor3D(face);
    const substituicoes = criaMapaSubstituicaoVerticesBevelEditor3D(face, anelExterno);
    const faces: FaceMalhaEditavelEditor3D[] = malha.faces.filter(faceAtual => faceAtual.id !== face.id).map(faceAtual => substituiContornoFaceVizinhaBevelEditor3D(faceAtual, chavesArestasFaceBevel, substituicoes));
    const idsFacesBevel: string[] = [];
    let proximoIdFace = malha.proximoIdFace;

    for (let indiceAnel = 0; indiceAnel < aneis.length - 1; indiceAnel++) {
        const anelExterno = aneis[indiceAnel];
        const anelInterno = aneis[indiceAnel + 1];

        anelExterno.forEach((indiceVertice, indice) => {
            const proximoIndice = (indice + 1) % anelExterno.length;
            const idFace = criaIdFaceBevelEditor3D(proximoIdFace);

            faces.push({ id: idFace, nome: `Bevel Ring ${indiceAnel + 1}.${indice + 1}`, indicesVertices: [indiceVertice, anelExterno[proximoIndice], anelInterno[proximoIndice], anelInterno[indice]] });
            idsFacesBevel.push(idFace);
            proximoIdFace += 1;
        });
    }

    faces.push({ ...face, indicesVertices: aneis[aneis.length - 1] });

    return { malha: { vertices, faces, proximoIdFace }, idsFacesBevel };
};

export function aplicaBevelMalhaEditavelEditor3D(malha: MalhaEditavelEditor3D, arestasSelecionadas: readonly ArestaBevelMalhaEditavelEditor3D[], largura: number, segmentos: number): ResultadoBevelMalhaEditavelEditor3D | null {
    const arestas = normalizaArestasBevelEditor3D(arestasSelecionadas);
    const larguraNormalizada = normalizaLarguraBevelEditor3D(largura);
    const segmentosNormalizados = normalizaSegmentosBevelEditor3D(segmentos);

    if (arestas.length === 0) return null;
    if (larguraNormalizada <= toleranciaBevelEditor3D) return { malha, idsFacesBevel: [] };

    const chavesArestas = new Set(arestas.map(aresta => criaChaveArestaBevelEditor3D(aresta.indiceOrigem, aresta.indiceDestino)));
    const vertices: Vetor3[] = [...malha.vertices];
    const ocorrencias: OcorrenciaArestaBevelEditor3D[] = [];

    malha.faces.forEach((face, indiceFace) => {
        face.indicesVertices.forEach((indiceOrigem, indiceAresta) => {
            const indiceDestino = face.indicesVertices[(indiceAresta + 1) % face.indicesVertices.length];
            const chave = criaChaveArestaBevelEditor3D(indiceOrigem, indiceDestino);

            if (!chavesArestas.has(chave)) return;

            const ocorrencia = criaOcorrenciaArestaBevelEditor3D(malha, face, indiceFace, indiceAresta, larguraNormalizada, vertices);

            if (ocorrencia !== null) ocorrencias.push(ocorrencia);
        });
    });

    if (ocorrencias.length === 0) return null;

    const facesOriginais = criaFacesOriginaisComBevelEditor3D(malha, ocorrencias);
    const facesBevel = criaFacesBevelPorArestaEditor3D(malha, vertices, ocorrencias, arestas, segmentosNormalizados);

    return { malha: { vertices, faces: [...facesOriginais, ...facesBevel.faces], proximoIdFace: facesBevel.proximoIdFace }, idsFacesBevel: facesBevel.faces.map(face => face.id) };
};
