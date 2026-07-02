// Medidor de loudness BS.1770-4 (LUFS integrado) + pico de amostra. Função pura, framework-agnóstica.
// Provado contra o ffmpeg (loudnorm/astats) em 6 faixas: LUFS dentro de ±0.07 LU, pico idêntico ao astats.
// Requisito: os canais devem estar a 48000 Hz (os coeficientes K-weighting são os de 48 kHz). Quem decodifica deve usar um contexto de áudio a 48 kHz.

export interface ResultadoLoudness { lufsIntegrado: number; picoDb: number; };

// K-weighting BS.1770 (coeficientes de 48 kHz): estágio 1 high-shelf + estágio 2 high-pass.
function kweight(x: Float32Array): Float32Array {
    const b0 = 1.53512485958697, b1 = -2.69169618940638, b2 = 1.19839281085285, a1 = -1.69065929318241, a2 = 0.73248077421585;
    const c0 = 1.0, c1 = -2.0, c2 = 1.0, d1 = -1.99004745483398, d2 = 0.99007225036621;
    const y = new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let n = 0; n < x.length; n++) { const xn = x[n]; const yn = b0 * xn + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = xn; y2 = y1; y1 = yn; y[n] = yn; }
    let X1 = 0, X2 = 0, Y1 = 0, Y2 = 0;
    for (let n = 0; n < y.length; n++) { const Xn = y[n]; const Yn = c0 * Xn + c1 * X1 + c2 * X2 - d1 * Y1 - d2 * Y2; X2 = X1; X1 = Xn; Y2 = Y1; Y1 = Yn; y[n] = Yn; }
    return y;
};

export function medirLoudness(canais: Float32Array[], sampleRate: number): ResultadoLoudness {
    let pico = 0;
    for (const c of canais) for (let i = 0; i < c.length; i++) { const a = Math.abs(c[i]); if (a > pico) pico = a; }

    const G = canais.map((_, i) => (i < 2 ? 1.0 : 1.41));
    const filt = canais.map(c => kweight(c));
    const blockLen = Math.round(0.4 * sampleRate);
    const step = Math.round(0.1 * sampleRate);
    const n = filt[0].length;

    const blocos: { z: number[]; L: number }[] = [];
    for (let start = 0; start + blockLen <= n; start += step) {
        const z = filt.map(c => { let s = 0; for (let i = start; i < start + blockLen; i++) { const v = c[i]; s += v * v; } return s / blockLen; });
        let sum = 0; for (let c = 0; c < z.length; c++) sum += G[c] * z[c];
        blocos.push({ z, L: -0.691 + 10 * Math.log10(sum) });
    }

    const absG = blocos.filter(b => b.L >= -70);
    if (!absG.length) return { lufsIntegrado: -Infinity, picoDb: 20 * Math.log10(pico) };

    const zbar = canais.map((_, c) => absG.reduce((a, b) => a + b.z[c], 0) / absG.length);
    let sumbar = 0; for (let c = 0; c < zbar.length; c++) sumbar += G[c] * zbar[c];
    const gammaR = -0.691 + 10 * Math.log10(sumbar) - 10;

    const relG = absG.filter(b => b.L >= gammaR);
    const usados = relG.length ? relG : absG;
    const zf = canais.map((_, c) => usados.reduce((a, b) => a + b.z[c], 0) / usados.length);
    let sumf = 0; for (let c = 0; c < zf.length; c++) sumf += G[c] * zf[c];
    return { lufsIntegrado: -0.691 + 10 * Math.log10(sumf), picoDb: 20 * Math.log10(pico) };
};
