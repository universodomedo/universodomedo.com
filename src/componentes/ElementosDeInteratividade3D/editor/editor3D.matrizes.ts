export function criaMatrizIdentidadeEditor3D(): Float32Array { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); };

export function criaMatrizPerspectiva(campoVisao: number, proporcao: number, minimo: number, maximo: number): Float32Array {
    const f = 1 / Math.tan(campoVisao / 2);
    const nf = 1 / (minimo - maximo);

    return new Float32Array([f / proporcao, 0, 0, 0, 0, f, 0, 0, 0, 0, (maximo + minimo) * nf, -1, 0, 0, (2 * maximo * minimo) * nf, 0]);
};

export function criaMatrizTranslacao(x: number, y: number, z: number): Float32Array { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); };

export function criaMatrizEscala(x: number, y: number, z: number): Float32Array { return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]); };

export function criaMatrizRotacaoX(angulo: number): Float32Array {
    const c = Math.cos(angulo);
    const s = Math.sin(angulo);

    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
};

export function criaMatrizRotacaoY(angulo: number): Float32Array {
    const c = Math.cos(angulo);
    const s = Math.sin(angulo);

    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
};

export function criaMatrizRotacaoZ(angulo: number): Float32Array {
    const c = Math.cos(angulo);
    const s = Math.sin(angulo);

    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
};

export function multiplicaMatriz4(a: Float32Array, b: Float32Array): Float32Array {
    const resultado = new Float32Array(16);

    for (let coluna = 0; coluna < 4; coluna++) {
        for (let linha = 0; linha < 4; linha++) {
            resultado[(coluna * 4) + linha] = (a[linha] * b[coluna * 4]) + (a[4 + linha] * b[(coluna * 4) + 1]) + (a[8 + linha] * b[(coluna * 4) + 2]) + (a[12 + linha] * b[(coluna * 4) + 3]);
        }
    }

    return resultado;
};