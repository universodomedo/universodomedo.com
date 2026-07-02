import { medirLoudness, type ResultadoLoudness } from './medidorLoudness';

// Decodifica um arquivo de áudio num contexto 48 kHz (p/ os coeficientes K-weighting do medidor baterem) e mede loudness + pico.
// Retorna null se não conseguir decodificar: a medição é opcional (fica nula no banco) e NUNCA deve travar o upload.
export async function medirLoudnessDeArquivo(arquivo: File): Promise<ResultadoLoudness | null> {
    try {
        const ctx = new AudioContext({ sampleRate: 48000 });
        try {
            const bytes = await arquivo.arrayBuffer();
            const buffer = await ctx.decodeAudioData(bytes);
            const canais: Float32Array[] = [];
            for (let c = 0; c < buffer.numberOfChannels; c++) canais.push(buffer.getChannelData(c));
            return medirLoudness(canais, buffer.sampleRate);
        } finally {
            ctx.close().catch(() => undefined);
        }
    } catch {
        return null;
    }
};
