import { criaBuffersEditor3D, limpaBuffersEditor3D, type BuffersEditor3D } from '../webgl/editor3D.webgl.buffers';
import { criaGeometriaArestasEdicaoEditor3D, criaGeometriaVerticesEdicaoEditor3D } from '../geometria/editor3D.geometria.edicao';
import { criaGeometriaFaceEditor3D } from '../geometria/editor3D.geometria.base';
import { criaGeometriaObjetoEditor3D } from '../geometria/primitivas/editor3D.geometria.primitivas';
import { criaGeometriasGizmoEixosEditor3D, criaGeometriasOrigemEditor3D } from '../geometria/guias/editor3D.geometria.guias';
import { criaGuiasPorPlanoEditor3D, criaGuiasRenderizadasEditor3D, obtemBuffersGuiasEditor3D } from './editor3D.renderizador.helpers';
import { criaProgramaEditor3D } from '../webgl/editor3D.webgl.programa';
import type { FaceGeometriaEditor3D } from '../geometria/editor3D.geometria.types';
import type { ArestasEdicaoRenderizadasEditor3D, FaceRenderizadaEditor3D, RecursosRenderizadorEditor3D, VerticesEdicaoRenderizadosEditor3D } from './editor3D.renderizador.types';
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

function criaBuffersVerticesEdicaoEditor3D(gl: WebGLRenderingContext, objeto: ObjetoCenaEditor3D): { readonly verticesEdicao: VerticesEdicaoRenderizadosEditor3D | null; readonly buffers: BuffersEditor3D[]; readonly erro: boolean } {
    if (objeto.malhaEditavel === null) return { verticesEdicao: null, buffers: [], erro: false };

    const geometria = criaGeometriaVerticesEdicaoEditor3D(objeto.malhaEditavel);
    const buffers = criaBuffersEditor3D(gl, geometria);

    if (buffers === null) return { verticesEdicao: null, buffers: [], erro: true };

    return { verticesEdicao: { geometria, buffers }, buffers: [buffers], erro: false };
};

function criaBuffersArestasEdicaoEditor3D(gl: WebGLRenderingContext, objeto: ObjetoCenaEditor3D): { readonly arestasEdicao: ArestasEdicaoRenderizadasEditor3D | null; readonly buffers: BuffersEditor3D[]; readonly erro: boolean } {
    if (objeto.malhaEditavel === null) return { arestasEdicao: null, buffers: [], erro: false };

    const geometriaArestas = criaGeometriaArestasEdicaoEditor3D(objeto.malhaEditavel);
    const buffers = criaBuffersEditor3D(gl, geometriaArestas.geometria);

    if (buffers === null) return { arestasEdicao: null, buffers: [], erro: true };

    return { arestasEdicao: { geometria: geometriaArestas.geometria, buffers, arestas: geometriaArestas.arestas, verticesPorAresta: geometriaArestas.verticesPorAresta }, buffers: [buffers], erro: false };
};

function obtemBuffersEdicaoMalhaEditor3D(malha: RecursosRenderizadorEditor3D['malhas'][number]): BuffersEditor3D[] {
    const buffers: BuffersEditor3D[] = [];

    if (malha.verticesEdicao !== null) buffers.push(malha.verticesEdicao.buffers);
    if (malha.arestasEdicao !== null) buffers.push(malha.arestasEdicao.buffers);

    return buffers;
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
        const verticesEdicao = criaBuffersVerticesEdicaoEditor3D(gl, objeto);
        const arestasEdicao = criaBuffersArestasEdicaoEditor3D(gl, objeto);

        buffersCriados.push(buffers, ...faces.buffers, ...verticesEdicao.buffers, ...arestasEdicao.buffers);
        if (faces.erro || verticesEdicao.erro || arestasEdicao.erro) {
            erro = true;

            return;
        }

        malhas.push({ idObjeto: objeto.id, geometria, buffers, faces: faces.faces, verticesEdicao: verticesEdicao.verticesEdicao, arestasEdicao: arestasEdicao.arestasEdicao });
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
    limpaBuffersEditor3D(gl, [...recursos.malhas.map(malha => malha.buffers), ...recursos.malhas.flatMap(malha => malha.faces.map(face => face.buffers)), ...recursos.malhas.flatMap(obtemBuffersEdicaoMalhaEditor3D), ...obtemBuffersGuiasEditor3D(recursos.guiasPorPlano), ...recursos.origem.map(guia => guia.buffers), ...recursos.gizmoEixos.map(guia => guia.buffers)]);
    gl.deleteProgram(recursos.programa.programa);
}
