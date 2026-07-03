// Normalização de loudness (não-destrutiva): converte a loudness medida de uma faixa num ganho único aplicado no playback.
// Fonte única do ALVO e do cálculo do ganho — consumido pela Central (ControladorAudioGlobal) e pelo preview do editor de configuração.

// Alvo de loudness da plataforma. Ajustável por ouvido (uma vez → vale pra biblioteca inteira, sem reprocessar nada).
export const ALVO_LOUDNESS_LUFS = -18;

// Margem abaixo de 0 dBFS pra a trava anti-clip (deixa uma folga de segurança no pico).
const MARGEM_ANTI_CLIP = 0.98;

// Ganho LINEAR de normalização de uma faixa, a partir do loudness+pico medidos.
// Trava anti-clip: garante pico × ganho × masterMax ≤ margem, então nunca estoura no nível mais alto do master que vem depois.
// masterMax = teto do ganho aplicado DEPOIS: Central usa o ganho do Máximo (0.8); o preview do editor toca sem master (1).
// loudness nula (faixas antigas, não medidas) → ganho 1 (sem alteração).
export function calcularGanhoNormalizacao(loudnessLufs: number | null, picoDbfs: number | null, masterMax: number): number {
    if (loudnessLufs === null) return 1;
    const desejado = Math.pow(10, (ALVO_LOUDNESS_LUFS - loudnessLufs) / 20);
    if (picoDbfs === null) return desejado;
    const picoLinear = Math.pow(10, picoDbfs / 20);
    const teto = MARGEM_ANTI_CLIP / (picoLinear * masterMax);
    return Math.min(desejado, teto);
};

// LRA (LU) a partir do qual a faixa é considerada dinâmica demais para fundo (o corpo some se o pico bater no teto). Limiar de sinalização, ajustável.
export const LIMIAR_LRA_DINAMICA_ALTA = 10;

// Detalhe da normalização para exibição/sinalização no editor: ganho em dB e se o ganho foi travado pela trava anti-clip (pico limitou antes de chegar ao alvo).
export function detalharGanhoNormalizacao(loudnessLufs: number | null, picoDbfs: number | null, masterMax: number): { ganhoDb: number; travadoAntiClip: boolean } {
    const ganho = calcularGanhoNormalizacao(loudnessLufs, picoDbfs, masterMax);
    const desejado = loudnessLufs === null ? 1 : Math.pow(10, (ALVO_LOUDNESS_LUFS - loudnessLufs) / 20);
    return { ganhoDb: 20 * Math.log10(ganho), travadoAntiClip: loudnessLufs !== null && ganho < desejado - 1e-6 };
};
