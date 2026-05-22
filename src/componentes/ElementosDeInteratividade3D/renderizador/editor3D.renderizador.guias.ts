import { aplicaMatrizesEditor3D, desenhaMalhaEditor3D } from '../webgl/editor3D.webgl.renderizacao';
import { criaMatrizPerspectiva, criaMatrizTranslacao, multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import { obtemViewportGizmoEixosEditor3D } from './editor3D.renderizador.gizmo';
import type { GuiaRenderizadaEditor3D, RecursosRenderizadorEditor3D } from './editor3D.renderizador.types';
import type { ProgramaEditor3D } from '../webgl/editor3D.webgl.programa';

function desenhaGuiaEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, guia: GuiaRenderizadaEditor3D, matrizFinal: Float32Array, matrizModelo: Float32Array): void {
    aplicaMatrizesEditor3D(gl, programa, matrizFinal, matrizModelo);
    desenhaMalhaEditor3D(gl, programa, guia.buffers, guia.guia.geometria, guia.guia.corBase, guia.guia.corLuz);
};

export function desenhaGuiasCenaEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, plano: keyof RecursosRenderizadorEditor3D['guiasPorPlano'], matrizFinal: Float32Array, matrizModelo: Float32Array): void {
    gl.disable(gl.DEPTH_TEST);
    recursos.guiasPorPlano[plano].forEach(guia => desenhaGuiaEditor3D(gl, recursos.programa, guia, matrizFinal, matrizModelo));
    gl.enable(gl.DEPTH_TEST);
};

export function desenhaOrigemEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, matrizFinal: Float32Array, matrizModelo: Float32Array): void {
    gl.disable(gl.DEPTH_TEST);
    recursos.origem.forEach(guia => desenhaGuiaEditor3D(gl, recursos.programa, guia, matrizFinal, matrizModelo));
    gl.enable(gl.DEPTH_TEST);
};

export function desenhaGizmoEixosEditor3D(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, recursos: RecursosRenderizadorEditor3D, matrizCena: Float32Array): void {
    const viewport = obtemViewportGizmoEixosEditor3D(canvas.width, canvas.height);
    const matrizPerspectivaGizmo = criaMatrizPerspectiva(Math.PI / 3.2, 1, 0.1, 100);
    const matrizCameraGizmo = criaMatrizTranslacao(0, 0, -2.6);
    const matrizFinalGizmo = multiplicaMatriz4(matrizPerspectivaGizmo, multiplicaMatriz4(matrizCameraGizmo, matrizCena));

    gl.viewport(viewport.xViewport, viewport.yViewport, viewport.largura, viewport.altura);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    recursos.gizmoEixos.forEach(guia => desenhaGuiaEditor3D(gl, recursos.programa, guia, matrizFinalGizmo, matrizCena));
    gl.enable(gl.DEPTH_TEST);
};