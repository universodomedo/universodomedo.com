import { aplicaMatrizesEditor3D, desenhaMalhaEditor3D } from '../../webgl/editor3D.webgl.renderizacao';
import { criaMatrizEscala, multiplicaMatriz4 } from '../../editor/editor3D.matrizes';
import { selecaoFaceEditor3D, selecaoModoEditor3D, selecaoObjetoEditor3D } from './editor3D.selecao.config';
import type { FaceRenderizadaEditor3D, MalhaRenderizadaEditor3D } from '../editor3D.renderizador.types';
import type { ProgramaEditor3D } from '../../webgl/editor3D.webgl.programa';

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