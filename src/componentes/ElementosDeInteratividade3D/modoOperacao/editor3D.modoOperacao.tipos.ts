export type ModoOperacaoEditor3D = 'OBJETO' | 'EDICAO';
export type TipoSelecaoEdicaoEditor3D = 'VERTICE' | 'ARESTA' | 'FACE';

export interface EscopoEdicaoEditor3D {
    readonly idObjetoAtivo: string;
    readonly idsObjetos: string[];
};

export interface FaceSelecionadaEdicaoEditor3D {
    readonly idObjeto: string;
    readonly idFace: string;
};

export interface VerticeSelecionadoEdicaoEditor3D {
    readonly idObjeto: string;
    readonly indiceVertice: number;
};

export interface ArestaSelecionadaEdicaoEditor3D {
    readonly idObjeto: string;
    readonly indiceOrigem: number;
    readonly indiceDestino: number;
};

export interface TipoSelecaoEdicaoEditor3DDef {
    readonly key: TipoSelecaoEdicaoEditor3D;
    readonly nome: string;
    readonly descricao: string;
};

export interface ModoOperacaoEditor3DDef {
    readonly key: ModoOperacaoEditor3D;
    readonly nome: string;
    readonly descricao: string;
};

export const modosOperacaoEditor3D: readonly ModoOperacaoEditor3DDef[] = [
    { key: 'OBJETO', nome: 'Object Mode', descricao: 'Seleciona e transforma objetos inteiros.' },
    { key: 'EDICAO', nome: 'Edit Mode', descricao: 'Edita a geometria interna da mesh selecionada.' },
];

export const tiposSelecaoEdicaoEditor3D: readonly TipoSelecaoEdicaoEditor3DDef[] = [
    { key: 'VERTICE', nome: 'Selecao de Vertice', descricao: 'Seleciona e move vertices da mesh ativa.' },
    { key: 'ARESTA', nome: 'Selecao de Aresta', descricao: 'Seleciona e move arestas da mesh ativa.' },
    { key: 'FACE', nome: 'Selecao de Face', descricao: 'Seleciona e move faces da mesh ativa.' },
];

export function obtemNomeModoOperacaoEditor3D(modo: ModoOperacaoEditor3D): string { return modosOperacaoEditor3D.find(definicao => definicao.key === modo)?.nome ?? 'Object Mode'; }
export function obtemNomeTipoSelecaoEdicaoEditor3D(tipo: TipoSelecaoEdicaoEditor3D): string { return tiposSelecaoEdicaoEditor3D.find(definicao => definicao.key === tipo)?.nome ?? 'Selecao de Vertice'; }
