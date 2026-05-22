import { alteraQuantidadeVerticesEditor3D, atualizaQuantidadeVerticesObjetoEditor3D, atualizaVetorObjetoEditor3D, criaProximoObjetoEditor3D, defineQuantidadeVerticesEditor3D } from './editor3D.reducer.objetos';
import { obtemDefinicaoMalhaEditor3D } from '../editor/editor3D.objetos';
import type { CampoVetorMalhaEditor3D, IndiceVetor3Editor3D, TipoMalhaEditor3D } from '../editor/editor3D.tipos';
import type { ColecaoCenaEditor3D, Editor3DState } from './editor3D.estado.types';

function obtemIdColecaoDestinoCriacaoEditor3D(state: Editor3DState): string | null {
    if (state.idColecaoSelecionada === null) return null;
    if (!state.colecoes.some(colecao => colecao.id === state.idColecaoSelecionada)) return null;

    return state.idColecaoSelecionada;
};

function adicionaObjetoNaColecaoDestinoEditor3D(colecoes: ColecaoCenaEditor3D[], idColecaoDestino: string | null, idObjeto: string): ColecaoCenaEditor3D[] {
    if (idColecaoDestino === null) return colecoes;

    return colecoes.map(colecao => {
        if (colecao.id !== idColecaoDestino) return colecao;
        if (colecao.idsObjetos.includes(idObjeto)) return colecao;

        return { ...colecao, idsObjetos: [...colecao.idsObjetos, idObjeto] };
    });
};

export function iniciaMalhaEmCriacaoEditor3D(state: Editor3DState, tipoMalha: TipoMalhaEditor3D): Editor3DState {
    if (state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    const definicao = obtemDefinicaoMalhaEditor3D(tipoMalha);
    const malhaEmCriacao = criaProximoObjetoEditor3D(state.proximoId, tipoMalha, definicao.quantidadePadrao);

    return { ...state, tipoSelecionado: tipoMalha, quantidadeVertices: definicao.quantidadePadrao, malhaEmCriacao, idObjetoSelecionado: null, idsObjetosSelecionados: [] };
};

export function atualizaQuantidadeVerticesStateEditor3D(state: Editor3DState, quantidadeVertices: number): Editor3DState {
    const quantidadeFinal = defineQuantidadeVerticesEditor3D(quantidadeVertices, state.tipoSelecionado);
    const malhaEmCriacao = state.malhaEmCriacao === null ? null : atualizaQuantidadeVerticesObjetoEditor3D(state.malhaEmCriacao, quantidadeFinal);

    return { ...state, quantidadeVertices: quantidadeFinal, malhaEmCriacao };
};

export function alteraQuantidadeVerticesStateEditor3D(state: Editor3DState, delta: number): Editor3DState {
    const quantidadeVertices = alteraQuantidadeVerticesEditor3D(state.quantidadeVertices, state.tipoSelecionado, delta);

    return atualizaQuantidadeVerticesStateEditor3D(state, quantidadeVertices);
};

export function atualizaVetorMalhaEmCriacaoEditor3D(state: Editor3DState, campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number): Editor3DState {
    if (state.malhaEmCriacao === null) return state;

    return { ...state, malhaEmCriacao: atualizaVetorObjetoEditor3D(state.malhaEmCriacao, campo, indice, valor) };
};

export function confirmaMalhaEmCriacaoEditor3D(state: Editor3DState): Editor3DState {
    if (state.malhaEmCriacao === null) return state;

    const idColecaoDestino = obtemIdColecaoDestinoCriacaoEditor3D(state);
    const colecoes = adicionaObjetoNaColecaoDestinoEditor3D(state.colecoes, idColecaoDestino, state.malhaEmCriacao.id);
    const objetoOcultoPelaColecao = idColecaoDestino !== null && state.idsColecoesOcultas.includes(idColecaoDestino);
    const idsObjetosOcultos = objetoOcultoPelaColecao && !state.idsObjetosOcultos.includes(state.malhaEmCriacao.id) ? [...state.idsObjetosOcultos, state.malhaEmCriacao.id] : state.idsObjetosOcultos;

    return { ...state, objetos: [...state.objetos, state.malhaEmCriacao], idsObjetosOcultos, colecoes, idObjetoSelecionado: state.malhaEmCriacao.id, idsObjetosSelecionados: [state.malhaEmCriacao.id], idColecaoSelecionada: null, malhaEmCriacao: null, proximoId: state.proximoId + 1 };
};