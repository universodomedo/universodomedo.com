import { criaMatrizIdentidadeEditor3D } from './editor3D.matrizes';
import { obtemDefinicaoMaterialVisualEditor3D } from './editor3D.materialVisual.tipos';
import { obtemDefinicaoPresetObjetoCenaEditor3D, type PresetObjetoCenaEditor3D } from './editor3D.presetsObjeto.tipos';
import { tiposMalhaEditor3D, type ObjetoCenaEditor3D, type TipoMalhaEditor3D, type TipoMalhaEditor3DDef, type Vetor3 } from './editor3D.tipos';

export function somaVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
export function subtraiVetoresEditor3D(a: Vetor3, b: Vetor3): Vetor3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
export function aplicaDeltaEscalaEditor3D(escala: Vetor3, delta: Vetor3): Vetor3 { return [Math.max(0.05, escala[0] + delta[0]), Math.max(0.05, escala[1] + delta[1]), Math.max(0.05, escala[2] + delta[2])]; };
export function obtemDefinicaoMalhaEditor3D(tipo: TipoMalhaEditor3D): TipoMalhaEditor3DDef { return tiposMalhaEditor3D.find(definicao => definicao.key === tipo) ?? tiposMalhaEditor3D[0]; };
export function limitaQuantidadeVerticesEditor3D(quantidade: number, definicao: TipoMalhaEditor3DDef): number { return Math.min(definicao.quantidadeMaxima, Math.max(definicao.quantidadeMinima, Math.floor(quantidade))); };

export function criaObjetoCenaEditor3D(id: number, tipo: TipoMalhaEditor3D, quantidadeVertices: number): ObjetoCenaEditor3D {
    const definicao = obtemDefinicaoMalhaEditor3D(tipo);
    const quantidadeVerticesFinal = definicao.quantidadeAjustavel ? limitaQuantidadeVerticesEditor3D(quantidadeVertices, definicao) : definicao.quantidadePadrao;

    return { id: `malha-${id}`, nome: `${definicao.nome} ${id}`, tipo, quantidadeVertices: quantidadeVerticesFinal, posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1], matrizBase: criaMatrizIdentidadeEditor3D(), malhaEditavel: null, versaoGeometria: 0, corBase: definicao.corBase, corLuz: definicao.corLuz, materialVisual: null, shader: 'PADRAO' };
};

export function criaObjetoPresetCenaEditor3D(id: number, preset: PresetObjetoCenaEditor3D): ObjetoCenaEditor3D {
    const definicao = obtemDefinicaoPresetObjetoCenaEditor3D(preset);
    const materialVisual = obtemDefinicaoMaterialVisualEditor3D(definicao.materialVisual);
    const objeto = criaObjetoCenaEditor3D(id, definicao.tipoMalha, definicao.quantidadeVertices);

    return { ...objeto, nome: `${definicao.nome} ${id}`, escala: definicao.escala, corBase: materialVisual.corBase, corLuz: materialVisual.corLuz, materialVisual: definicao.materialVisual, shader: definicao.shader };
};
