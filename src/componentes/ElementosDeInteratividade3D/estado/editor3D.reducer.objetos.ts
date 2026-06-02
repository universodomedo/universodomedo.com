import { aplicaDeltaEscalaEditor3D, criaObjetoCenaEditor3D, limitaQuantidadeVerticesEditor3D, obtemDefinicaoMalhaEditor3D, somaVetoresEditor3D } from '../editor/editor3D.objetos';
import { criaMatrizEscala, multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import { criaMatrizRotacaoObjetoEditor3D } from '../editor/editor3D.transform';
import { obtemDefinicaoMaterialVisualEditor3D, type MaterialVisualEditor3D } from '../editor/editor3D.materialVisual.tipos';
import type { ShaderEditor3D } from '../editor/editor3D.shader.tipos';
import type { CampoVetorMalhaEditor3D, IndiceVetor3Editor3D, ObjetoCenaEditor3D, TipoMalhaEditor3D, Vetor3 } from '../editor/editor3D.tipos';

export function atualizaObjetoEditor3D(objetos: ObjetoCenaEditor3D[], idObjeto: string, atualiza: (objeto: ObjetoCenaEditor3D) => ObjetoCenaEditor3D): ObjetoCenaEditor3D[] { return objetos.map(objeto => objeto.id === idObjeto ? atualiza(objeto) : objeto); };
export function atualizaObjetosEditor3D(objetos: ObjetoCenaEditor3D[], idsObjetos: readonly string[], atualiza: (objeto: ObjetoCenaEditor3D) => ObjetoCenaEditor3D): ObjetoCenaEditor3D[] { return objetos.map(objeto => idsObjetos.includes(objeto.id) ? atualiza(objeto) : objeto); };
export function moveObjetoEditor3D(objetos: ObjetoCenaEditor3D[], idObjeto: string, delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetoEditor3D(objetos, idObjeto, objeto => ({ ...objeto, posicao: somaVetoresEditor3D(objeto.posicao, delta) })); };
export function moveObjetosEditor3D(objetos: ObjetoCenaEditor3D[], idsObjetos: readonly string[], delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetosEditor3D(objetos, idsObjetos, objeto => ({ ...objeto, posicao: somaVetoresEditor3D(objeto.posicao, delta) })); };
export function rotacionaObjetoEditor3D(objetos: ObjetoCenaEditor3D[], idObjeto: string, delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetoEditor3D(objetos, idObjeto, objeto => ({ ...objeto, rotacao: somaVetoresEditor3D(objeto.rotacao, delta) })); };
export function rotacionaObjetosEditor3D(objetos: ObjetoCenaEditor3D[], idsObjetos: readonly string[], delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetosEditor3D(objetos, idsObjetos, objeto => ({ ...objeto, rotacao: somaVetoresEditor3D(objeto.rotacao, delta) })); };
export function escalaObjetoEditor3D(objetos: ObjetoCenaEditor3D[], idObjeto: string, delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetoEditor3D(objetos, idObjeto, objeto => ({ ...objeto, escala: aplicaDeltaEscalaEditor3D(objeto.escala, delta) })); };
export function escalaObjetosEditor3D(objetos: ObjetoCenaEditor3D[], idsObjetos: readonly string[], delta: Vetor3): ObjetoCenaEditor3D[] { return atualizaObjetosEditor3D(objetos, idsObjetos, objeto => ({ ...objeto, escala: aplicaDeltaEscalaEditor3D(objeto.escala, delta) })); };
export function atualizaQuantidadeVerticesObjetoEditor3D(objeto: ObjetoCenaEditor3D, quantidadeVertices: number): ObjetoCenaEditor3D { return { ...objeto, quantidadeVertices }; };
export function defineShaderObjetoEditor3D(objeto: ObjetoCenaEditor3D, shader: ShaderEditor3D): ObjetoCenaEditor3D { return { ...objeto, shader }; };
export function aplicaMaterialVisualObjetoEditor3D(objeto: ObjetoCenaEditor3D, materialVisual: MaterialVisualEditor3D): ObjetoCenaEditor3D {
    const definicao = obtemDefinicaoMaterialVisualEditor3D(materialVisual);

    return { ...objeto, materialVisual, corBase: definicao.corBase, corLuz: definicao.corLuz };
};

export function aplicaRotationScaleObjetoEditor3D(objeto: ObjetoCenaEditor3D): ObjetoCenaEditor3D {
    const matrizRotacao = criaMatrizRotacaoObjetoEditor3D(objeto.rotacao);
    const matrizEscala = criaMatrizEscala(objeto.escala[0], objeto.escala[1], objeto.escala[2]);
    const matrizBase = multiplicaMatriz4(matrizRotacao, multiplicaMatriz4(matrizEscala, objeto.matrizBase));

    return { ...objeto, rotacao: [0, 0, 0], escala: [1, 1, 1], matrizBase };
};

export function aplicaRotationScaleObjetosEditor3D(objetos: ObjetoCenaEditor3D[], idsObjetos: readonly string[]): ObjetoCenaEditor3D[] { return atualizaObjetosEditor3D(objetos, idsObjetos, aplicaRotationScaleObjetoEditor3D); };

export function atualizaVetor3Editor3D(vetor: Vetor3, indice: IndiceVetor3Editor3D, valor: number): Vetor3 {
    if (indice === 0) return [valor, vetor[1], vetor[2]];
    if (indice === 1) return [vetor[0], valor, vetor[2]];

    return [vetor[0], vetor[1], valor];
};

export function atualizaVetorObjetoEditor3D(objeto: ObjetoCenaEditor3D, campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number): ObjetoCenaEditor3D {
    if (campo === 'posicao') return { ...objeto, posicao: atualizaVetor3Editor3D(objeto.posicao, indice, valor) };
    if (campo === 'rotacao') return { ...objeto, rotacao: atualizaVetor3Editor3D(objeto.rotacao, indice, valor) };

    return { ...objeto, escala: atualizaVetor3Editor3D(objeto.escala, indice, valor) };
};

export function defineQuantidadeVerticesEditor3D(quantidade: number, tipoSelecionado: TipoMalhaEditor3D): number {
    const definicao = obtemDefinicaoMalhaEditor3D(tipoSelecionado);

    if (!definicao.quantidadeAjustavel) return definicao.quantidadePadrao;

    return limitaQuantidadeVerticesEditor3D(quantidade, definicao);
};

export function alteraQuantidadeVerticesEditor3D(quantidadeAtual: number, tipoSelecionado: TipoMalhaEditor3D, delta: number): number { return defineQuantidadeVerticesEditor3D(quantidadeAtual + delta, tipoSelecionado); };
export function criaProximoObjetoEditor3D(proximoId: number, tipoSelecionado: TipoMalhaEditor3D, quantidadeVertices: number): ObjetoCenaEditor3D { return criaObjetoCenaEditor3D(proximoId, tipoSelecionado, quantidadeVertices); };
