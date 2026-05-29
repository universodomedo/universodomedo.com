import { aplicaInsetFaceMalhaEditavelEditor3D } from '../geometria/editor3D.geometria.insetFaces';
import { criaGeometriaObjetoEditor3D } from '../geometria/primitivas/editor3D.geometria.primitivas';
import { criaMalhaEditavelPorGeometriaEditor3D } from '../geometria/editor3D.geometria.malhaEditavel';
import type { Editor3DState } from './editor3D.estado.types';
import type { MalhaEditavelEditor3D, ObjetoCenaEditor3D } from '../editor/editor3D.tipos';

function obtemMalhaEditavelObjetoEditor3D(objeto: ObjetoCenaEditor3D): MalhaEditavelEditor3D | null {
    if (objeto.malhaEditavel !== null) return objeto.malhaEditavel;

    return criaMalhaEditavelPorGeometriaEditor3D(criaGeometriaObjetoEditor3D(objeto));
};

export function aplicaInsetFaceSelecionadaEditor3D(state: Editor3DState): Editor3DState {
    const faceSelecionada = state.faceSelecionadaEdicao;
    const escopoEdicao = state.escopoEdicao;

    if (state.modoOperacao !== 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return state;
    if (faceSelecionada === null || escopoEdicao === null) return state;
    if (faceSelecionada.idObjeto !== escopoEdicao.idObjetoAtivo) return state;

    const objeto = state.objetos.find(objetoAtual => objetoAtual.id === faceSelecionada.idObjeto) ?? null;

    if (objeto === null) return state;

    const malhaEditavel = obtemMalhaEditavelObjetoEditor3D(objeto);

    if (malhaEditavel === null) return state;

    const resultado = aplicaInsetFaceMalhaEditavelEditor3D(malhaEditavel, faceSelecionada.idFace);

    if (resultado === null) return state;

    return { ...state, objetos: state.objetos.map(objetoAtual => objetoAtual.id === objeto.id ? { ...objetoAtual, malhaEditavel: resultado.malha, versaoGeometria: objetoAtual.versaoGeometria + 1 } : objetoAtual), faceSelecionadaEdicao: { idObjeto: objeto.id, idFace: resultado.idFaceInterna } };
};
