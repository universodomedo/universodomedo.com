import { criaCameraPadraoEditor3D } from '../editor/editor3D.camera';
import { criaModoInativoEditor3D } from '../modos/editor3D.modo.utils';
import type { Editor3DState } from './editor3D.estado.types';

export function criaEstadoInicialEditor3D(): Editor3DState { return { objetos: [], malhaEmCriacao: null, idObjetoSelecionado: null, idsObjetosSelecionados: [], modoAtual: criaModoInativoEditor3D(), camera: criaCameraPadraoEditor3D(), ferramentaMouse: 'SELECIONAR', areaSelecao: null, cursorVirtual: { ativo: false, x: 0, y: 0 }, tipoSelecionado: 'VERTICE', quantidadeVertices: 1, proximoId: 1 }; };