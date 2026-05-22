import { criaMatrizEscala, criaMatrizRotacaoX, criaMatrizRotacaoY, criaMatrizRotacaoZ, criaMatrizTranslacao, multiplicaMatriz4 } from './editor3D.matrizes';
import type { ObjetoCenaEditor3D, Vetor3 } from './editor3D.tipos';

export function criaMatrizRotacaoObjetoEditor3D(rotacao: Vetor3): Float32Array { return multiplicaMatriz4(criaMatrizRotacaoZ(rotacao[2]), multiplicaMatriz4(criaMatrizRotacaoY(rotacao[1]), criaMatrizRotacaoX(rotacao[0]))); };

export function criaMatrizTransformObjetoEditor3D(objeto: ObjetoCenaEditor3D): Float32Array {
    const matrizTranslacao = criaMatrizTranslacao(objeto.posicao[0], objeto.posicao[1], objeto.posicao[2]);
    const matrizRotacao = criaMatrizRotacaoObjetoEditor3D(objeto.rotacao);
    const matrizEscala = criaMatrizEscala(objeto.escala[0], objeto.escala[1], objeto.escala[2]);

    return multiplicaMatriz4(matrizTranslacao, multiplicaMatriz4(matrizRotacao, multiplicaMatriz4(matrizEscala, objeto.matrizBase)));
};