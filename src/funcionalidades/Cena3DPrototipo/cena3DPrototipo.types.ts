export type TipoObjetoCena3DPrototipo = 'VERTICE' | 'PLANO_2D' | 'CIRCULO_2D' | 'CUBO_3D' | 'CILINDRO_3D' | 'ESFERA_3D';
export type Vetor3Cena3DPrototipo = readonly [number, number, number];

export interface TransformCena3DPrototipo {
    readonly posicao: Vetor3Cena3DPrototipo;
    readonly rotacao: Vetor3Cena3DPrototipo;
    readonly escala: Vetor3Cena3DPrototipo;
    readonly matrizBase: readonly number[];
};

export interface MaterialCena3DPrototipo {
    readonly corBase: Vetor3Cena3DPrototipo;
    readonly corLuz: Vetor3Cena3DPrototipo;
};

export interface ObjetoCena3DPrototipo {
    readonly id: string;
    readonly nome: string;
    readonly tipo: TipoObjetoCena3DPrototipo;
    readonly quantidadeVertices: number;
    readonly transform: TransformCena3DPrototipo;
    readonly material: MaterialCena3DPrototipo;
    readonly visivel: boolean;
    readonly colisao: boolean;
    readonly colecaoId: string | null;
};

export interface ColecaoCena3DPrototipo {
    readonly id: string;
    readonly nome: string;
    readonly idsObjetos: readonly string[];
    readonly visivel: boolean;
};

export interface PontoEntradaJogadorCena3DPrototipo {
    readonly posicao: Vetor3Cena3DPrototipo;
    readonly rotacaoZ: number;
};

export interface ConfiguracaoAmbienteCena3DPrototipo {
    readonly corFundo: string;
    readonly luzAmbiente: number;
    readonly mostrarGrade: boolean;
};

export interface DocumentoCena3DPrototipo {
    readonly versao: 1;
    readonly objetos: readonly ObjetoCena3DPrototipo[];
    readonly colecoes: readonly ColecaoCena3DPrototipo[];
    readonly pontoEntradaJogador: PontoEntradaJogadorCena3DPrototipo;
    readonly configuracaoAmbiente: ConfiguracaoAmbienteCena3DPrototipo;
};
