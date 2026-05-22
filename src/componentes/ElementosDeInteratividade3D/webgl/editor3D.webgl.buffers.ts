import type { GeometriaEditor3D } from '../geometria/editor3D.geometria.types';

export interface BuffersEditor3D {
    readonly vertices: WebGLBuffer;
    readonly normais: WebGLBuffer;
};

export function criaBuffersEditor3D(gl: WebGLRenderingContext, geometria: GeometriaEditor3D): BuffersEditor3D | null {
    const bufferVertices = gl.createBuffer();
    const bufferNormais = gl.createBuffer();

    if (!bufferVertices || !bufferNormais) return null;

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, geometria.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormais);
    gl.bufferData(gl.ARRAY_BUFFER, geometria.normais, gl.STATIC_DRAW);

    return { vertices: bufferVertices, normais: bufferNormais };
};

export function limpaBuffersEditor3D(gl: WebGLRenderingContext, buffers: readonly BuffersEditor3D[]): void {
    buffers.forEach(buffer => {
        gl.deleteBuffer(buffer.vertices);
        gl.deleteBuffer(buffer.normais);
    });
};