import { aplicaVistaEixoGrabCameraEditor3D, criaCameraPadraoEditor3D } from '../editor/editor3D.camera';
import { alteraQuantidadeVerticesStateEditor3D, atualizaQuantidadeVerticesStateEditor3D, atualizaVetorMalhaEmCriacaoEditor3D, confirmaMalhaEmCriacaoEditor3D, iniciaMalhaEmCriacaoEditor3D } from './editor3D.reducer.criacao';
import { aplicaRotationScaleObjetosEditor3D, atualizaObjetosEditor3D, atualizaVetorObjetoEditor3D, moveObjetosEditor3D } from './editor3D.reducer.objetos';
import { aplicaEixoGrabEditor3D, aplicaEixoRotateEditor3D, aplicaEixoScaleEditor3D, aplicaRotateLivreEditor3D, atualizaEntradaNumericaRotateEditor3D, cancelaModoEditor3D, escalaModoScaleEditor3D, iniciaGrabEditor3D, iniciaRotateEditor3D, iniciaScaleEditor3D, moveModoGrabEditor3D, rotacionaModoRotateEditor3D } from './editor3D.reducer.modo';
import { obtemDefinicaoMalhaEditor3D } from '../editor/editor3D.objetos';
import { criaModoInativoEditor3D, modoEditor3DEstaAtivo } from '../modos/editor3D.modo.utils';
import { criaEstadoInicialEditor3D } from './editor3D.estado.inicial';
import type { Editor3DAcao, Editor3DState } from './editor3D.estado.types';

function idObjetoExisteEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.objetos.some(objeto => objeto.id === idObjeto); };

function normalizaIdsSelecionadosEditor3D(state: Editor3DState, idsObjetos: readonly string[]): string[] {
    const idsNormalizados: string[] = [];

    idsObjetos.forEach(idObjeto => {
        if (idsNormalizados.includes(idObjeto) || !idObjetoExisteEditor3D(state, idObjeto)) return;

        idsNormalizados.push(idObjeto);
    });

    return idsNormalizados;
};

function selecionaObjetosEditor3D(state: Editor3DState, idsObjetos: readonly string[], adiciona: boolean): Editor3DState {
    if (modoEditor3DEstaAtivo(state.modoAtual) || state.malhaEmCriacao !== null) return state;

    const idsValidos = normalizaIdsSelecionadosEditor3D(state, idsObjetos);

    if (idsValidos.length === 0 && adiciona) return state;

    const proximosIds = adiciona ? normalizaIdsSelecionadosEditor3D(state, [...state.idsObjetosSelecionados, ...idsValidos]) : idsValidos;
    const idObjetoSelecionado = idsValidos.length > 0 ? idsValidos[idsValidos.length - 1] : proximosIds[proximosIds.length - 1] ?? null;

    return { ...state, idObjetoSelecionado, idsObjetosSelecionados: proximosIds };
};

function atualizaVetorObjetoSelecionadoEditor3D(state: Editor3DState, acao: Extract<Editor3DAcao, { readonly tipo: 'ATUALIZA_VETOR_OBJETO_SELECIONADO' }>): Editor3DState {
    if (state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    return { ...state, objetos: atualizaObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, objeto => atualizaVetorObjetoEditor3D(objeto, acao.campo, acao.indice, acao.valor)) };
};

export function editor3DReducer(state: Editor3DState, acao: Editor3DAcao): Editor3DState {
    if (acao.tipo === 'ATUALIZA_CAMERA') return { ...state, camera: acao.camera };
    if (acao.tipo === 'RESETA_CAMERA') return { ...state, camera: criaCameraPadraoEditor3D() };
    if (acao.tipo === 'ATIVA_FERRAMENTA_MOUSE') return state.modoAtual.tipo === 'NENHUM' ? { ...state, ferramentaMouse: acao.ferramenta } : state;
    if (acao.tipo === 'RESETA_FERRAMENTA_MOUSE') return { ...state, ferramentaMouse: 'SELECIONAR' };
    if (acao.tipo === 'INICIA_AREA_SELECAO') return state.modoAtual.tipo === 'NENHUM' && state.malhaEmCriacao === null ? { ...state, areaSelecao: { inicioX: acao.x, inicioY: acao.y, fimX: acao.x, fimY: acao.y, adicionando: acao.adicionando } } : state;
    if (acao.tipo === 'ATUALIZA_AREA_SELECAO') return state.areaSelecao === null ? state : { ...state, areaSelecao: { ...state.areaSelecao, fimX: acao.x, fimY: acao.y } };
    if (acao.tipo === 'FINALIZA_AREA_SELECAO') return { ...state, areaSelecao: null };
    if (acao.tipo === 'ATUALIZA_CURSOR_VIRTUAL') return { ...state, cursorVirtual: { ativo: acao.ativo, x: acao.x, y: acao.y } };
    if (acao.tipo === 'DESATIVA_CURSOR_VIRTUAL') return { ...state, cursorVirtual: { ...state.cursorVirtual, ativo: false } };
    if (acao.tipo === 'SELECIONA_OBJETO') return selecionaObjetosEditor3D(state, acao.idObjeto === null ? [] : [acao.idObjeto], acao.adiciona);
    if (acao.tipo === 'SELECIONA_OBJETOS') return selecionaObjetosEditor3D(state, acao.idsObjetos, acao.adiciona);
    if (acao.tipo === 'SELECIONA_TIPO_MALHA') {
        const definicao = obtemDefinicaoMalhaEditor3D(acao.tipoMalha);

        return { ...state, tipoSelecionado: acao.tipoMalha, quantidadeVertices: definicao.quantidadePadrao };
    }
    if (acao.tipo === 'ALTERA_QUANTIDADE_VERTICES') return alteraQuantidadeVerticesStateEditor3D(state, acao.delta);
    if (acao.tipo === 'DEFINE_QUANTIDADE_VERTICES') return atualizaQuantidadeVerticesStateEditor3D(state, acao.quantidadeVertices);
    if (acao.tipo === 'INICIA_MALHA_EM_CRIACAO') return iniciaMalhaEmCriacaoEditor3D(state, acao.tipoMalha);
    if (acao.tipo === 'ATUALIZA_VETOR_MALHA_EM_CRIACAO') return atualizaVetorMalhaEmCriacaoEditor3D(state, acao.campo, acao.indice, acao.valor);
    if (acao.tipo === 'ATUALIZA_VETOR_OBJETO_SELECIONADO') return atualizaVetorObjetoSelecionadoEditor3D(state, acao);
    if (acao.tipo === 'APLICA_ROTATION_SCALE_OBJETOS_SELECIONADOS') return state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null ? state : { ...state, objetos: aplicaRotationScaleObjetosEditor3D(state.objetos, state.idsObjetosSelecionados) };
    if (acao.tipo === 'CONFIRMA_MALHA_EM_CRIACAO') return confirmaMalhaEmCriacaoEditor3D(state);
    if (acao.tipo === 'CANCELA_MALHA_EM_CRIACAO') return { ...state, malhaEmCriacao: null };
    if (acao.tipo === 'LIMPA_CENA') return criaEstadoInicialEditor3D();
    if (acao.tipo === 'MOVE_OBJETO_SELECIONADO' && state.idsObjetosSelecionados.length > 0 && state.modoAtual.tipo === 'NENHUM') return { ...state, objetos: moveObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, acao.delta) };
    if (acao.tipo === 'INICIA_GRAB') return iniciaGrabEditor3D(state);
    if (acao.tipo === 'APLICA_EIXO_GRAB' && state.modoAtual.tipo === 'GRAB') return { ...aplicaEixoGrabEditor3D(state, acao.eixo), camera: aplicaVistaEixoGrabCameraEditor3D(state.camera, acao.eixo) };
    if (acao.tipo === 'MOVE_OBJETO_GRAB') return moveModoGrabEditor3D(state, acao.delta);
    if (acao.tipo === 'INICIA_ROTATE') return iniciaRotateEditor3D(state);
    if (acao.tipo === 'APLICA_EIXO_ROTATE') return aplicaEixoRotateEditor3D(state, acao.eixo);
    if (acao.tipo === 'APLICA_ROTATE_LIVRE') return aplicaRotateLivreEditor3D(state);
    if (acao.tipo === 'ATUALIZA_ENTRADA_NUMERICA_ROTATE') return atualizaEntradaNumericaRotateEditor3D(state, acao.entrada);
    if (acao.tipo === 'ROTACIONA_OBJETO_ROTATE') return rotacionaModoRotateEditor3D(state, acao.delta);
    if (acao.tipo === 'INICIA_SCALE') return iniciaScaleEditor3D(state);
    if (acao.tipo === 'APLICA_EIXO_SCALE') return aplicaEixoScaleEditor3D(state, acao.eixo);
    if (acao.tipo === 'ESCALA_OBJETO_SCALE') return escalaModoScaleEditor3D(state, acao.delta);
    if (acao.tipo === 'CONFIRMA_MODO') return { ...state, modoAtual: criaModoInativoEditor3D(), cursorVirtual: { ...state.cursorVirtual, ativo: false } };
    if (acao.tipo === 'CANCELA_MODO') return { ...cancelaModoEditor3D(state), cursorVirtual: { ...state.cursorVirtual, ativo: false } };

    return state;
};