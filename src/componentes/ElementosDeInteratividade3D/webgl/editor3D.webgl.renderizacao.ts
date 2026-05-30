import type { BuffersEditor3D } from './editor3D.webgl.buffers';
import type { GeometriaEditor3D, ModoDesenhoEditor3D } from '../geometria/editor3D.geometria.types';
import type { ProgramaEditor3D } from './editor3D.webgl.programa';
import type { Vetor3 } from '../editor/editor3D.tipos';

function obtemModoDesenho(gl: WebGLRenderingContext, modo: ModoDesenhoEditor3D): number {
    if (modo === 'PONTOS') return gl.POINTS;
    if (modo === 'LINHAS') return gl.LINES;

    return gl.TRIANGLES;
};

function criaVetorUniforme(vetor: Vetor3): Float32Array { return new Float32Array([vetor[0], vetor[1], vetor[2]]); };

function usaIluminacaoGeometriaEditor3D(geometria: GeometriaEditor3D): boolean { return geometria.modo === 'TRIANGULOS'; };

export function preparaFrameEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D): void {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.useProgram(programa.programa);
};

export function aplicaMatrizesEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, matrizFinal: Float32Array, matrizModelo: Float32Array): void {
    gl.uniformMatrix4fv(programa.uMatriz, false, matrizFinal);
    gl.uniformMatrix4fv(programa.uMatrizModelo, false, matrizModelo);
};

export function desenhaMalhaEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, buffers: BuffersEditor3D, geometria: GeometriaEditor3D, corBase: Vetor3, corLuz: Vetor3, alpha = 1): void {
    desenhaMalhaIntervaloEditor3D(gl, programa, buffers, geometria, corBase, corLuz, alpha, 0, geometria.quantidadeVertices);
};

export function desenhaMalhaIntervaloEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, buffers: BuffersEditor3D, geometria: GeometriaEditor3D, corBase: Vetor3, corLuz: Vetor3, alpha: number, inicio: number, quantidade: number): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.enableVertexAttribArray(programa.aPosition);
    gl.vertexAttribPointer(programa.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normais);
    gl.enableVertexAttribArray(programa.aNormal);
    gl.vertexAttribPointer(programa.aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(programa.uCorBase, criaVetorUniforme(corBase));
    gl.uniform3fv(programa.uCorLuz, criaVetorUniforme(corLuz));
    gl.uniform1f(programa.uAlpha, alpha);
    gl.uniform1f(programa.uUsaIluminacao, usaIluminacaoGeometriaEditor3D(geometria) ? 1 : 0);
    gl.drawArrays(obtemModoDesenho(gl, geometria.modo), inicio, quantidade);
};
