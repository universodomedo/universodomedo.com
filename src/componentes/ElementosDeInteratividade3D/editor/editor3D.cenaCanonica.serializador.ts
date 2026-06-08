import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { CenaCanonicaEditor3D, FaceMalhaEditavelCenaCanonicaEditor3D, MalhaEditavelCenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, Vetor3CenaCanonicaEditor3D } from './editor3D.cenaCanonica.tipos';
import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, ObjetoCenaEditor3D, Vetor3 } from './editor3D.tipos';

function clonaVetor3CenaCanonicaEditor3D(vetor: Vetor3): Vetor3CenaCanonicaEditor3D { return [vetor[0], vetor[1], vetor[2]]; };
function serializaMatrizBaseCenaCanonicaEditor3D(matriz: Float32Array): readonly number[] { return Array.from(matriz); };

function serializaFaceMalhaEditavelCenaCanonicaEditor3D(face: FaceMalhaEditavelEditor3D): FaceMalhaEditavelCenaCanonicaEditor3D {
    return { id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices] };
};

function serializaMalhaEditavelCenaCanonicaEditor3D(malha: MalhaEditavelEditor3D): MalhaEditavelCenaCanonicaEditor3D {
    return {
        vertices: malha.vertices.map(clonaVetor3CenaCanonicaEditor3D),
        faces: malha.faces.map(serializaFaceMalhaEditavelCenaCanonicaEditor3D),
        proximoIdFace: malha.proximoIdFace,
    };
};

function criaObjetoCenaCanonicaEditor3D(state: Editor3DState, objeto: ObjetoCenaEditor3D): ObjetoCenaCanonicaEditor3D {
    const objetoCanonico: ObjetoCenaCanonicaEditor3D = {
        idLocal: objeto.id,
        nome: objeto.nome,
        tipo: objeto.tipo,
        quantidadeVertices: objeto.quantidadeVertices,
        posicao: clonaVetor3CenaCanonicaEditor3D(objeto.posicao),
        rotacao: clonaVetor3CenaCanonicaEditor3D(objeto.rotacao),
        escala: clonaVetor3CenaCanonicaEditor3D(objeto.escala),
        matrizBase: serializaMatrizBaseCenaCanonicaEditor3D(objeto.matrizBase),
        corBase: clonaVetor3CenaCanonicaEditor3D(objeto.corBase),
        corLuz: clonaVetor3CenaCanonicaEditor3D(objeto.corLuz),
        materialVisual: objeto.materialVisual,
        shader: objeto.shader,
        visivel: !state.idsObjetosOcultos.includes(objeto.id),
    };

    if (objeto.malhaEditavel === null) return objetoCanonico;

    return { ...objetoCanonico, malhaEditavel: serializaMalhaEditavelCenaCanonicaEditor3D(objeto.malhaEditavel) };
};

export function obtemBloqueioGeracaoCenaCanonicaEditor3D(state: Editor3DState): string | null {
    if (state.malhaEmCriacao !== null) return 'Finalize ou cancele a malha em criacao antes de gerar os dados da cena.';
    if (state.modoAtual.tipo !== 'NENHUM') return 'Confirme ou cancele a transformacao em andamento antes de gerar os dados da cena.';
    if (state.insetFaceEdicao !== null) return 'Confirme ou cancele o inset em edicao antes de gerar os dados da cena.';
    if (state.bevelEdicao !== null) return 'Confirme ou cancele o bevel em edicao antes de gerar os dados da cena.';

    return null;
};

export function serializaEditor3DParaCenaCanonica(state: Editor3DState): CenaCanonicaEditor3D {
    return { versao: 1, objetos: state.objetos.map(objeto => criaObjetoCenaCanonicaEditor3D(state, objeto)) };
};