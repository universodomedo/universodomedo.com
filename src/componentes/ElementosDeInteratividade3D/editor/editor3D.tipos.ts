export type Vetor3 = readonly [number, number, number];
export type EixoEditor3D = 'X' | 'Y' | 'Z';
export type IndiceVetor3Editor3D = 0 | 1 | 2;
export type CampoVetorMalhaEditor3D = 'posicao' | 'rotacao' | 'escala';

export const tiposMalhaEditor3D = [
    { key: 'VERTICE', nome: 'Vértice', dimensao: 'VERTICE', quantidadePadrao: 1, quantidadeMinima: 1, quantidadeMaxima: 1, quantidadeAjustavel: false, corBase: [0.95, 0.78, 0.36], corLuz: [1, 0.94, 0.66] },
    { key: 'PLANO_2D', nome: 'Plano', dimensao: '2D', quantidadePadrao: 4, quantidadeMinima: 4, quantidadeMaxima: 4, quantidadeAjustavel: false, corBase: [0.52, 0.5, 0.58], corLuz: [0.88, 0.84, 1] },
    { key: 'CIRCULO_2D', nome: 'Círculo', dimensao: '2D', quantidadePadrao: 32, quantidadeMinima: 3, quantidadeMaxima: 96, quantidadeAjustavel: true, corBase: [0.56, 0.32, 0.18], corLuz: [1, 0.75, 0.45] },
    { key: 'CUBO_3D', nome: 'Cubo', dimensao: '3D', quantidadePadrao: 8, quantidadeMinima: 8, quantidadeMaxima: 8, quantidadeAjustavel: false, corBase: [0.42, 0.22, 0.12], corLuz: [1, 0.72, 0.38] },
    { key: 'CILINDRO_3D', nome: 'Cilindro', dimensao: '3D', quantidadePadrao: 32, quantidadeMinima: 3, quantidadeMaxima: 96, quantidadeAjustavel: true, corBase: [0.72, 0.42, 0.16], corLuz: [1, 0.86, 0.48] },
    { key: 'ESFERA_3D', nome: 'Esfera', dimensao: '3D', quantidadePadrao: 24, quantidadeMinima: 6, quantidadeMaxima: 64, quantidadeAjustavel: true, corBase: [0.46, 0.08, 0.13], corLuz: [1, 0.34, 0.36] },
] as const;

export type TipoMalhaEditor3D = typeof tiposMalhaEditor3D[number]['key'];
export type TipoDimensaoMalhaEditor3D = 'VERTICE' | '2D' | '3D';
export type TipoMalhaEditor3DDef = typeof tiposMalhaEditor3D[number];

export interface ObjetoCenaEditor3D {
    readonly id: string;
    readonly nome: string;
    readonly tipo: TipoMalhaEditor3D;
    readonly quantidadeVertices: number;
    readonly posicao: Vetor3;
    readonly rotacao: Vetor3;
    readonly escala: Vetor3;
    readonly matrizBase: Float32Array;
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
};