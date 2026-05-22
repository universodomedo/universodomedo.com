import { aplicaMatrizesEditor3D, desenhaMalhaEditor3D } from '../../webgl/editor3D.webgl.renderizacao';
import { criaMatrizEscala, multiplicaMatriz4 } from '../../editor/editor3D.matrizes';
import { selecaoModoEditor3D, selecaoObjetoEditor3D } from './editor3D.selecao.config';
import type { MalhaRenderizadaEditor3D } from '../editor3D.renderizador.types';
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