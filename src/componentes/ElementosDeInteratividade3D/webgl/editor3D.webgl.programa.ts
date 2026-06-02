import { codigoFragmentShaderEditor3D, codigoVertexShaderEditor3D } from './editor3D.webgl.shaders';

export interface ProgramaEditor3D {
    readonly programa: WebGLProgram;
    readonly aPosition: number;
    readonly aNormal: number;
    readonly uMatriz: WebGLUniformLocation;
    readonly uMatrizModelo: WebGLUniformLocation;
    readonly uCorBase: WebGLUniformLocation;
    readonly uCorLuz: WebGLUniformLocation;
    readonly uAlpha: WebGLUniformLocation;
    readonly uUsaIluminacao: WebGLUniformLocation;
    readonly uModoShader: WebGLUniformLocation;
};

function criaShader(gl: WebGLRenderingContext, tipo: number, codigo: string): WebGLShader | null {
    const shader = gl.createShader(tipo);

    if (!shader) return null;

    gl.shaderSource(shader, codigo);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);

        return null;
    }

    return shader;
};

function criaProgramaVazioEditor3D(gl: WebGLRenderingContext): WebGLProgram | null {
    const vertexShader = criaShader(gl, gl.VERTEX_SHADER, codigoVertexShaderEditor3D);
    const fragmentShader = criaShader(gl, gl.FRAGMENT_SHADER, codigoFragmentShaderEditor3D);

    if (!vertexShader || !fragmentShader) return null;

    const programa = gl.createProgram();

    if (!programa) return null;

    gl.attachShader(programa, vertexShader);
    gl.attachShader(programa, fragmentShader);
    gl.linkProgram(programa);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (gl.getProgramParameter(programa, gl.LINK_STATUS)) return programa;

    gl.deleteProgram(programa);

    return null;
};

export function criaProgramaEditor3D(gl: WebGLRenderingContext): ProgramaEditor3D | null {
    const programa = criaProgramaVazioEditor3D(gl);

    if (programa === null) return null;

    const aPosition = gl.getAttribLocation(programa, 'aPosition');
    const aNormal = gl.getAttribLocation(programa, 'aNormal');
    const uMatriz = gl.getUniformLocation(programa, 'uMatriz');
    const uMatrizModelo = gl.getUniformLocation(programa, 'uMatrizModelo');
    const uCorBase = gl.getUniformLocation(programa, 'uCorBase');
    const uCorLuz = gl.getUniformLocation(programa, 'uCorLuz');
    const uAlpha = gl.getUniformLocation(programa, 'uAlpha');
    const uUsaIluminacao = gl.getUniformLocation(programa, 'uUsaIluminacao');
    const uModoShader = gl.getUniformLocation(programa, 'uModoShader');

    if (aPosition < 0 || aNormal < 0 || !uMatriz || !uMatrizModelo || !uCorBase || !uCorLuz || !uAlpha || !uUsaIluminacao || !uModoShader) {
        gl.deleteProgram(programa);

        return null;
    }

    return { programa, aPosition, aNormal, uMatriz, uMatrizModelo, uCorBase, uCorLuz, uAlpha, uUsaIluminacao, uModoShader };
};
