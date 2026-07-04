'use client';

// Efeito sonoro de Vitória: fanfarra ascendente sintetizada via Web Audio (sem asset/arquivo/URL, sem new Audio/<audio>), reutilizando um único AudioContext. Mesmo padrão de admin/pagamentos/sons.ts. Best-effort: bloqueio de autoplay ou falha nunca interrompe a finalização da Sala.
let contextoAudio: AudioContext | null = null;

function obterContextoAudio(): AudioContext | null {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
    if (!contextoAudio) contextoAudio = new window.AudioContext();
    return contextoAudio;
};

function tocaAcorde(ctx: AudioContext, freqs: readonly number[], em: number, duracao: number, volume: number): void {
    const inicio = ctx.currentTime + em;
    for (const freq of freqs) {
        const oscilador = ctx.createOscillator();
        const ganho = ctx.createGain();
        oscilador.type = 'triangle';
        oscilador.frequency.setValueAtTime(freq, inicio);
        ganho.gain.setValueAtTime(0.0001, inicio);
        ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.02);
        ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
        oscilador.connect(ganho);
        ganho.connect(ctx.destination);
        oscilador.start(inicio);
        oscilador.stop(inicio + duracao + 0.02);
    }
};

// Fanfarra celebratória: arpejo ascendente C5-E5-G5 culminando num acorde maior sustentado C6-E6-G6 (~1.6s).
export function somVitoria(): void {
    try {
        const ctx = obterContextoAudio();
        if (!ctx) return;
        const disparar = (): void => {
            tocaAcorde(ctx, [523.25], 0, 0.18, 0.3);
            tocaAcorde(ctx, [659.25], 0.16, 0.18, 0.3);
            tocaAcorde(ctx, [783.99], 0.32, 0.22, 0.3);
            tocaAcorde(ctx, [1046.5, 1318.51, 1567.98], 0.5, 1.1, 0.24);
        };
        if (ctx.state === 'suspended') { ctx.resume().then(disparar).catch(() => {}); return; }
        disparar();
    } catch { /* best-effort: áudio nunca interrompe a finalização */ }
};
