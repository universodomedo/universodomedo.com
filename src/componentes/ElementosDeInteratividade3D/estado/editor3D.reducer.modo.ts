import { atualizaObjetoEditor3D, atualizaObjetosEditor3D, escalaObjetosEditor3D, moveObjetosEditor3D, rotacionaObjetosEditor3D } from './editor3D.reducer.objetos';
import { criaMalhaComVerticesMovidosEditor3D, obtemIndicesSelecaoEdicaoEditor3D } from './editor3D.reducer.edicao';
import { criaModoInativoEditor3D } from '../modos/editor3D.modo.utils';
import type { Editor3DState } from './editor3D.estado.types';
import type { EixoEditor3D, ObjetoCenaEditor3D, Vetor3 } from '../editor/editor3D.tipos';

function obtemObjetosSelecionados(state: Editor3DState): ObjetoCenaEditor3D[] {
    const objetosSelecionados = state.objetos.filter(objeto => state.idsObjetosSelecionados.includes(objeto.id));

    if (state.idObjetoSelecionado === null) return objetosSelecionados;

    const objetoAtivo = objetosSelecionados.find(objeto => objeto.id === state.idObjetoSelecionado) ?? null;

    if (objetoAtivo === null) return objetosSelecionados;

    return [objetoAtivo, ...objetosSelecionados.filter(objeto => objeto.id !== objetoAtivo.id)];
};

function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
function obtemObjetoPorIdEditor3D(state: Editor3DState, idObjeto: string): ObjetoCenaEditor3D | null { return state.objetos.find(objeto => objeto.id === idObjeto) ?? null; };

function criaMapaPosicoesIniciaisEditor3D(objetos: readonly ObjetoCenaEditor3D[]): Record<string, Vetor3> {
    const posicoes: Record<string, Vetor3> = {};

    objetos.forEach(objeto => {
        posicoes[objeto.id] = objeto.posicao;
    });

    return posicoes;
};

function criaMapaRotacoesIniciaisEditor3D(objetos: readonly ObjetoCenaEditor3D[]): Record<string, Vetor3> {
    const rotacoes: Record<string, Vetor3> = {};

    objetos.forEach(objeto => {
        rotacoes[objeto.id] = objeto.rotacao;
    });

    return rotacoes;
};

function criaMapaEscalasIniciaisEditor3D(objetos: readonly ObjetoCenaEditor3D[]): Record<string, Vetor3> {
    const escalas: Record<string, Vetor3> = {};

    objetos.forEach(objeto => {
        escalas[objeto.id] = objeto.escala;
    });

    return escalas;
};

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); };

function converteEntradaNumericaRotateEditor3D(entrada: string): number | null {
    const texto = entrada.trim().replace(',', '.');

    if (texto === '' || texto === '-' || texto === '+' || texto === '.' || texto === ',' || texto === '-.' || texto === '+.') return null;

    const valor = Number(texto);

    return Number.isFinite(valor) ? valor : null;
};

function aplicaValorRotacaoEixoEditor3D(rotacaoInicial: Vetor3, eixo: EixoEditor3D, valorGraus: number): Vetor3 {
    const valorRadianos = grausParaRadianos(valorGraus);

    if (eixo === 'X') return [rotacaoInicial[0] + valorRadianos, rotacaoInicial[1], rotacaoInicial[2]];
    if (eixo === 'Y') return [rotacaoInicial[0], rotacaoInicial[1] + valorRadianos, rotacaoInicial[2]];

    return [rotacaoInicial[0], rotacaoInicial[1], rotacaoInicial[2] + valorRadianos];
};

export function iniciaGrabEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null || state.bevelEdicao !== null) return state;

    if (state.modoOperacao === 'EDICAO') {
        const idObjetoAtivo = state.escopoEdicao?.idObjetoAtivo ?? null;
        const objeto = idObjetoAtivo === null ? null : obtemObjetoPorIdEditor3D(state, idObjetoAtivo);
        const malhaEditavel = objeto?.malhaEditavel ?? null;

        if (objeto === null || malhaEditavel === null) return state;

        const indicesVertices = obtemIndicesSelecaoEdicaoEditor3D(state, malhaEditavel, objeto.id);

        if (indicesVertices.length === 0) return state;

        return { ...state, modoAtual: { tipo: 'GRAB', escopo: 'EDICAO', idObjeto: objeto.id, idsObjetos: [objeto.id], eixo: null, indicesVertices, malhaInicial: malhaEditavel, deltaAcumulado: [0, 0, 0] } };
    }

    const objetos = obtemObjetosSelecionados(state);
    const objetoAtivo = objetos[0] ?? null;

    if (objetoAtivo === null) return state;

    return { ...state, modoAtual: { tipo: 'GRAB', escopo: 'OBJETO', idObjeto: objetoAtivo.id, idsObjetos: objetos.map(objeto => objeto.id), eixo: null, posicaoInicial: objetoAtivo.posicao, posicoesIniciais: criaMapaPosicoesIniciaisEditor3D(objetos) } };
};

export function iniciaRotateEditor3D(state: Editor3DState): Editor3DState {
    const objetos = obtemObjetosSelecionados(state);
    const objetoAtivo = objetos[0] ?? null;

    if (objetoAtivo === null || state.modoAtual.tipo !== 'NENHUM') return state;

    return { ...state, modoAtual: { tipo: 'ROTATE', idObjeto: objetoAtivo.id, idsObjetos: objetos.map(objeto => objeto.id), eixo: null, livre: false, entradaNumerica: '', rotacaoInicial: objetoAtivo.rotacao, rotacoesIniciais: criaMapaRotacoesIniciaisEditor3D(objetos) } };
};

export function iniciaScaleEditor3D(state: Editor3DState): Editor3DState {
    const objetos = obtemObjetosSelecionados(state);
    const objetoAtivo = objetos[0] ?? null;

    if (objetoAtivo === null || state.modoAtual.tipo !== 'NENHUM') return state;

    return { ...state, modoAtual: { tipo: 'SCALE', idObjeto: objetoAtivo.id, idsObjetos: objetos.map(objeto => objeto.id), eixo: null, escalaInicial: objetoAtivo.escala, escalasIniciais: criaMapaEscalasIniciaisEditor3D(objetos) } };
};

export function aplicaEixoGrabEditor3D(state: Editor3DState, eixo: EixoEditor3D): Editor3DState {
    if (state.modoAtual.tipo !== 'GRAB') return state;

    return { ...state, modoAtual: { ...state.modoAtual, eixo } };
};

export function aplicaEixoRotateEditor3D(state: Editor3DState, eixo: EixoEditor3D): Editor3DState {
    if (state.modoAtual.tipo !== 'ROTATE') return state;

    return { ...state, modoAtual: { ...state.modoAtual, eixo, livre: false, entradaNumerica: '' } };
};

export function aplicaEixoScaleEditor3D(state: Editor3DState, eixo: EixoEditor3D): Editor3DState {
    if (state.modoAtual.tipo !== 'SCALE') return state;

    return { ...state, modoAtual: { ...state.modoAtual, eixo } };
};

export function aplicaRotateLivreEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoAtual.tipo !== 'ROTATE') return state;

    return { ...state, modoAtual: { ...state.modoAtual, eixo: null, livre: true, entradaNumerica: '' } };
};

export function atualizaEntradaNumericaRotateEditor3D(state: Editor3DState, entrada: string): Editor3DState {
    if (state.modoAtual.tipo !== 'ROTATE') return state;

    const modoAtualOriginal = state.modoAtual;
    const eixo = modoAtualOriginal.eixo;

    if (eixo === null) return state;

    const modoAtual = { ...modoAtualOriginal, entradaNumerica: entrada };
    const valorGraus = converteEntradaNumericaRotateEditor3D(entrada);

    if (valorGraus === null) return { ...state, modoAtual };

    return { ...state, modoAtual, objetos: atualizaObjetosEditor3D(state.objetos, modoAtualOriginal.idsObjetos, objeto => ({ ...objeto, rotacao: aplicaValorRotacaoEixoEditor3D(modoAtualOriginal.rotacoesIniciais[objeto.id] ?? objeto.rotacao, eixo, valorGraus) })) };
};

export function moveModoGrabEditor3D(state: Editor3DState, delta: Vetor3): Editor3DState {
    if (state.modoAtual.tipo !== 'GRAB') return state;
    if (state.modoAtual.escopo === 'EDICAO') {
        const modoAtual = state.modoAtual;

        return { ...state, objetos: state.objetos.map(objeto => objeto.id === modoAtual.idObjeto && objeto.malhaEditavel !== null ? { ...objeto, malhaEditavel: criaMalhaComVerticesMovidosEditor3D(objeto.malhaEditavel, modoAtual.indicesVertices, delta), versaoGeometria: objeto.versaoGeometria + 1 } : objeto), modoAtual: { ...modoAtual, deltaAcumulado: somaVetoresEditor3D(modoAtual.deltaAcumulado, delta) } };
    }

    return { ...state, objetos: moveObjetosEditor3D(state.objetos, state.modoAtual.idsObjetos, delta) };
};

export function rotacionaModoRotateEditor3D(state: Editor3DState, delta: Vetor3): Editor3DState {
    if (state.modoAtual.tipo !== 'ROTATE' || state.modoAtual.entradaNumerica !== '') return state;

    return { ...state, objetos: rotacionaObjetosEditor3D(state.objetos, state.modoAtual.idsObjetos, delta) };
};

export function escalaModoScaleEditor3D(state: Editor3DState, delta: Vetor3): Editor3DState {
    if (state.modoAtual.tipo !== 'SCALE') return state;

    return { ...state, objetos: escalaObjetosEditor3D(state.objetos, state.modoAtual.idsObjetos, delta) };
};

export function cancelaModoEditor3D(state: Editor3DState): Editor3DState {
    const modoAtual = state.modoAtual;

    if (modoAtual.tipo === 'GRAB' && modoAtual.escopo === 'EDICAO') return { ...state, modoAtual: criaModoInativoEditor3D(), objetos: state.objetos.map(objeto => objeto.id === modoAtual.idObjeto ? { ...objeto, malhaEditavel: modoAtual.malhaInicial, versaoGeometria: objeto.versaoGeometria + 1 } : objeto) };
    if (modoAtual.tipo === 'GRAB') return { ...state, modoAtual: criaModoInativoEditor3D(), objetos: atualizaObjetosEditor3D(state.objetos, modoAtual.idsObjetos, objeto => ({ ...objeto, posicao: modoAtual.posicoesIniciais[objeto.id] ?? objeto.posicao })) };
    if (modoAtual.tipo === 'ROTATE') return { ...state, modoAtual: criaModoInativoEditor3D(), objetos: atualizaObjetosEditor3D(state.objetos, modoAtual.idsObjetos, objeto => ({ ...objeto, rotacao: modoAtual.rotacoesIniciais[objeto.id] ?? objeto.rotacao })) };
    if (modoAtual.tipo === 'SCALE') return { ...state, modoAtual: criaModoInativoEditor3D(), objetos: atualizaObjetosEditor3D(state.objetos, modoAtual.idsObjetos, objeto => ({ ...objeto, escala: modoAtual.escalasIniciais[objeto.id] ?? objeto.escala })) };

    return state;
};
