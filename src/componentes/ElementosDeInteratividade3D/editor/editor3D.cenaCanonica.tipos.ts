import type { MaterialVisualEditor3D } from './editor3D.materialVisual.tipos';
import type { ShaderEditor3D } from './editor3D.shader.tipos';
import type { TipoMalhaEditor3D } from './editor3D.tipos';

export type Vetor3CenaCanonicaEditor3D = readonly [number, number, number];

export interface FaceMalhaEditavelCenaCanonicaEditor3D {
    readonly id: string;
    readonly nome: string;
    readonly indicesVertices: readonly number[];
};

export interface MalhaEditavelCenaCanonicaEditor3D {
    readonly vertices: readonly Vetor3CenaCanonicaEditor3D[];
    readonly faces: readonly FaceMalhaEditavelCenaCanonicaEditor3D[];
    readonly proximoIdFace: number;
};

export interface ObjetoCenaCanonicaEditor3D {
    readonly idLocal: string;
    readonly nome: string;
    readonly tipo: TipoMalhaEditor3D;
    readonly quantidadeVertices: number;
    readonly posicao: Vetor3CenaCanonicaEditor3D;
    readonly rotacao: Vetor3CenaCanonicaEditor3D;
    readonly escala: Vetor3CenaCanonicaEditor3D;
    readonly matrizBase: readonly number[];
    readonly corBase: Vetor3CenaCanonicaEditor3D;
    readonly corLuz: Vetor3CenaCanonicaEditor3D;
    readonly materialVisual: MaterialVisualEditor3D | null;
    readonly shader: ShaderEditor3D;
    readonly visivel: boolean;
    readonly malhaEditavel?: MalhaEditavelCenaCanonicaEditor3D;
};

export interface CenaCanonicaEditor3D {
    readonly versao: 1;
    readonly objetos: readonly ObjetoCenaCanonicaEditor3D[];
};