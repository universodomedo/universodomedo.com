import type { BuffersEditor3D } from '../webgl/editor3D.webgl.buffers';
import type { GeometriaEditor3D, GuiaEditor3D } from '../geometria/editor3D.geometria.types';
import type { ObjetoCenaEditor3D } from '../editor/editor3D.tipos';
import type { PlanoGuiaEditor3D } from '../editor/editor3D.camera';
import type { ProgramaEditor3D } from '../webgl/editor3D.webgl.programa';

export interface FaceRenderizadaEditor3D {
    readonly idFace: string;
    readonly geometria: GeometriaEditor3D;
    readonly buffers: BuffersEditor3D;
};

export interface MalhaRenderizadaEditor3D {
    readonly idObjeto: string;
    readonly geometria: GeometriaEditor3D;
    readonly buffers: BuffersEditor3D;
    readonly faces: FaceRenderizadaEditor3D[];
};

export interface GuiaRenderizadaEditor3D {
    readonly guia: GuiaEditor3D;
    readonly buffers: BuffersEditor3D;
};

export type GuiasRenderizadasPorPlanoEditor3D = Record<PlanoGuiaEditor3D, GuiaRenderizadaEditor3D[]>;

export interface RecursosRenderizadorEditor3D {
    readonly programa: ProgramaEditor3D;
    readonly guiasPorPlano: GuiasRenderizadasPorPlanoEditor3D;
    readonly origem: GuiaRenderizadaEditor3D[];
    readonly gizmoEixos: GuiaRenderizadaEditor3D[];
    readonly malhas: MalhaRenderizadaEditor3D[];
};

export interface ObjetoDesenhoEditor3D {
    readonly objeto: ObjetoCenaEditor3D;
    readonly malha: MalhaRenderizadaEditor3D;
}