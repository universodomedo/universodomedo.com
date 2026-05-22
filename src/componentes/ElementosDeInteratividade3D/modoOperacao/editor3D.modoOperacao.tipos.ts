export type ModoOperacaoEditor3D = 'OBJETO' | 'EDICAO';

export interface EscopoEdicaoEditor3D {
    readonly idObjetoAtivo: string;
    readonly idsObjetos: string[];
};

export interface FaceSelecionadaEdicaoEditor3D {
    readonly idObjeto: string;
    readonly idFace: string;
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

export function obtemNomeModoOperacaoEditor3D(modo: ModoOperacaoEditor3D): string { return modosOperacaoEditor3D.find(definicao => definicao.key === modo)?.nome ?? 'Object Mode'; }