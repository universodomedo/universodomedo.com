import { criaBuffersEditor3D, limpaBuffersEditor3D, type BuffersEditor3D } from '../webgl/editor3D.webgl.buffers';
import { criaGeometriaFaceEditor3D } from '../geometria/editor3D.geometria.base';
import { criaGeometriaObjetoEditor3D } from '../geometria/primitivas/editor3D.geometria.primitivas';
import { criaGeometriasGizmoEixosEditor3D, criaGeometriasOrigemEditor3D } from '../geometria/guias/editor3D.geometria.guias';
import { criaGuiasPorPlanoEditor3D, criaGuiasRenderizadasEditor3D, obtemBuffersGuiasEditor3D } from './editor3D.renderizador.helpers';
import { criaProgramaEditor3D } from '../webgl/editor3D.webgl.programa';
import type { FaceGeometriaEditor3D } from '../geometria/editor3D.geometria.types';
import type { FaceRenderizadaEditor3D, RecursosRenderizadorEditor3D } from './editor3D.renderizador.types';
import type { ObjetoCenaEditor3D } from '../editor/editor3D.tipos';

function criaBuffersFacesEditor3D(gl: WebGLRenderingContext, faces: readonly FaceGeometriaEditor3D[]): { readonly faces: FaceRenderizadaEditor3D[]; readonly buffers: BuffersEditor3D[]; readonly erro: boolean } {
    const facesRenderizadas: FaceRenderizadaEditor3D[] = [];
    const buffersCriados: BuffersEditor3D[] = [];
    let erro = false;

    faces.forEach(face => {
        const geometria = criaGeometriaFaceEditor3D(face);
        const buffers = criaBuffersEditor3D(gl, geometria);

        if (buffers === null) {
            erro = true;

            return;
        }

        buffersCriados.push(buffers);
        facesRenderizadas.push({ idFace: face.id, geometria, buffers });
    });

    return { faces: facesRenderizadas, buffers: buffersCriados, erro };
};

function criaBuffersMalhas(gl: WebGLRenderingContext, objetos: readonly ObjetoCenaEditor3D[]): { readonly malhas: RecursosRenderizadorEditor3D['malhas']; readonly buffers: BuffersEditor3D[]; readonly erro: boolean } {
    const malhas: RecursosRenderizadorEditor3D['malhas'] = [];
    const buffersCriados: BuffersEditor3D[] = [];
    let erro = false;

    objetos.forEach(objeto => {
        const geometria = criaGeometriaObjetoEditor3D(objeto);
        const buffers = criaBuffersEditor3D(gl, geometria);

        if (buffers === null) {
            erro = true;

            return;
        }

        const faces = criaBuffersFacesEditor3D(gl, geometria.faces);

        buffersCriados.push(buffers, ...faces.buffers);
        if (faces.erro) {
            erro = true;

            return;
        }

        malhas.push({ idObjeto: objeto.id, geometria, buffers, faces: faces.faces });
    });

    return { malhas, buffers: buffersCriados, erro };
};

export function criaRecursosRenderizadorEditor3D(gl: WebGLRenderingContext, objetos: readonly ObjetoCenaEditor3D[]): RecursosRenderizadorEditor3D | null {
    const programa = criaProgramaEditor3D(gl);

    if (programa === null) return null;

    const guiasPorPlano = criaGuiasPorPlanoEditor3D(gl);
    const origem = criaGuiasRenderizadasEditor3D(gl, criaGeometriasOrigemEditor3D());
    const gizmoEixos = criaGuiasRenderizadasEditor3D(gl, criaGeometriasGizmoEixosEditor3D());
    const malhas = criaBuffersMalhas(gl, objetos);

    if (guiasPorPlano === null || origem === null || gizmoEixos === null || malhas.erro) {
        limpaBuffersEditor3D(gl, [...malhas.buffers, ...(guiasPorPlano === null ? [] : obtemBuffersGuiasEditor3D(guiasPorPlano)), ...(origem === null ? [] : origem.map(guia => guia.buffers)), ...(gizmoEixos === null ? [] : gizmoEixos.map(guia => guia.buffers))]);
        gl.deleteProgram(programa.programa);

        return null;
    }

    return { programa, guiasPorPlano, origem, gizmoEixos, malhas: malhas.malhas };
};

export function limpaRecursosRenderizadorEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D): void {
    limpaBuffersEditor3D(gl, [...recursos.malhas.map(malha => malha.buffers), ...recursos.malhas.flatMap(malha => malha.faces.map(face => face.buffers)), ...obtemBuffersGuiasEditor3D(recursos.guiasPorPlano), ...recursos.origem.map(guia => guia.buffers), ...recursos.gizmoEixos.map(guia => guia.buffers)]);
    gl.deleteProgram(recursos.programa.programa);
}