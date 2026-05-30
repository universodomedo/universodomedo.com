import { aplicaInsetFaceMalhaEditavelComEscalaEditor3D, escalaInsetInicialEditor3D, normalizaEscalaInsetFaceEditor3D } from '../geometria/editor3D.geometria.insetFaces';
import { criaGeometriaObjetoEditor3D } from '../geometria/primitivas/editor3D.geometria.primitivas';
import { criaMalhaEditavelPorGeometriaEditor3D } from '../geometria/editor3D.geometria.malhaEditavel';
import type { Editor3DState } from './editor3D.estado.types';
import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, ObjetoCenaEditor3D, Vetor3 } from '../editor/editor3D.tipos';
import type { TipoSelecaoEdicaoEditor3D } from '../modoOperacao/editor3D.modoOperacao.tipos';

const sensibilidadeInsetMouseEditor3D = 0.003;

function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };

export function obtemMalhaEditavelObjetoEditor3D(objeto: ObjetoCenaEditor3D): MalhaEditavelEditor3D | null {
    if (objeto.malhaEditavel !== null) return objeto.malhaEditavel;

    return criaMalhaEditavelPorGeometriaEditor3D(criaGeometriaObjetoEditor3D(objeto));
};

export function garanteMalhaEditavelObjetoEditor3D(objeto: ObjetoCenaEditor3D): ObjetoCenaEditor3D | null {
    if (objeto.malhaEditavel !== null) return objeto;

    const malhaEditavel = obtemMalhaEditavelObjetoEditor3D(objeto);

    if (malhaEditavel === null) return null;

    return { ...objeto, malhaEditavel, versaoGeometria: objeto.versaoGeometria + 1 };
};

export function preparaObjetosEscopoEdicaoEditor3D(objetos: readonly ObjetoCenaEditor3D[], idsObjetos: readonly string[]): ObjetoCenaEditor3D[] {
    return objetos.map(objeto => {
        if (!idsObjetos.includes(objeto.id)) return objeto;

        return garanteMalhaEditavelObjetoEditor3D(objeto) ?? objeto;
    });
};

function objetoEstaNoEscopoEdicaoEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.escopoEdicao?.idsObjetos.includes(idObjeto) ?? false; };
function obtemObjetoEdicaoEditor3D(state: Editor3DState, idObjeto: string): ObjetoCenaEditor3D | null { return state.objetos.find(objeto => objeto.id === idObjeto) ?? null; };
function obtemFaceMalhaEditor3D(malha: MalhaEditavelEditor3D, idFace: string): FaceMalhaEditavelEditor3D | null { return malha.faces.find(face => face.id === idFace) ?? null; };

function limpaSelecaoEdicaoEditor3D(state: Editor3DState): Editor3DState {
    return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null };
};

function faceExisteNaMalhaEditor3D(malha: MalhaEditavelEditor3D, idFace: string): boolean { return obtemFaceMalhaEditor3D(malha, idFace) !== null; };

function arestaExisteNaFaceEditor3D(face: FaceMalhaEditavelEditor3D, indiceOrigem: number, indiceDestino: number): boolean {
    return face.indicesVertices.some((indiceVertice, indice) => {
        const proximo = face.indicesVertices[(indice + 1) % face.indicesVertices.length];

        return (indiceVertice === indiceOrigem && proximo === indiceDestino) || (indiceVertice === indiceDestino && proximo === indiceOrigem);
    });
};

function arestaExisteNaMalhaEditor3D(malha: MalhaEditavelEditor3D, indiceOrigem: number, indiceDestino: number): boolean {
    if (indiceOrigem === indiceDestino) return false;
    if (malha.vertices[indiceOrigem] === undefined || malha.vertices[indiceDestino] === undefined) return false;

    return malha.faces.some(face => arestaExisteNaFaceEditor3D(face, indiceOrigem, indiceDestino));
};

function obtemIndicesUnicosEditor3D(indices: readonly number[]): number[] {
    const indicesUnicos: number[] = [];

    indices.forEach(indice => {
        if (!indicesUnicos.includes(indice)) indicesUnicos.push(indice);
    });

    return indicesUnicos;
};

function obtemIndicesSelecaoEdicaoEditor3D(state: Editor3DState, malha: MalhaEditavelEditor3D, idObjeto: string): number[] {
    if (state.tipoSelecaoEdicao === 'VERTICE') {
        const vertice = state.verticeSelecionadoEdicao;

        if (vertice === null || vertice.idObjeto !== idObjeto || malha.vertices[vertice.indiceVertice] === undefined) return [];

        return [vertice.indiceVertice];
    }

    if (state.tipoSelecaoEdicao === 'ARESTA') {
        const aresta = state.arestaSelecionadaEdicao;

        if (aresta === null || aresta.idObjeto !== idObjeto || !arestaExisteNaMalhaEditor3D(malha, aresta.indiceOrigem, aresta.indiceDestino)) return [];

        return [aresta.indiceOrigem, aresta.indiceDestino];
    }

    const faceSelecionada = state.faceSelecionadaEdicao;

    if (faceSelecionada === null || faceSelecionada.idObjeto !== idObjeto) return [];

    const face = obtemFaceMalhaEditor3D(malha, faceSelecionada.idFace);

    return face === null ? [] : obtemIndicesUnicosEditor3D(face.indicesVertices);
};

function criaMalhaComVerticesMovidosEditor3D(malha: MalhaEditavelEditor3D, indicesMovidos: readonly number[], delta: Vetor3): MalhaEditavelEditor3D {
    const indices = new Set(indicesMovidos);
    const vertices = malha.vertices.map((vertice, indice) => indices.has(indice) ? somaVetoresEditor3D(vertice, delta) : vertice);

    return { ...malha, vertices };
};

export function defineTipoSelecaoEdicaoEditor3D(state: Editor3DState, tipoSelecao: TipoSelecaoEdicaoEditor3D): Editor3DState {
    if (state.modoOperacao !== 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.insetFaceEdicao !== null) return state;

    return { ...limpaSelecaoEdicaoEditor3D(state), tipoSelecaoEdicao: tipoSelecao };
};

export function selecionaVerticeEdicaoEditor3D(state: Editor3DState, idObjeto: string | null, indiceVertice: number | null): Editor3DState {
    if (state.modoOperacao !== 'EDICAO' || state.tipoSelecaoEdicao !== 'VERTICE' || state.insetFaceEdicao !== null) return state;
    if (idObjeto === null || indiceVertice === null) return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null };
    if (!objetoEstaNoEscopoEdicaoEditor3D(state, idObjeto)) return state;

    const objeto = obtemObjetoEdicaoEditor3D(state, idObjeto);
    const malhaEditavel = objeto?.malhaEditavel ?? null;

    if (objeto === null || malhaEditavel === null || malhaEditavel.vertices[indiceVertice] === undefined) return state;

    return { ...state, verticeSelecionadoEdicao: { idObjeto, indiceVertice }, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null };
};

export function selecionaArestaEdicaoEditor3D(state: Editor3DState, idObjeto: string | null, indiceOrigem: number | null, indiceDestino: number | null): Editor3DState {
    if (state.modoOperacao !== 'EDICAO' || state.tipoSelecaoEdicao !== 'ARESTA' || state.insetFaceEdicao !== null) return state;
    if (idObjeto === null || indiceOrigem === null || indiceDestino === null) return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null };
    if (!objetoEstaNoEscopoEdicaoEditor3D(state, idObjeto)) return state;

    const objeto = obtemObjetoEdicaoEditor3D(state, idObjeto);
    const malhaEditavel = objeto?.malhaEditavel ?? null;

    if (objeto === null || malhaEditavel === null || !arestaExisteNaMalhaEditor3D(malhaEditavel, indiceOrigem, indiceDestino)) return state;

    return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: { idObjeto, indiceOrigem, indiceDestino }, faceSelecionadaEdicao: null };
};

export function selecionaFaceEdicaoEditor3D(state: Editor3DState, idObjeto: string | null, idFace: string | null): Editor3DState {
    if (state.modoOperacao !== 'EDICAO' || state.tipoSelecaoEdicao !== 'FACE' || state.insetFaceEdicao !== null) return state;
    if (idObjeto === null || idFace === null) return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null };
    if (!objetoEstaNoEscopoEdicaoEditor3D(state, idObjeto)) return state;

    const objeto = obtemObjetoEdicaoEditor3D(state, idObjeto);
    const malhaEditavel = objeto?.malhaEditavel ?? null;

    if (objeto === null || malhaEditavel === null || !faceExisteNaMalhaEditor3D(malhaEditavel, idFace)) return state;

    return { ...state, verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: { idObjeto, idFace } };
};

export function iniciaInsetFaceSelecionadaEditor3D(state: Editor3DState): Editor3DState {
    const faceSelecionada = state.faceSelecionadaEdicao;
    const escopoEdicao = state.escopoEdicao;

    if (state.modoOperacao !== 'EDICAO' || state.tipoSelecaoEdicao !== 'FACE' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null) return state;
    if (faceSelecionada === null || escopoEdicao === null) return state;
    if (faceSelecionada.idObjeto !== escopoEdicao.idObjetoAtivo) return state;

    const objeto = state.objetos.find(objetoAtual => objetoAtual.id === faceSelecionada.idObjeto) ?? null;

    if (objeto === null) return state;

    const objetoComMalha = garanteMalhaEditavelObjetoEditor3D(objeto);
    const malhaEditavel = objetoComMalha?.malhaEditavel ?? null;

    if (objetoComMalha === null || malhaEditavel === null) return state;

    const resultado = aplicaInsetFaceMalhaEditavelComEscalaEditor3D(malhaEditavel, faceSelecionada.idFace, escalaInsetInicialEditor3D);

    if (resultado === null) return state;

    return { ...state, objetos: state.objetos.map(objetoAtual => objetoAtual.id === objeto.id ? { ...objetoComMalha, malhaEditavel: resultado.malha, versaoGeometria: objetoComMalha.versaoGeometria + 1 } : objetoAtual), faceSelecionadaEdicao: { idObjeto: objeto.id, idFace: resultado.idFaceInterna }, insetFaceEdicao: { idObjeto: objeto.id, idFaceOriginal: faceSelecionada.idFace, idFaceInterna: resultado.idFaceInterna, malhaOriginal: malhaEditavel, escala: escalaInsetInicialEditor3D } };
};

export function atualizaInsetFaceEmEdicaoEditor3D(state: Editor3DState, deltaEscala: number): Editor3DState {
    const insetFaceEdicao = state.insetFaceEdicao;

    if (insetFaceEdicao === null) return state;

    const proximaEscala = normalizaEscalaInsetFaceEditor3D(insetFaceEdicao.escala + (deltaEscala * sensibilidadeInsetMouseEditor3D));

    if (proximaEscala === insetFaceEdicao.escala) return state;

    const resultado = aplicaInsetFaceMalhaEditavelComEscalaEditor3D(insetFaceEdicao.malhaOriginal, insetFaceEdicao.idFaceOriginal, proximaEscala);

    if (resultado === null) return state;

    return { ...state, objetos: state.objetos.map(objetoAtual => objetoAtual.id === insetFaceEdicao.idObjeto ? { ...objetoAtual, malhaEditavel: resultado.malha, versaoGeometria: objetoAtual.versaoGeometria + 1 } : objetoAtual), faceSelecionadaEdicao: { idObjeto: insetFaceEdicao.idObjeto, idFace: resultado.idFaceInterna }, insetFaceEdicao: { ...insetFaceEdicao, idFaceInterna: resultado.idFaceInterna, escala: proximaEscala } };
};

export function confirmaInsetFaceEmEdicaoEditor3D(state: Editor3DState): Editor3DState {
    if (state.insetFaceEdicao === null) return state;

    return { ...state, insetFaceEdicao: null };
};

export function cancelaInsetFaceEmEdicaoEditor3D(state: Editor3DState): Editor3DState {
    const insetFaceEdicao = state.insetFaceEdicao;

    if (insetFaceEdicao === null) return state;

    return { ...state, objetos: state.objetos.map(objetoAtual => objetoAtual.id === insetFaceEdicao.idObjeto ? { ...objetoAtual, malhaEditavel: insetFaceEdicao.malhaOriginal, versaoGeometria: objetoAtual.versaoGeometria + 1 } : objetoAtual), faceSelecionadaEdicao: { idObjeto: insetFaceEdicao.idObjeto, idFace: insetFaceEdicao.idFaceOriginal }, insetFaceEdicao: null };
};

export function moveSelecaoEdicaoEditor3D(state: Editor3DState, delta: Vetor3): Editor3DState {
    const escopoEdicao = state.escopoEdicao;

    if (state.modoOperacao !== 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null || escopoEdicao === null) return state;

    const objeto = obtemObjetoEdicaoEditor3D(state, escopoEdicao.idObjetoAtivo);
    const malhaEditavel = objeto?.malhaEditavel ?? null;

    if (objeto === null || malhaEditavel === null) return state;

    const indicesMovidos = obtemIndicesSelecaoEdicaoEditor3D(state, malhaEditavel, objeto.id);

    if (indicesMovidos.length === 0) return state;

    const malhaMovida = criaMalhaComVerticesMovidosEditor3D(malhaEditavel, indicesMovidos, delta);

    return { ...state, objetos: state.objetos.map(objetoAtual => objetoAtual.id === objeto.id ? { ...objetoAtual, malhaEditavel: malhaMovida, versaoGeometria: objetoAtual.versaoGeometria + 1 } : objetoAtual) };
};

export function aplicaInsetFaceSelecionadaEditor3D(state: Editor3DState): Editor3DState {
    return iniciaInsetFaceSelecionadaEditor3D(state);
};
