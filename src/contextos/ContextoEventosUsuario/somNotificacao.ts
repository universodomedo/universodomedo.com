'use client';

// Etapa 18: efeito sonoro curto de nova notificação ao vivo. Sintetizado via Web Audio (sem asset/arquivo/URL/dependência),
// reutilizando um único AudioContext. Best-effort: bloqueio de autoplay ou falha nunca interrompe o fluxo (sem retry, sem spam).
let contextoAudio: AudioContext | null = null;

function obterContextoAudio(): AudioContext | null {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
    if (!contextoAudio) contextoAudio = new window.AudioContext();
    return contextoAudio;
};

function emitirChime(ctx: AudioContext): void {
    const inicio = ctx.currentTime;
    const oscilador = ctx.createOscillator();
    const ganho = ctx.createGain();
    oscilador.type = 'sine';
    oscilador.frequency.setValueAtTime(880, inicio);
    oscilador.frequency.setValueAtTime(1318, inicio + 0.08);
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.3);
    oscilador.connect(ganho);
    ganho.connect(ctx.destination);
    oscilador.start(inicio);
    oscilador.stop(inicio + 0.32);
};

export function reproduzirSomNotificacao(): void {
    try {
        const ctx = obterContextoAudio();
        if (!ctx) return;
        if (ctx.state === 'suspended') { ctx.resume().then(() => emitirChime(ctx)).catch(() => {}); return; }
        emitirChime(ctx);
    } catch { /* best-effort: áudio nunca interrompe o recebimento da notificação */ }
};
