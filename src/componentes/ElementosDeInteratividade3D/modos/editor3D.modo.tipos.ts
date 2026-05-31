import type { EixoEditor3D, MalhaEditavelEditor3D, Vetor3 } from '../editor/editor3D.tipos';

export type TipoModoEditor3D = 'NENHUM' | 'GRAB' | 'ROTATE' | 'SCALE';

export interface ModoEditor3DNenhum {
    readonly tipo: 'NENHUM';
};

export interface ModoGrabObjetoEditor3D {
    readonly tipo: 'GRAB';
    readonly escopo: 'OBJETO';
    readonly idObjeto: string;
    readonly idsObjetos: string[];
    readonly eixo: EixoEditor3D | null;
    readonly posicaoInicial: Vetor3;
    readonly posicoesIniciais: Record<string, Vetor3>;
};

export interface ModoGrabEdicaoEditor3D {
    readonly tipo: 'GRAB';
    readonly escopo: 'EDICAO';
    readonly idObjeto: string;
    readonly idsObjetos: string[];
    readonly eixo: EixoEditor3D | null;
    readonly indicesVertices: number[];
    readonly malhaInicial: MalhaEditavelEditor3D;
    readonly deltaAcumulado: Vetor3;
};

export type ModoGrabEditor3D = ModoGrabObjetoEditor3D | ModoGrabEdicaoEditor3D;

export interface ModoRotateEditor3D {
    readonly tipo: 'ROTATE';
    readonly idObjeto: string;
    readonly idsObjetos: string[];
    readonly eixo: EixoEditor3D | null;
    readonly livre: boolean;
    readonly entradaNumerica: string;
    readonly rotacaoInicial: Vetor3;
    readonly rotacoesIniciais: Record<string, Vetor3>;
};

export interface ModoScaleEditor3D {
    readonly tipo: 'SCALE';
    readonly idObjeto: string;
    readonly idsObjetos: string[];
    readonly eixo: EixoEditor3D | null;
    readonly escalaInicial: Vetor3;
    readonly escalasIniciais: Record<string, Vetor3>;
};

export type ModoEditor3D = ModoEditor3DNenhum | ModoGrabEditor3D | ModoRotateEditor3D | ModoScaleEditor3D;
export type ModoTransformacaoEditor3D = ModoGrabEditor3D | ModoRotateEditor3D | ModoScaleEditor3D;
