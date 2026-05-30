import { aplicaMatrizesEditor3D, desenhaMalhaEditor3D, desenhaMalhaIntervaloEditor3D } from '../../webgl/editor3D.webgl.renderizacao';
import { criaMatrizEscala, multiplicaMatriz4 } from '../../editor/editor3D.matrizes';
import { selecaoFaceEditor3D, selecaoModoEditor3D, selecaoObjetoEditor3D } from './editor3D.selecao.config';
import type { ArestasEdicaoRenderizadasEditor3D, FaceRenderizadaEditor3D, MalhaRenderizadaEditor3D, VerticesEdicaoRenderizadosEditor3D } from '../editor3D.renderizador.types';
import type { ProgramaEditor3D } from '../../webgl/editor3D.webgl.programa';
import type { ArestaSelecionadaEdicaoEditor3D, VerticeSelecionadoEdicaoEditor3D } from '../../modoOperacao/editor3D.modoOperacao.tipos';

const corBaseVerticeEdicaoEditor3D: readonly [number, number, number] = [0.12, 0.82, 0.92];
const corLuzVerticeEdicaoEditor3D: readonly [number, number, number] = [0.78, 1, 1];
const corBaseVerticeSelecionadoEditor3D: readonly [number, number, number] = [1, 0.86, 0.22];
const corLuzVerticeSelecionadoEditor3D: readonly [number, number, number] = [1, 0.96, 0.52];
const corBaseArestaEdicaoEditor3D: readonly [number, number, number] = [0, 0, 0];
const corLuzArestaEdicaoEditor3D: readonly [number, number, number] = [0, 0, 0];
const corBaseArestaSelecionadaEditor3D: readonly [number, number, number] = [1, 0.82, 0.16];
const corLuzArestaSelecionadaEditor3D: readonly [number, number, number] = [1, 0.95, 0.48];

export function desenhaSelecaoObjetoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, malha: MalhaRenderizadaEditor3D, matrizPerspectiva: Float32Array, matrizCamera: Float32Array, matrizObjeto: Float32Array, emModoTransformacao: boolean): void {
    const config = emModoTransformacao ? selecaoModoEditor3D : selecaoObjetoEditor3D;
    const matrizObjetoContorno = multiplicaMatriz4(matrizObjeto, criaMatrizEscala(config.escala, config.escala, config.escala));
    const matrizFinalContorno = multiplicaMatriz4(matrizPerspectiva, multiplicaMatriz4(matrizCamera, matrizObjetoContorno));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    aplicaMatrizesEditor3D(gl, programa, matrizFinalContorno, matrizObjetoContorno);
    desenhaMalhaEditor3D(gl, programa, malha.buffers, malha.geometria, config.corBase, config.corLuz, config.alpha);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
};

export function desenhaFaceSelecionadaEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, face: FaceRenderizadaEditor3D, matrizPerspectiva: Float32Array, matrizCamera: Float32Array, matrizObjeto: Float32Array): void {
    const matrizFinalFace = multiplicaMatriz4(matrizPerspectiva, multiplicaMatriz4(matrizCamera, matrizObjeto));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(-1, -1);
    aplicaMatrizesEditor3D(gl, programa, matrizFinalFace, matrizObjeto);
    desenhaMalhaEditor3D(gl, programa, face.buffers, face.geometria, selecaoFaceEditor3D.corBase, selecaoFaceEditor3D.corLuz, selecaoFaceEditor3D.alpha);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
}

export function desenhaVerticesEdicaoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, verticesEdicao: VerticesEdicaoRenderizadosEditor3D, verticeSelecionado: VerticeSelecionadoEdicaoEditor3D | null, idObjeto: string, matrizPerspectiva: Float32Array, matrizCamera: Float32Array, matrizObjeto: Float32Array): void {
    const matrizFinal = multiplicaMatriz4(matrizPerspectiva, multiplicaMatriz4(matrizCamera, matrizObjeto));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    aplicaMatrizesEditor3D(gl, programa, matrizFinal, matrizObjeto);
    desenhaMalhaEditor3D(gl, programa, verticesEdicao.buffers, verticesEdicao.geometria, corBaseVerticeEdicaoEditor3D, corLuzVerticeEdicaoEditor3D, 0.86);
    if (verticeSelecionado !== null && verticeSelecionado.idObjeto === idObjeto) desenhaMalhaIntervaloEditor3D(gl, programa, verticesEdicao.buffers, verticesEdicao.geometria, corBaseVerticeSelecionadoEditor3D, corLuzVerticeSelecionadoEditor3D, 1, verticeSelecionado.indiceVertice, 1);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
};

export function desenhaArestasEdicaoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, arestasEdicao: ArestasEdicaoRenderizadasEditor3D, arestaSelecionada: ArestaSelecionadaEdicaoEditor3D | null, idObjeto: string, matrizPerspectiva: Float32Array, matrizCamera: Float32Array, matrizObjeto: Float32Array): void {
    const matrizFinal = multiplicaMatriz4(matrizPerspectiva, multiplicaMatriz4(matrizCamera, matrizObjeto));
    const indiceArestaSelecionada = arestaSelecionada === null || arestaSelecionada.idObjeto !== idObjeto ? -1 : arestasEdicao.arestas.findIndex(aresta => (aresta.indiceOrigem === arestaSelecionada.indiceOrigem && aresta.indiceDestino === arestaSelecionada.indiceDestino) || (aresta.indiceOrigem === arestaSelecionada.indiceDestino && aresta.indiceDestino === arestaSelecionada.indiceOrigem));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(-1, -1);
    aplicaMatrizesEditor3D(gl, programa, matrizFinal, matrizObjeto);
    desenhaMalhaEditor3D(gl, programa, arestasEdicao.buffers, arestasEdicao.geometria, corBaseArestaEdicaoEditor3D, corLuzArestaEdicaoEditor3D, 0.9);
    if (indiceArestaSelecionada >= 0) desenhaMalhaIntervaloEditor3D(gl, programa, arestasEdicao.buffers, arestasEdicao.geometria, corBaseArestaSelecionadaEditor3D, corLuzArestaSelecionadaEditor3D, 1, indiceArestaSelecionada * arestasEdicao.verticesPorAresta, arestasEdicao.verticesPorAresta);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
};
