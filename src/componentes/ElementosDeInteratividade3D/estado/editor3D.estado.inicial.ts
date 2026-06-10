import { criaCameraPadraoEditor3D } from '../editor/editor3D.camera';
import { criaModoInativoEditor3D } from '../modos/editor3D.modo.utils';
import { criaAbaProjeto3DVaziaEditor3D, criaIdAbaProjeto3DEditor3D, criaNomeNovoProjetoEditor3D } from './editor3D.abasProjeto';
import type { Editor3DState } from './editor3D.estado.types';

export function criaEstadoInicialEditor3D(): Editor3DState {
    const camera = criaCameraPadraoEditor3D();
    const idAbaProjeto3DAtiva = criaIdAbaProjeto3DEditor3D(1);

    return { objetos: [], malhaEmCriacao: null, idObjetoSelecionado: null, idsObjetosSelecionados: [], idsObjetosOcultos: [], idsObjetosOcultosManualmente: [], colecoes: [], idsColecoesOcultas: [], idColecaoSelecionada: null, proximoIdColecao: 1, notificacaoAreaInterativa: null, proximoIdNotificacaoAreaInterativa: 1, modoVisualizacaoViewport: 'SOLIDO', visualizacaoXRayAtiva: false, ocultacoesGuiasCenaTemporaria: 0, modoOperacao: 'OBJETO', escopoEdicao: null, tipoSelecaoEdicao: 'VERTICE', verticeSelecionadoEdicao: null, arestaSelecionadaEdicao: null, faceSelecionadaEdicao: null, insetFaceEdicao: null, bevelEdicao: null, modoAtual: criaModoInativoEditor3D(), camera, ferramentaMouse: 'SELECIONAR', areaSelecao: null, cursorVirtual: { ativo: false, x: 0, y: 0 }, tipoSelecionado: 'VERTICE', quantidadeVertices: 1, proximoId: 1, projetoAberto: null, abasProjeto3D: [criaAbaProjeto3DVaziaEditor3D(idAbaProjeto3DAtiva, criaNomeNovoProjetoEditor3D(1), camera)], idAbaProjeto3DAtiva, proximoIdAbaProjeto3D: 2, proximoNumeroNovoProjeto: 2 };
};