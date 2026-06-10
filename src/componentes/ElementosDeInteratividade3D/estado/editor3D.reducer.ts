import { criaCameraPadraoEditor3D } from '../editor/editor3D.camera';
import { criaColecaoCenaEditor3D, obtemIdsObjetosColecaoEditor3D, removeObjetosDasColecoesEditor3D } from './editor3D.colecoes';
import { alteraSegmentosBevelEmEdicaoEditor3D, aplicaInsetFaceSelecionadaEditor3D, atualizaBevelEmEdicaoEditor3D, atualizaInsetFaceEmEdicaoEditor3D, cancelaBevelEmEdicaoEditor3D, cancelaInsetFaceEmEdicaoEditor3D, confirmaBevelEmEdicaoEditor3D, confirmaInsetFaceEmEdicaoEditor3D, defineTipoSelecaoEdicaoEditor3D, iniciaBevelSelecaoEditor3D, iniciaInsetFaceSelecionadaEditor3D, moveSelecaoEdicaoEditor3D, preparaObjetosEscopoEdicaoEditor3D, selecionaArestaEdicaoEditor3D, selecionaFaceEdicaoEditor3D, selecionaVerticeEdicaoEditor3D } from './editor3D.reducer.edicao';
import { alteraQuantidadeVerticesStateEditor3D, atualizaQuantidadeVerticesStateEditor3D, atualizaVetorMalhaEmCriacaoEditor3D, confirmaMalhaEmCriacaoEditor3D, criaPresetObjetoCenaEditor3D, iniciaMalhaEmCriacaoEditor3D } from './editor3D.reducer.criacao';
import { aplicaMaterialVisualObjetoEditor3D, aplicaRotationScaleObjetosEditor3D, atualizaObjetosEditor3D, atualizaVetorObjetoEditor3D, defineShaderObjetoEditor3D, moveObjetosEditor3D } from './editor3D.reducer.objetos';
import { aplicaEixoGrabEditor3D, aplicaEixoRotateEditor3D, aplicaEixoScaleEditor3D, aplicaRotateLivreEditor3D, atualizaEntradaNumericaRotateEditor3D, cancelaModoEditor3D, escalaModoScaleEditor3D, iniciaGrabEditor3D, iniciaRotateEditor3D, iniciaScaleEditor3D, moveModoGrabEditor3D, rotacionaModoRotateEditor3D } from './editor3D.reducer.modo';
import { desserializaCenaCanonicaParaEditor3D } from '../editor/editor3D.cenaCanonica.desserializador';
import { obtemDefinicaoMalhaEditor3D } from '../editor/editor3D.objetos';
import { atualizaAbaAtivaComSnapshotProjeto3DEditor3D, criaAbaProjeto3DDeProjetoPersistidoEditor3D, criaAbaProjeto3DVaziaEditor3D, criaAssinaturaCenaCanonicaEditor3D, criaIdAbaProjeto3DEditor3D, criaNomeNovoProjetoEditor3D, obtemAbaProjeto3DAtivaEditor3D } from './editor3D.abasProjeto';
import { serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import { criaModoInativoEditor3D, modoEditor3DEstaAtivo } from '../modos/editor3D.modo.utils';
import { criaEstadoInicialEditor3D } from './editor3D.estado.inicial';
import { modoVisualizacaoViewportPermiteXRayEditor3D } from '../viewport/editor3D.viewport.tipos';
import type { AbaProjeto3DEditor3D, ColecaoCenaEditor3D, Editor3DAcao, Editor3DState, PosicaoSoltarCenaEditor3D, ProjetoAbertoEditor3D } from './editor3D.estado.types';
import type { EscopoEdicaoEditor3D } from '../modoOperacao/editor3D.modoOperacao.tipos';
import type { MaterialVisualEditor3D } from '../editor/editor3D.materialVisual.tipos';
import type { ShaderEditor3D } from '../editor/editor3D.shader.tipos';
import type { ObjetoCenaEditor3D } from '../editor/editor3D.tipos';

function idObjetoExisteEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.objetos.some(objeto => objeto.id === idObjeto); };
function idObjetoEstaOcultoEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.idsObjetosOcultos.includes(idObjeto); };
function idColecaoExisteEditor3D(state: Editor3DState, idColecao: string): boolean { return state.colecoes.some(colecao => colecao.id === idColecao); };

function normalizaNomeCenaEditor3D(nome: string): string | null {
    const nomeNormalizado = nome.trim();

    return nomeNormalizado === '' ? null : nomeNormalizado;
};

function normalizaIdsObjetosExistentesEditor3D(state: Editor3DState, idsObjetos: readonly string[]): string[] {
    const idsNormalizados: string[] = [];

    idsObjetos.forEach(idObjeto => {
        if (idsNormalizados.includes(idObjeto) || !idObjetoExisteEditor3D(state, idObjeto)) return;

        idsNormalizados.push(idObjeto);
    });

    return idsNormalizados;
};

function normalizaIdsSelecionadosEditor3D(state: Editor3DState, idsObjetos: readonly string[]): string[] { return normalizaIdsObjetosExistentesEditor3D(state, idsObjetos); };

function obtemIdsObjetosColecaoStateEditor3D(state: Editor3DState, colecao: ColecaoCenaEditor3D): string[] { return obtemIdsObjetosColecaoEditor3D(colecao, state.objetos.map(objeto => objeto.id)); };

function obtemIdsObjetosColecoesOcultasEditor3D(state: Editor3DState, idsColecoesOcultas: readonly string[]): string[] {
    const idsObjetos: string[] = [];

    state.colecoes.filter(colecao => idsColecoesOcultas.includes(colecao.id)).forEach(colecao => {
        obtemIdsObjetosColecaoStateEditor3D(state, colecao).forEach(idObjeto => {
            if (!idsObjetos.includes(idObjeto)) idsObjetos.push(idObjeto);
        });
    });

    return idsObjetos;
};

function recalculaIdsObjetosOcultosEditor3D(state: Editor3DState, idsObjetosOcultosManualmente: readonly string[], idsColecoesOcultas: readonly string[]): string[] { return normalizaIdsObjetosExistentesEditor3D(state, [...idsObjetosOcultosManualmente, ...obtemIdsObjetosColecoesOcultasEditor3D(state, idsColecoesOcultas)]); };

function insereIdComReferenciaEditor3D(ids: readonly string[], idMovido: string, idReferencia: string | null, posicao: PosicaoSoltarCenaEditor3D | null): string[] {
    if (idReferencia === idMovido) return [...ids];

    const idsSemMovido = ids.filter(id => id !== idMovido);

    if (idReferencia === null || posicao === null) return [...idsSemMovido, idMovido];

    const indiceReferencia = idsSemMovido.indexOf(idReferencia);

    if (indiceReferencia < 0) return [...idsSemMovido, idMovido];

    const indiceInsercao = posicao === 'DEPOIS' ? indiceReferencia + 1 : indiceReferencia;

    return [...idsSemMovido.slice(0, indiceInsercao), idMovido, ...idsSemMovido.slice(indiceInsercao)];
};

function reordenaObjetosComReferenciaEditor3D(objetos: readonly ObjetoCenaEditor3D[], idMovido: string, idReferencia: string | null, posicao: PosicaoSoltarCenaEditor3D | null): ObjetoCenaEditor3D[] {
    if (idReferencia === idMovido) return [...objetos];

    const objetoMovido = objetos.find(objeto => objeto.id === idMovido) ?? null;

    if (objetoMovido === null) return [...objetos];

    const objetosSemMovido = objetos.filter(objeto => objeto.id !== idMovido);

    if (idReferencia === null || posicao === null) return [...objetosSemMovido, objetoMovido];

    const indiceReferencia = objetosSemMovido.findIndex(objeto => objeto.id === idReferencia);

    if (indiceReferencia < 0) return [...objetosSemMovido, objetoMovido];

    const indiceInsercao = posicao === 'DEPOIS' ? indiceReferencia + 1 : indiceReferencia;

    return [...objetosSemMovido.slice(0, indiceInsercao), objetoMovido, ...objetosSemMovido.slice(indiceInsercao)];
};

function reordenaColecoesComReferenciaEditor3D(colecoes: readonly ColecaoCenaEditor3D[], idMovido: string, idReferencia: string | null, posicao: PosicaoSoltarCenaEditor3D | null): ColecaoCenaEditor3D[] {
    if (idReferencia === idMovido) return [...colecoes];

    const colecaoMovida = colecoes.find(colecao => colecao.id === idMovido) ?? null;

    if (colecaoMovida === null) return [...colecoes];

    const colecoesSemMovida = colecoes.filter(colecao => colecao.id !== idMovido);

    if (idReferencia === null || posicao === null) return [...colecoesSemMovida, colecaoMovida];

    const indiceReferencia = colecoesSemMovida.findIndex(colecao => colecao.id === idReferencia);

    if (indiceReferencia < 0) return [...colecoesSemMovida, colecaoMovida];

    const indiceInsercao = posicao === 'DEPOIS' ? indiceReferencia + 1 : indiceReferencia;

    return [...colecoesSemMovida.slice(0, indiceInsercao), colecaoMovida, ...colecoesSemMovida.slice(indiceInsercao)];
};

function criaEscopoEdicaoEditor3D(state: Editor3DState): EscopoEdicaoEditor3D | null {
    const idsObjetos = normalizaIdsSelecionadosEditor3D(state, state.idsObjetosSelecionados);

    if (idsObjetos.length === 0) return null;

    const idObjetoAtivo = state.idObjetoSelecionado !== null && idsObjetos.includes(state.idObjetoSelecionado) ? state.idObjetoSelecionado : idsObjetos[idsObjetos.length - 1];

    return { idObjetoAtivo, idsObjetos };
};

function entraModoEdicaoEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoOperacao === 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    const escopoEdicao = criaEscopoEdicaoEditor3D(state);

    if (escopoEdicao === null) return state;

    return { ...state, objetos: preparaObjetosEscopoEdicaoEditor3D(state.objetos, escopoEdicao.idsObjetos), modoOperacao: 'EDICAO', escopoEdicao, tipoSelecaoEdicao: 'VERTICE', verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null, insetFaceEdicao: null, bevelEdicao: null, ferramentaMouse: 'SELECIONAR', areaSelecao: null };
};

function saiModoEdicaoEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoOperacao === 'OBJETO') return state;
    if (state.modoAtual.tipo !== 'NENHUM') return state;
    if (state.bevelEdicao !== null || state.insetFaceEdicao !== null) return state;

    return { ...state, modoOperacao: 'OBJETO', escopoEdicao: null, tipoSelecaoEdicao: 'VERTICE', verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null, insetFaceEdicao: null, bevelEdicao: null, ferramentaMouse: 'SELECIONAR', areaSelecao: null };
};

function alternaModoOperacaoEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoOperacao === 'OBJETO') return entraModoEdicaoEditor3D(state);

    return saiModoEdicaoEditor3D(state);
};

function selecionaObjetosEditor3D(state: Editor3DState, idsObjetos: readonly string[], adiciona: boolean): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || modoEditor3DEstaAtivo(state.modoAtual) || state.malhaEmCriacao !== null) return state;

    const idsValidos = normalizaIdsSelecionadosEditor3D(state, idsObjetos);

    if (idsValidos.length === 0 && adiciona) return state;

    const proximosIds = adiciona ? normalizaIdsSelecionadosEditor3D(state, [...state.idsObjetosSelecionados, ...idsValidos]) : idsValidos;
    const idObjetoSelecionado = idsValidos.length > 0 ? idsValidos[idsValidos.length - 1] : proximosIds[proximosIds.length - 1] ?? null;

    return { ...state, idObjetoSelecionado, idsObjetosSelecionados: proximosIds, idColecaoSelecionada: null };
};

function selecionaColecaoCenaEditor3D(state: Editor3DState, idColecao: string): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || modoEditor3DEstaAtivo(state.modoAtual) || state.malhaEmCriacao !== null) return state;

    const colecao = state.colecoes.find(colecaoCena => colecaoCena.id === idColecao) ?? null;

    if (colecao === null) return state;

    const idsObjetosSelecionados = obtemIdsObjetosColecaoStateEditor3D(state, colecao).filter(idObjeto => !idObjetoEstaOcultoEditor3D(state, idObjeto));

    return { ...state, idColecaoSelecionada: idColecao, idsObjetosSelecionados, idObjetoSelecionado: idsObjetosSelecionados[idsObjetosSelecionados.length - 1] ?? null };
};

function criaColecaoCenaStateEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    const colecao = criaColecaoCenaEditor3D(state.proximoIdColecao);

    if (state.modoOperacao !== 'OBJETO') return { ...state, colecoes: [...state.colecoes, colecao], proximoIdColecao: state.proximoIdColecao + 1 };

    return { ...state, colecoes: [...state.colecoes, colecao], idColecaoSelecionada: colecao.id, idsObjetosSelecionados: [], idObjetoSelecionado: null, proximoIdColecao: state.proximoIdColecao + 1 };
};

function renomeiaObjetoCenaEditor3D(state: Editor3DState, idObjeto: string, nome: string): Editor3DState {
    if (state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;
    if (!idObjetoExisteEditor3D(state, idObjeto)) return state;

    const nomeNormalizado = normalizaNomeCenaEditor3D(nome);

    if (nomeNormalizado === null) return state;

    return { ...state, objetos: state.objetos.map(objeto => objeto.id === idObjeto ? { ...objeto, nome: nomeNormalizado } : objeto) };
};

function renomeiaColecaoCenaEditor3D(state: Editor3DState, idColecao: string, nome: string): Editor3DState {
    if (state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    const nomeNormalizado = normalizaNomeCenaEditor3D(nome);

    if (nomeNormalizado === null) return state;

    return { ...state, colecoes: state.colecoes.map(colecao => colecao.id === idColecao ? { ...colecao, nome: nomeNormalizado } : colecao) };
};

function moveObjetoParaColecaoCenaEditor3D(state: Editor3DState, idObjeto: string, idColecaoDestino: string | null, idObjetoReferencia: string | null, posicao: PosicaoSoltarCenaEditor3D | null): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;
    if (!idObjetoExisteEditor3D(state, idObjeto)) return state;
    if (idObjetoReferencia !== null && (!idObjetoExisteEditor3D(state, idObjetoReferencia) || idObjetoReferencia === idObjeto)) return state;
    if (idColecaoDestino !== null && !idColecaoExisteEditor3D(state, idColecaoDestino)) return state;

    const objetos = idColecaoDestino === null ? reordenaObjetosComReferenciaEditor3D(state.objetos, idObjeto, idObjetoReferencia, posicao) : state.objetos;
    const colecoesSemObjeto = state.colecoes.map(colecao => colecao.idsObjetos.includes(idObjeto) ? { ...colecao, idsObjetos: colecao.idsObjetos.filter(idObjetoColecao => idObjetoColecao !== idObjeto) } : colecao);
    const colecoes = idColecaoDestino === null ? colecoesSemObjeto : colecoesSemObjeto.map(colecao => colecao.id === idColecaoDestino ? { ...colecao, idsObjetos: insereIdComReferenciaEditor3D(colecao.idsObjetos, idObjeto, idObjetoReferencia, posicao) } : colecao);
    const estadoBase = { ...state, objetos, colecoes };
    const idsObjetosOcultos = recalculaIdsObjetosOcultosEditor3D(estadoBase, state.idsObjetosOcultosManualmente, state.idsColecoesOcultas);
    const objetoFicouOculto = idsObjetosOcultos.includes(idObjeto);
    const idsObjetosSelecionados = objetoFicouOculto ? state.idsObjetosSelecionados.filter(idObjetoSelecionado => idObjetoSelecionado !== idObjeto) : state.idsObjetosSelecionados;
    const idObjetoSelecionado = objetoFicouOculto && state.idObjetoSelecionado === idObjeto ? idsObjetosSelecionados[idsObjetosSelecionados.length - 1] ?? null : state.idObjetoSelecionado;
    const verticeSelecionadoEdicao = objetoFicouOculto && state.verticeSelecionadoEdicao?.idObjeto === idObjeto ? null : state.verticeSelecionadoEdicao;
    const arestaSelecionadaEdicao = objetoFicouOculto && state.arestaSelecionadaEdicao?.idObjeto === idObjeto ? null : state.arestaSelecionadaEdicao;
    const faceSelecionadaEdicao = objetoFicouOculto && state.faceSelecionadaEdicao?.idObjeto === idObjeto ? null : state.faceSelecionadaEdicao;
    const insetFaceEdicao = objetoFicouOculto && state.insetFaceEdicao?.idObjeto === idObjeto ? null : state.insetFaceEdicao;
    const bevelEdicao = objetoFicouOculto && state.bevelEdicao?.idObjeto === idObjeto ? null : state.bevelEdicao;

    return { ...state, objetos, colecoes, idsObjetosOcultos, idsObjetosSelecionados, idObjetoSelecionado, idColecaoSelecionada: null, verticeSelecionadoEdicao, arestaSelecionadaEdicao, faceSelecionadaEdicao, insetFaceEdicao, bevelEdicao };
};

function moveColecaoCenaEditor3D(state: Editor3DState, idColecao: string, idColecaoReferencia: string | null, posicao: PosicaoSoltarCenaEditor3D | null): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;
    if (!idColecaoExisteEditor3D(state, idColecao)) return state;
    if (idColecaoReferencia !== null && (!idColecaoExisteEditor3D(state, idColecaoReferencia) || idColecaoReferencia === idColecao)) return state;

    return { ...state, colecoes: reordenaColecoesComReferenciaEditor3D(state.colecoes, idColecao, idColecaoReferencia, posicao) };
};

function deletaObjetosSelecionadosEditor3D(state: Editor3DState): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.idsObjetosSelecionados.length === 0) return state;

    const idsParaDeletar = new Set(state.idsObjetosSelecionados);
    const objetos = state.objetos.filter(objeto => !idsParaDeletar.has(objeto.id));
    const colecoes = removeObjetosDasColecoesEditor3D(state.colecoes, state.idsObjetosSelecionados);
    const idsObjetosOcultosManualmente = state.idsObjetosOcultosManualmente.filter(idObjeto => !idsParaDeletar.has(idObjeto));
    const estadoBase = { ...state, objetos, colecoes };
    const idsObjetosOcultos = recalculaIdsObjetosOcultosEditor3D(estadoBase, idsObjetosOcultosManualmente, state.idsColecoesOcultas);

    return { ...state, objetos, colecoes, idsObjetosOcultos, idsObjetosOcultosManualmente, idObjetoSelecionado: null, idsObjetosSelecionados: [] };
};

function alternaVisibilidadeObjetoEditor3D(state: Editor3DState, idObjeto: string): Editor3DState {
    if (!idObjetoExisteEditor3D(state, idObjeto)) return state;

    const objetoOcultoManualmente = state.idsObjetosOcultosManualmente.includes(idObjeto);
    const idsObjetosOcultosManualmente = objetoOcultoManualmente ? state.idsObjetosOcultosManualmente.filter(idObjetoOculto => idObjetoOculto !== idObjeto) : [...state.idsObjetosOcultosManualmente, idObjeto];
    const idsObjetosOcultos = recalculaIdsObjetosOcultosEditor3D(state, idsObjetosOcultosManualmente, state.idsColecoesOcultas);
    const objetoFicouOculto = idsObjetosOcultos.includes(idObjeto);
    const idsObjetosSelecionados = objetoFicouOculto ? state.idsObjetosSelecionados.filter(idObjetoSelecionado => idObjetoSelecionado !== idObjeto) : state.idsObjetosSelecionados;
    const idObjetoSelecionado = objetoFicouOculto && state.idObjetoSelecionado === idObjeto ? idsObjetosSelecionados[idsObjetosSelecionados.length - 1] ?? null : state.idObjetoSelecionado;
    const verticeSelecionadoEdicao = objetoFicouOculto && state.verticeSelecionadoEdicao?.idObjeto === idObjeto ? null : state.verticeSelecionadoEdicao;
    const arestaSelecionadaEdicao = objetoFicouOculto && state.arestaSelecionadaEdicao?.idObjeto === idObjeto ? null : state.arestaSelecionadaEdicao;
    const faceSelecionadaEdicao = objetoFicouOculto && state.faceSelecionadaEdicao?.idObjeto === idObjeto ? null : state.faceSelecionadaEdicao;
    const insetFaceEdicao = objetoFicouOculto && state.insetFaceEdicao?.idObjeto === idObjeto ? null : state.insetFaceEdicao;
    const bevelEdicao = objetoFicouOculto && state.bevelEdicao?.idObjeto === idObjeto ? null : state.bevelEdicao;

    return { ...state, idsObjetosOcultos, idsObjetosOcultosManualmente, idsObjetosSelecionados, idObjetoSelecionado, verticeSelecionadoEdicao, arestaSelecionadaEdicao, faceSelecionadaEdicao, insetFaceEdicao, bevelEdicao };
};

function alternaVisibilidadeColecaoEditor3D(state: Editor3DState, idColecao: string): Editor3DState {
    const colecao = state.colecoes.find(colecaoCena => colecaoCena.id === idColecao) ?? null;

    if (colecao === null) return state;

    const colecaoOculta = state.idsColecoesOcultas.includes(idColecao);
    const idsColecoesOcultas = colecaoOculta ? state.idsColecoesOcultas.filter(idColecaoOculta => idColecaoOculta !== idColecao) : [...state.idsColecoesOcultas, idColecao];
    const idsObjetosOcultos = recalculaIdsObjetosOcultosEditor3D(state, state.idsObjetosOcultosManualmente, idsColecoesOcultas);
    const idsObjetosColecao = obtemIdsObjetosColecaoStateEditor3D(state, colecao);
    const colecaoFicouOculta = idsColecoesOcultas.includes(idColecao);
    const idsObjetosSelecionados = colecaoFicouOculta ? state.idsObjetosSelecionados.filter(idObjetoSelecionado => !idsObjetosColecao.includes(idObjetoSelecionado)) : state.idsObjetosSelecionados;
    const idObjetoSelecionado = colecaoFicouOculta && state.idObjetoSelecionado !== null && idsObjetosColecao.includes(state.idObjetoSelecionado) ? idsObjetosSelecionados[idsObjetosSelecionados.length - 1] ?? null : state.idObjetoSelecionado;
    const verticeSelecionadoEdicao = colecaoFicouOculta && state.verticeSelecionadoEdicao !== null && idsObjetosColecao.includes(state.verticeSelecionadoEdicao.idObjeto) ? null : state.verticeSelecionadoEdicao;
    const arestaSelecionadaEdicao = colecaoFicouOculta && state.arestaSelecionadaEdicao !== null && idsObjetosColecao.includes(state.arestaSelecionadaEdicao.idObjeto) ? null : state.arestaSelecionadaEdicao;
    const faceSelecionadaEdicao = colecaoFicouOculta && state.faceSelecionadaEdicao !== null && idsObjetosColecao.includes(state.faceSelecionadaEdicao.idObjeto) ? null : state.faceSelecionadaEdicao;
    const insetFaceEdicao = colecaoFicouOculta && state.insetFaceEdicao !== null && idsObjetosColecao.includes(state.insetFaceEdicao.idObjeto) ? null : state.insetFaceEdicao;
    const bevelEdicao = colecaoFicouOculta && state.bevelEdicao !== null && idsObjetosColecao.includes(state.bevelEdicao.idObjeto) ? null : state.bevelEdicao;

    return { ...state, idsColecoesOcultas, idsObjetosOcultos, idsObjetosSelecionados, idObjetoSelecionado, verticeSelecionadoEdicao, arestaSelecionadaEdicao, faceSelecionadaEdicao, insetFaceEdicao, bevelEdicao };
};

function atualizaVetorObjetoSelecionadoEditor3D(state: Editor3DState, acao: Extract<Editor3DAcao, { readonly tipo: 'ATUALIZA_VETOR_OBJETO_SELECIONADO' }>): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    return { ...state, objetos: atualizaObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, objeto => atualizaVetorObjetoEditor3D(objeto, acao.campo, acao.indice, acao.valor)) };
};

function defineShaderObjetoSelecionadoEditor3D(state: Editor3DState, shader: ShaderEditor3D): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    return { ...state, objetos: atualizaObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, objeto => defineShaderObjetoEditor3D(objeto, shader)) };
};

function aplicaMaterialVisualObjetoSelecionadoEditor3D(state: Editor3DState, materialVisual: MaterialVisualEditor3D): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;

    return { ...state, objetos: atualizaObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, objeto => aplicaMaterialVisualObjetoEditor3D(objeto, materialVisual)) };
};

function defineModoVisualizacaoViewportEditor3D(state: Editor3DState, acao: Extract<Editor3DAcao, { readonly tipo: 'DEFINE_MODO_VISUALIZACAO_VIEWPORT' }>): Editor3DState {
    const visualizacaoXRayAtiva = modoVisualizacaoViewportPermiteXRayEditor3D(acao.modoVisualizacaoViewport) ? state.visualizacaoXRayAtiva : false;

    return { ...state, modoVisualizacaoViewport: acao.modoVisualizacaoViewport, visualizacaoXRayAtiva };
};

function alternaVisualizacaoXRayEditor3D(state: Editor3DState): Editor3DState {
    if (!modoVisualizacaoViewportPermiteXRayEditor3D(state.modoVisualizacaoViewport)) return state;

    return { ...state, visualizacaoXRayAtiva: !state.visualizacaoXRayAtiva };
};

function criaEstadoBaseComCenaCanonicaEditor3D(state: Editor3DState, aba: AbaProjeto3DEditor3D): Editor3DState {
    const cenaReconstruida = desserializaCenaCanonicaParaEditor3D(aba.cenaCanonica, state.proximoId);
    const estadoInicial = criaEstadoInicialEditor3D();

    return { ...estadoInicial, objetos: cenaReconstruida.objetos, idsObjetosOcultos: cenaReconstruida.idsObjetosOcultosManualmente, idsObjetosOcultosManualmente: cenaReconstruida.idsObjetosOcultosManualmente, proximoId: cenaReconstruida.proximoId, camera: aba.camera, modoVisualizacaoViewport: state.modoVisualizacaoViewport, visualizacaoXRayAtiva: state.visualizacaoXRayAtiva, tipoSelecionado: state.tipoSelecionado, quantidadeVertices: state.quantidadeVertices, proximoIdNotificacaoAreaInterativa: state.proximoIdNotificacaoAreaInterativa, projetoAberto: aba.projetoAberto, abasProjeto3D: state.abasProjeto3D, idAbaProjeto3DAtiva: aba.id, proximoIdAbaProjeto3D: state.proximoIdAbaProjeto3D, proximoNumeroNovoProjeto: state.proximoNumeroNovoProjeto };
};

function aplicaCenaCanonicaEditor3D(state: Editor3DState, cena: Extract<Editor3DAcao, { readonly tipo: 'CARREGA_CENA_CANONICA' }>['cena'], projetoAberto: ProjetoAbertoEditor3D | null): Editor3DState {
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null || state.bevelEdicao !== null) return state;

    const abaAtiva = obtemAbaProjeto3DAtivaEditor3D(state);

    if (abaAtiva === null) return state;

    const abaAtualizada: AbaProjeto3DEditor3D = { ...abaAtiva, nome: projetoAberto?.nome ?? abaAtiva.nome, projetoAberto, cenaCanonica: cena, assinaturaCenaSalva: projetoAberto === null ? null : criaAssinaturaCenaCanonicaEditor3D(cena), camera: state.camera };
    const estadoComAbaAtualizada = { ...state, abasProjeto3D: state.abasProjeto3D.map(aba => aba.id === abaAtualizada.id ? abaAtualizada : aba) };

    return criaEstadoBaseComCenaCanonicaEditor3D(estadoComAbaAtualizada, abaAtualizada);
};

function carregaCenaCanonicaEditor3D(state: Editor3DState, acao: Extract<Editor3DAcao, { readonly tipo: 'CARREGA_CENA_CANONICA' }>): Editor3DState {
    return aplicaCenaCanonicaEditor3D(state, acao.cena, null);
};

function carregaProjetoCanonicoEditor3D(state: Editor3DState, acao: Extract<Editor3DAcao, { readonly tipo: 'CARREGA_PROJETO_CANONICO' }>): Editor3DState {
    return aplicaCenaCanonicaEditor3D(state, acao.projeto.cenaCanonica, { id: acao.projeto.id, nome: acao.projeto.nome });
};

function criaNovaAbaProjeto3DEditor3D(state: Editor3DState): Editor3DState {
    const estadoComSnapshot = atualizaAbaAtivaComSnapshotProjeto3DEditor3D(state);
    const idAba = criaIdAbaProjeto3DEditor3D(estadoComSnapshot.proximoIdAbaProjeto3D);
    const nome = criaNomeNovoProjetoEditor3D(estadoComSnapshot.proximoNumeroNovoProjeto);
    const abaNova = criaAbaProjeto3DVaziaEditor3D(idAba, nome, criaCameraPadraoEditor3D());
    const estadoComNovaAba = { ...estadoComSnapshot, abasProjeto3D: [...estadoComSnapshot.abasProjeto3D, abaNova], idAbaProjeto3DAtiva: idAba, proximoIdAbaProjeto3D: estadoComSnapshot.proximoIdAbaProjeto3D + 1, proximoNumeroNovoProjeto: estadoComSnapshot.proximoNumeroNovoProjeto + 1 };

    return criaEstadoBaseComCenaCanonicaEditor3D(estadoComNovaAba, abaNova);
};

function trocaAbaProjeto3DEditor3D(state: Editor3DState, idAba: string): Editor3DState {
    if (state.idAbaProjeto3DAtiva === idAba) return state;

    const estadoComSnapshot = atualizaAbaAtivaComSnapshotProjeto3DEditor3D(state);
    const abaDestino = estadoComSnapshot.abasProjeto3D.find(aba => aba.id === idAba) ?? null;

    if (abaDestino === null) return state;

    return criaEstadoBaseComCenaCanonicaEditor3D(estadoComSnapshot, abaDestino);
};

function fechaAbaProjeto3DEditor3D(state: Editor3DState, idAba: string): Editor3DState {
    const indiceAba = state.abasProjeto3D.findIndex(aba => aba.id === idAba);

    if (indiceAba < 0) return state;

    if (state.abasProjeto3D.length === 1) {
        const idNovaAba = criaIdAbaProjeto3DEditor3D(state.proximoIdAbaProjeto3D);
        const nome = criaNomeNovoProjetoEditor3D(state.proximoNumeroNovoProjeto);
        const abaNova = criaAbaProjeto3DVaziaEditor3D(idNovaAba, nome, criaCameraPadraoEditor3D());
        const estadoComNovaAba = { ...state, abasProjeto3D: [abaNova], idAbaProjeto3DAtiva: idNovaAba, proximoIdAbaProjeto3D: state.proximoIdAbaProjeto3D + 1, proximoNumeroNovoProjeto: state.proximoNumeroNovoProjeto + 1 };

        return criaEstadoBaseComCenaCanonicaEditor3D(estadoComNovaAba, abaNova);
    }

    if (state.idAbaProjeto3DAtiva !== idAba) return { ...state, abasProjeto3D: state.abasProjeto3D.filter(aba => aba.id !== idAba) };

    const abasRestantes = state.abasProjeto3D.filter(aba => aba.id !== idAba);
    const indiceDestino = Math.max(0, indiceAba - 1);
    const abaDestino = abasRestantes[indiceDestino] ?? abasRestantes[0];
    const estadoSemAba = { ...state, abasProjeto3D: abasRestantes, idAbaProjeto3DAtiva: abaDestino.id };

    return criaEstadoBaseComCenaCanonicaEditor3D(estadoSemAba, abaDestino);
};

function carregaProjetoCanonicoEmAbaEditor3D(state: Editor3DState, projeto: Extract<Editor3DAcao, { readonly tipo: 'CARREGA_PROJETO_CANONICO_EM_ABA' }>['projeto']): Editor3DState {
    const estadoComSnapshot = atualizaAbaAtivaComSnapshotProjeto3DEditor3D(state);
    const abaExistente = estadoComSnapshot.abasProjeto3D.find(aba => aba.projetoAberto?.id === projeto.id) ?? null;

    if (abaExistente !== null) return criaEstadoBaseComCenaCanonicaEditor3D(estadoComSnapshot, abaExistente);

    const idAba = criaIdAbaProjeto3DEditor3D(estadoComSnapshot.proximoIdAbaProjeto3D);
    const abaNova = criaAbaProjeto3DDeProjetoPersistidoEditor3D(idAba, projeto, criaCameraPadraoEditor3D());
    const estadoComNovaAba = { ...estadoComSnapshot, abasProjeto3D: [...estadoComSnapshot.abasProjeto3D, abaNova], idAbaProjeto3DAtiva: idAba, proximoIdAbaProjeto3D: estadoComSnapshot.proximoIdAbaProjeto3D + 1 };

    return criaEstadoBaseComCenaCanonicaEditor3D(estadoComNovaAba, abaNova);
};

function marcaAbaProjeto3DSalvaEditor3D(state: Editor3DState, projetoAberto: ProjetoAbertoEditor3D): Editor3DState {
    const cenaCanonica = serializaEditor3DParaCenaCanonica(state);
    const assinaturaCenaSalva = criaAssinaturaCenaCanonicaEditor3D(cenaCanonica);
    const abaAtiva = obtemAbaProjeto3DAtivaEditor3D(state);

    if (abaAtiva === null) return { ...state, projetoAberto };

    const abaAtualizada: AbaProjeto3DEditor3D = { ...abaAtiva, nome: projetoAberto.nome, projetoAberto, cenaCanonica, assinaturaCenaSalva, camera: state.camera };

    return { ...state, projetoAberto, abasProjeto3D: state.abasProjeto3D.map(aba => aba.id === abaAtualizada.id ? abaAtualizada : aba) };
};

export function editor3DReducer(state: Editor3DState, acao: Editor3DAcao): Editor3DState {
    if (acao.tipo === 'ATUALIZA_CAMERA') return { ...state, camera: acao.camera };
    if (acao.tipo === 'RESETA_CAMERA') return { ...state, camera: criaCameraPadraoEditor3D() };
    if (acao.tipo === 'EXIBE_NOTIFICACAO_AREA_INTERATIVA') return { ...state, notificacaoAreaInterativa: { id: state.proximoIdNotificacaoAreaInterativa, texto: acao.texto }, proximoIdNotificacaoAreaInterativa: state.proximoIdNotificacaoAreaInterativa + 1 };
    if (acao.tipo === 'LIMPA_NOTIFICACAO_AREA_INTERATIVA') return state.notificacaoAreaInterativa?.id === acao.id ? { ...state, notificacaoAreaInterativa: null } : state;
    if (acao.tipo === 'DEFINE_MODO_VISUALIZACAO_VIEWPORT') return defineModoVisualizacaoViewportEditor3D(state, acao);
    if (acao.tipo === 'ALTERNA_VISUALIZACAO_XRAY') return alternaVisualizacaoXRayEditor3D(state);
    if (acao.tipo === 'INICIA_OCULTACAO_GUIAS_CENA_TEMPORARIA') return { ...state, ocultacoesGuiasCenaTemporaria: state.ocultacoesGuiasCenaTemporaria + 1 };
    if (acao.tipo === 'FINALIZA_OCULTACAO_GUIAS_CENA_TEMPORARIA') return { ...state, ocultacoesGuiasCenaTemporaria: Math.max(0, state.ocultacoesGuiasCenaTemporaria - 1) };
    if (acao.tipo === 'ENTRA_MODO_EDICAO') return entraModoEdicaoEditor3D(state);
    if (acao.tipo === 'SAI_MODO_EDICAO') return saiModoEdicaoEditor3D(state);
    if (acao.tipo === 'ALTERNA_MODO_OPERACAO') return alternaModoOperacaoEditor3D(state);
    if (acao.tipo === 'DEFINE_TIPO_SELECAO_EDICAO') return defineTipoSelecaoEdicaoEditor3D(state, acao.tipoSelecao);
    if (acao.tipo === 'SELECIONA_VERTICE_EDICAO') return selecionaVerticeEdicaoEditor3D(state, acao.idObjeto, acao.indiceVertice);
    if (acao.tipo === 'SELECIONA_ARESTA_EDICAO') return selecionaArestaEdicaoEditor3D(state, acao.idObjeto, acao.indiceOrigem, acao.indiceDestino);
    if (acao.tipo === 'SELECIONA_FACE_EDICAO') return selecionaFaceEdicaoEditor3D(state, acao.idObjeto, acao.idFace);
    if (acao.tipo === 'INICIA_INSET_FACE_SELECIONADA') return iniciaInsetFaceSelecionadaEditor3D(state);
    if (acao.tipo === 'ATUALIZA_INSET_FACE_EM_EDICAO') return atualizaInsetFaceEmEdicaoEditor3D(state, acao.deltaEscala);
    if (acao.tipo === 'CONFIRMA_INSET_FACE_EM_EDICAO') return confirmaInsetFaceEmEdicaoEditor3D(state);
    if (acao.tipo === 'CANCELA_INSET_FACE_EM_EDICAO') return cancelaInsetFaceEmEdicaoEditor3D(state);
    if (acao.tipo === 'INICIA_BEVEL_SELECAO') return iniciaBevelSelecaoEditor3D(state);
    if (acao.tipo === 'ATUALIZA_BEVEL_EM_EDICAO') return atualizaBevelEmEdicaoEditor3D(state, acao.deltaLargura);
    if (acao.tipo === 'ALTERA_SEGMENTOS_BEVEL_EM_EDICAO') return alteraSegmentosBevelEmEdicaoEditor3D(state, acao.deltaSegmentos);
    if (acao.tipo === 'CONFIRMA_BEVEL_EM_EDICAO') return confirmaBevelEmEdicaoEditor3D(state);
    if (acao.tipo === 'CANCELA_BEVEL_EM_EDICAO') return cancelaBevelEmEdicaoEditor3D(state);
    if (acao.tipo === 'MOVE_SELECAO_EDICAO') return moveSelecaoEdicaoEditor3D(state, acao.delta);
    if (acao.tipo === 'APLICA_INSET_FACE_SELECIONADA') return aplicaInsetFaceSelecionadaEditor3D(state);
    if (acao.tipo === 'ATIVA_FERRAMENTA_MOUSE') return state.modoAtual.tipo === 'NENHUM' ? { ...state, ferramentaMouse: acao.ferramenta } : state;
    if (acao.tipo === 'RESETA_FERRAMENTA_MOUSE') return { ...state, ferramentaMouse: 'SELECIONAR' };
    if (acao.tipo === 'INICIA_AREA_SELECAO') return state.modoOperacao === 'OBJETO' && state.modoAtual.tipo === 'NENHUM' && state.malhaEmCriacao === null ? { ...state, areaSelecao: { inicioX: acao.x, inicioY: acao.y, fimX: acao.x, fimY: acao.y, adicionando: acao.adicionando } } : state;
    if (acao.tipo === 'ATUALIZA_AREA_SELECAO') return state.areaSelecao === null ? state : { ...state, areaSelecao: { ...state.areaSelecao, fimX: acao.x, fimY: acao.y } };
    if (acao.tipo === 'FINALIZA_AREA_SELECAO') return { ...state, areaSelecao: null };
    if (acao.tipo === 'ATUALIZA_CURSOR_VIRTUAL') return { ...state, cursorVirtual: { ativo: acao.ativo, x: acao.x, y: acao.y } };
    if (acao.tipo === 'DESATIVA_CURSOR_VIRTUAL') return { ...state, cursorVirtual: { ...state.cursorVirtual, ativo: false } };
    if (acao.tipo === 'SELECIONA_OBJETO') return selecionaObjetosEditor3D(state, acao.idObjeto === null ? [] : [acao.idObjeto], acao.adiciona);
    if (acao.tipo === 'SELECIONA_OBJETOS') return selecionaObjetosEditor3D(state, acao.idsObjetos, acao.adiciona);
    if (acao.tipo === 'SELECIONA_COLECAO_CENA') return selecionaColecaoCenaEditor3D(state, acao.idColecao);
    if (acao.tipo === 'CRIA_COLECAO_CENA') return criaColecaoCenaStateEditor3D(state);
    if (acao.tipo === 'RENOMEIA_OBJETO_CENA') return renomeiaObjetoCenaEditor3D(state, acao.idObjeto, acao.nome);
    if (acao.tipo === 'RENOMEIA_COLECAO_CENA') return renomeiaColecaoCenaEditor3D(state, acao.idColecao, acao.nome);
    if (acao.tipo === 'MOVE_OBJETO_PARA_COLECAO_CENA') return moveObjetoParaColecaoCenaEditor3D(state, acao.idObjeto, acao.idColecao, acao.idObjetoReferencia, acao.posicao);
    if (acao.tipo === 'MOVE_COLECAO_CENA') return moveColecaoCenaEditor3D(state, acao.idColecao, acao.idColecaoReferencia, acao.posicao);
    if (acao.tipo === 'DELETA_OBJETOS_SELECIONADOS') return deletaObjetosSelecionadosEditor3D(state);
    if (acao.tipo === 'ALTERNA_VISIBILIDADE_OBJETO') return alternaVisibilidadeObjetoEditor3D(state, acao.idObjeto);
    if (acao.tipo === 'ALTERNA_VISIBILIDADE_COLECAO') return alternaVisibilidadeColecaoEditor3D(state, acao.idColecao);
    if (acao.tipo === 'SELECIONA_TIPO_MALHA') {
        const definicao = obtemDefinicaoMalhaEditor3D(acao.tipoMalha);

        return { ...state, tipoSelecionado: acao.tipoMalha, quantidadeVertices: definicao.quantidadePadrao };
    }
    if (acao.tipo === 'ALTERA_QUANTIDADE_VERTICES') return alteraQuantidadeVerticesStateEditor3D(state, acao.delta);
    if (acao.tipo === 'DEFINE_QUANTIDADE_VERTICES') return atualizaQuantidadeVerticesStateEditor3D(state, acao.quantidadeVertices);
    if (acao.tipo === 'INICIA_MALHA_EM_CRIACAO') return state.modoOperacao === 'OBJETO' ? iniciaMalhaEmCriacaoEditor3D(state, acao.tipoMalha) : state;
    if (acao.tipo === 'CRIA_PRESET_OBJETO_CENA') return criaPresetObjetoCenaEditor3D(state, acao.preset);
    if (acao.tipo === 'ATUALIZA_VETOR_MALHA_EM_CRIACAO') return atualizaVetorMalhaEmCriacaoEditor3D(state, acao.campo, acao.indice, acao.valor);
    if (acao.tipo === 'ATUALIZA_VETOR_OBJETO_SELECIONADO') return atualizaVetorObjetoSelecionadoEditor3D(state, acao);
    if (acao.tipo === 'DEFINE_SHADER_OBJETO_SELECIONADO') return defineShaderObjetoSelecionadoEditor3D(state, acao.shader);
    if (acao.tipo === 'APLICA_MATERIAL_VISUAL_OBJETO_SELECIONADO') return aplicaMaterialVisualObjetoSelecionadoEditor3D(state, acao.materialVisual);
    if (acao.tipo === 'APLICA_ROTATION_SCALE_OBJETOS_SELECIONADOS') return state.modoOperacao !== 'OBJETO' || state.idsObjetosSelecionados.length === 0 || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null ? state : { ...state, objetos: aplicaRotationScaleObjetosEditor3D(state.objetos, state.idsObjetosSelecionados) };
    if (acao.tipo === 'CONFIRMA_MALHA_EM_CRIACAO') return confirmaMalhaEmCriacaoEditor3D(state);
    if (acao.tipo === 'CANCELA_MALHA_EM_CRIACAO') return { ...state, malhaEmCriacao: null };
    if (acao.tipo === 'LIMPA_CENA') return criaEstadoInicialEditor3D();
    if (acao.tipo === 'DEFINE_PROJETO_ABERTO') return acao.projetoAberto === null ? { ...state, projetoAberto: null } : marcaAbaProjeto3DSalvaEditor3D(state, acao.projetoAberto);
    if (acao.tipo === 'CARREGA_CENA_CANONICA') return carregaCenaCanonicaEditor3D(state, acao);
    if (acao.tipo === 'CARREGA_PROJETO_CANONICO') return carregaProjetoCanonicoEditor3D(state, acao);
    if (acao.tipo === 'CRIA_NOVA_ABA_PROJETO_3D') return criaNovaAbaProjeto3DEditor3D(state);
    if (acao.tipo === 'TROCA_ABA_PROJETO_3D') return trocaAbaProjeto3DEditor3D(state, acao.idAba);
    if (acao.tipo === 'FECHA_ABA_PROJETO_3D') return fechaAbaProjeto3DEditor3D(state, acao.idAba);
    if (acao.tipo === 'CARREGA_PROJETO_CANONICO_EM_ABA') return carregaProjetoCanonicoEmAbaEditor3D(state, acao.projeto);
    if (acao.tipo === 'MARCA_ABA_PROJETO_3D_SALVA') return marcaAbaProjeto3DSalvaEditor3D(state, acao.projetoAberto);
    if (acao.tipo === 'MOVE_OBJETO_SELECIONADO' && state.modoOperacao === 'OBJETO' && state.idsObjetosSelecionados.length > 0 && state.modoAtual.tipo === 'NENHUM') return { ...state, objetos: moveObjetosEditor3D(state.objetos, state.idsObjetosSelecionados, acao.delta) };
    if (acao.tipo === 'INICIA_GRAB') return iniciaGrabEditor3D(state);
    if (acao.tipo === 'APLICA_EIXO_GRAB' && state.modoAtual.tipo === 'GRAB') return aplicaEixoGrabEditor3D(state, acao.eixo);
    if (acao.tipo === 'MOVE_OBJETO_GRAB') return moveModoGrabEditor3D(state, acao.delta);
    if (acao.tipo === 'INICIA_ROTATE') return state.modoOperacao === 'OBJETO' ? iniciaRotateEditor3D(state) : state;
    if (acao.tipo === 'APLICA_EIXO_ROTATE') return aplicaEixoRotateEditor3D(state, acao.eixo);
    if (acao.tipo === 'APLICA_ROTATE_LIVRE') return aplicaRotateLivreEditor3D(state);
    if (acao.tipo === 'ATUALIZA_ENTRADA_NUMERICA_ROTATE') return atualizaEntradaNumericaRotateEditor3D(state, acao.entrada);
    if (acao.tipo === 'ROTACIONA_OBJETO_ROTATE') return rotacionaModoRotateEditor3D(state, acao.delta);
    if (acao.tipo === 'INICIA_SCALE') return state.modoOperacao === 'OBJETO' ? iniciaScaleEditor3D(state) : state;
    if (acao.tipo === 'APLICA_EIXO_SCALE') return aplicaEixoScaleEditor3D(state, acao.eixo);
    if (acao.tipo === 'ESCALA_OBJETO_SCALE') return escalaModoScaleEditor3D(state, acao.delta);
    if (acao.tipo === 'CONFIRMA_MODO') return { ...state, modoAtual: criaModoInativoEditor3D(), cursorVirtual: { ...state.cursorVirtual, ativo: false } };
    if (acao.tipo === 'CANCELA_MODO') return { ...cancelaModoEditor3D(state), cursorVirtual: { ...state.cursorVirtual, ativo: false } };

    return state;
};