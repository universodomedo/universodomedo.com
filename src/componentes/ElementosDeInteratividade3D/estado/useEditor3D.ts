'use client';

import { useMemo, useReducer } from 'react';

import { editor3DReducer } from './editor3D.reducer';
import { criaEstadoInicialEditor3D } from './editor3D.estado.inicial';
import type { Editor3DAcoes, Editor3DModelo } from './editor3D.estado.types';

export function useEditor3D(): Editor3DModelo {
    const [estado, dispatch] = useReducer(editor3DReducer, undefined, criaEstadoInicialEditor3D);

    const acoes = useMemo<Editor3DAcoes>(() => ({
        atualizaCamera: camera => dispatch({ tipo: 'ATUALIZA_CAMERA', camera }),
        resetaCamera: () => dispatch({ tipo: 'RESETA_CAMERA' }),
        exibeNotificacaoAreaInterativa: texto => dispatch({ tipo: 'EXIBE_NOTIFICACAO_AREA_INTERATIVA', texto }),
        limpaNotificacaoAreaInterativa: id => dispatch({ tipo: 'LIMPA_NOTIFICACAO_AREA_INTERATIVA', id }),
        entraModoEdicao: () => dispatch({ tipo: 'ENTRA_MODO_EDICAO' }),
        saiModoEdicao: () => dispatch({ tipo: 'SAI_MODO_EDICAO' }),
        alternaModoOperacao: () => dispatch({ tipo: 'ALTERNA_MODO_OPERACAO' }),
        defineTipoSelecaoEdicao: tipoSelecao => dispatch({ tipo: 'DEFINE_TIPO_SELECAO_EDICAO', tipoSelecao }),
        selecionaVerticeEdicao: (idObjeto, indiceVertice) => dispatch({ tipo: 'SELECIONA_VERTICE_EDICAO', idObjeto, indiceVertice }),
        selecionaArestaEdicao: (idObjeto, indiceOrigem, indiceDestino) => dispatch({ tipo: 'SELECIONA_ARESTA_EDICAO', idObjeto, indiceOrigem, indiceDestino }),
        selecionaFaceEdicao: (idObjeto, idFace) => dispatch({ tipo: 'SELECIONA_FACE_EDICAO', idObjeto, idFace }),
        iniciaInsetFaceSelecionada: () => dispatch({ tipo: 'INICIA_INSET_FACE_SELECIONADA' }),
        atualizaInsetFaceEmEdicao: deltaEscala => dispatch({ tipo: 'ATUALIZA_INSET_FACE_EM_EDICAO', deltaEscala }),
        confirmaInsetFaceEmEdicao: () => dispatch({ tipo: 'CONFIRMA_INSET_FACE_EM_EDICAO' }),
        cancelaInsetFaceEmEdicao: () => dispatch({ tipo: 'CANCELA_INSET_FACE_EM_EDICAO' }),
        moveSelecaoEdicao: delta => dispatch({ tipo: 'MOVE_SELECAO_EDICAO', delta }),
        aplicaInsetFaceSelecionada: () => dispatch({ tipo: 'APLICA_INSET_FACE_SELECIONADA' }),
        ativaFerramentaMouse: ferramenta => dispatch({ tipo: 'ATIVA_FERRAMENTA_MOUSE', ferramenta }),
        resetaFerramentaMouse: () => dispatch({ tipo: 'RESETA_FERRAMENTA_MOUSE' }),
        iniciaAreaSelecao: (x, y, adicionando) => dispatch({ tipo: 'INICIA_AREA_SELECAO', x, y, adicionando }),
        atualizaAreaSelecao: (x, y) => dispatch({ tipo: 'ATUALIZA_AREA_SELECAO', x, y }),
        finalizaAreaSelecao: () => dispatch({ tipo: 'FINALIZA_AREA_SELECAO' }),
        atualizaCursorVirtual: (x, y, ativo) => dispatch({ tipo: 'ATUALIZA_CURSOR_VIRTUAL', x, y, ativo }),
        desativaCursorVirtual: () => dispatch({ tipo: 'DESATIVA_CURSOR_VIRTUAL' }),
        selecionaObjeto: (idObjeto, adiciona = false) => dispatch({ tipo: 'SELECIONA_OBJETO', idObjeto, adiciona }),
        selecionaObjetos: (idsObjetos, adiciona = false) => dispatch({ tipo: 'SELECIONA_OBJETOS', idsObjetos, adiciona }),
        selecionaColecaoCena: idColecao => dispatch({ tipo: 'SELECIONA_COLECAO_CENA', idColecao }),
        criaColecaoCena: () => dispatch({ tipo: 'CRIA_COLECAO_CENA' }),
        renomeiaObjetoCena: (idObjeto, nome) => dispatch({ tipo: 'RENOMEIA_OBJETO_CENA', idObjeto, nome }),
        renomeiaColecaoCena: (idColecao, nome) => dispatch({ tipo: 'RENOMEIA_COLECAO_CENA', idColecao, nome }),
        moveObjetoParaColecaoCena: (idObjeto, idColecao, idObjetoReferencia = null, posicao = null) => dispatch({ tipo: 'MOVE_OBJETO_PARA_COLECAO_CENA', idObjeto, idColecao, idObjetoReferencia, posicao }),
        moveColecaoCena: (idColecao, idColecaoReferencia = null, posicao = null) => dispatch({ tipo: 'MOVE_COLECAO_CENA', idColecao, idColecaoReferencia, posicao }),
        deletaObjetosSelecionados: () => dispatch({ tipo: 'DELETA_OBJETOS_SELECIONADOS' }),
        alternaVisibilidadeObjeto: idObjeto => dispatch({ tipo: 'ALTERNA_VISIBILIDADE_OBJETO', idObjeto }),
        alternaVisibilidadeColecao: idColecao => dispatch({ tipo: 'ALTERNA_VISIBILIDADE_COLECAO', idColecao }),
        selecionaTipoMalha: tipoMalha => dispatch({ tipo: 'SELECIONA_TIPO_MALHA', tipoMalha }),
        alteraQuantidadeVertices: delta => dispatch({ tipo: 'ALTERA_QUANTIDADE_VERTICES', delta }),
        defineQuantidadeVertices: quantidadeVertices => dispatch({ tipo: 'DEFINE_QUANTIDADE_VERTICES', quantidadeVertices }),
        iniciaMalhaEmCriacao: tipoMalha => dispatch({ tipo: 'INICIA_MALHA_EM_CRIACAO', tipoMalha }),
        atualizaVetorMalhaEmCriacao: (campo, indice, valor) => dispatch({ tipo: 'ATUALIZA_VETOR_MALHA_EM_CRIACAO', campo, indice, valor }),
        atualizaVetorObjetoSelecionado: (campo, indice, valor) => dispatch({ tipo: 'ATUALIZA_VETOR_OBJETO_SELECIONADO', campo, indice, valor }),
        aplicaRotationScaleObjetosSelecionados: () => dispatch({ tipo: 'APLICA_ROTATION_SCALE_OBJETOS_SELECIONADOS' }),
        confirmaMalhaEmCriacao: () => dispatch({ tipo: 'CONFIRMA_MALHA_EM_CRIACAO' }),
        cancelaMalhaEmCriacao: () => dispatch({ tipo: 'CANCELA_MALHA_EM_CRIACAO' }),
        limpaCena: () => dispatch({ tipo: 'LIMPA_CENA' }),
        moveObjetoSelecionado: delta => dispatch({ tipo: 'MOVE_OBJETO_SELECIONADO', delta }),
        iniciaGrabObjetoSelecionado: () => dispatch({ tipo: 'INICIA_GRAB' }),
        aplicaEixoGrabObjetoSelecionado: eixo => dispatch({ tipo: 'APLICA_EIXO_GRAB', eixo }),
        moveObjetoGrab: delta => dispatch({ tipo: 'MOVE_OBJETO_GRAB', delta }),
        iniciaRotateObjetoSelecionado: () => dispatch({ tipo: 'INICIA_ROTATE' }),
        aplicaEixoRotateObjetoSelecionado: eixo => dispatch({ tipo: 'APLICA_EIXO_ROTATE', eixo }),
        aplicaRotateLivreObjetoSelecionado: () => dispatch({ tipo: 'APLICA_ROTATE_LIVRE' }),
        atualizaEntradaNumericaRotate: entrada => dispatch({ tipo: 'ATUALIZA_ENTRADA_NUMERICA_ROTATE', entrada }),
        rotacionaObjetoRotate: delta => dispatch({ tipo: 'ROTACIONA_OBJETO_ROTATE', delta }),
        iniciaScaleObjetoSelecionado: () => dispatch({ tipo: 'INICIA_SCALE' }),
        aplicaEixoScaleObjetoSelecionado: eixo => dispatch({ tipo: 'APLICA_EIXO_SCALE', eixo }),
        escalaObjetoScale: delta => dispatch({ tipo: 'ESCALA_OBJETO_SCALE', delta }),
        confirmaModoAtual: () => dispatch({ tipo: 'CONFIRMA_MODO' }),
        cancelaModoAtual: () => dispatch({ tipo: 'CANCELA_MODO' }),
    }), []);

    return { estado, acoes };
};
