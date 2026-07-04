'use client';

// Efeitos sonoros da tela de Pagamentos, sintetizados via Web Audio (sem asset/arquivo/URL, sem new Audio/<audio>), reutilizando um único AudioContext. Mesmo padrão de reproduzirSomNotificacao. Best-effort: bloqueio de autoplay ou falha nunca interrompe o fluxo.
let contextoAudio: AudioContext | null = null;

function obterContextoAudio(): AudioContext | null {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
    if (!contextoAudio) contextoAudio = new window.AudioContext();
    return contextoAudio;
};

function tocaNotas(ctx: AudioContext, notas: readonly { readonly freq: number; readonly em: number }[], duracao: number, volume: number): void {
    const inicio = ctx.currentTime;
    const oscilador = ctx.createOscillator();
    const ganho = ctx.createGain();
    oscilador.type = 'sine';
    for (const nota of notas) oscilador.frequency.setValueAtTime(nota.freq, inicio + nota.em);
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
    oscilador.connect(ganho);
    ganho.connect(ctx.destination);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracao + 0.02);
};

function comContextoAtivo(reproduz: (ctx: AudioContext) => void): void {
    try {
        const ctx = obterContextoAudio();
        if (!ctx) return;
        if (ctx.state === 'suspended') { ctx.resume().then(() => reproduz(ctx)).catch(() => {}); return; }
        reproduz(ctx);
    } catch { /* best-effort: áudio nunca interrompe o recebimento do evento */ }
};

// SoundEffect1 — Pix gerado (aguardando): mais alto e sustentado (~2s), duas notas.
export function somPixGerado(): void {
    comContextoAtivo(ctx => tocaNotas(ctx, [{ freq: 560, em: 0 }, { freq: 740, em: 0.4 }], 2, 0.28));
};

// SoundEffect2 — Pagamento confirmado (pago): chime ascendente, mais alto e longo (~2s), celebratório.
export function somPagamentoConfirmado(): void {
    comContextoAtivo(ctx => tocaNotas(ctx, [{ freq: 880, em: 0 }, { freq: 1174, em: 0.4 }, { freq: 1568, em: 0.8 }, { freq: 2093, em: 1.2 }], 2, 0.34));
};