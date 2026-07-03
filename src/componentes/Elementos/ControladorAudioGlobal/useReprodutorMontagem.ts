'use client';

import { useEffect, useRef } from 'react';

import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';

export type MontagemLoop = {
    readonly inicioMs: number;
    readonly retornoMs: number;
    readonly fimMs: number;
    readonly transicaoLoop: { readonly duracaoFadeOutMs: number; readonly duracaoFadeInMs: number; readonly sobreposicaoInicioLoopMs: number };
    readonly automacaoVolume?: readonly { readonly tMs: number; readonly ganhoDb: number }[];
    readonly lowCutHz?: number;
};

const LOOKAHEAD_S = 0.5;
const INTERVALO_AGENDADOR_MS = 120;
const SOBREPOSICAO_MINIMA_FOLGA_MS = 200;
const FADE_IN_INICIAL_MS = 2000;
const FADE_OUT_TROCA_MS = 2500;

// Uma música tocando = uma instância (ganho próprio ligado ao master). Permite fade-out independente ao trocar de música.
type InstanciaMusica = { gainMusica: GainNode; montagem: MontagemLoop; sources: AudioBufferSourceNode[]; intervalo: number | null; proximaT: number };

// Toca a música configurada em loop (Início→Fim, depois Fim→Retorno com crossfade), com fade-in inicial de 2s.
// Ao trocar de música, a anterior faz fade-out de 2.5s. Master gain = volume global (sem mute). 1ª fatia do Motor de Áudio.
export function useReprodutorMontagem(caminhoArquivo: string | null, montagem: MontagemLoop | null, volume: number, ganhoNormalizacao: number): void {
    const ctxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const lowCutRef = useRef<BiquadFilterNode | null>(null);
    const instanciaRef = useRef<InstanciaMusica | null>(null);
    const volumeRef = useRef(volume);
    const gestoRef = useRef<(() => void) | null>(null);
    const ganhoNormRef = useRef(ganhoNormalizacao);
    volumeRef.current = volume;
    ganhoNormRef.current = ganhoNormalizacao;

    const chave = caminhoArquivo && montagem ? `${caminhoArquivo}#${montagem.inicioMs},${montagem.retornoMs},${montagem.fimMs},${montagem.transicaoLoop.duracaoFadeOutMs},${montagem.transicaoLoop.duracaoFadeInMs},${montagem.transicaoLoop.sobreposicaoInicioLoopMs}` : '';

    // ajusta o volume do master suavemente, sem reiniciar
    useEffect(() => {
        const ctx = ctxRef.current;
        const master = masterGainRef.current;
        if (ctx && master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.04);
    }, [volume]);

    // ajusta o ganho de NORMALIZAÇÃO da faixa atual suavemente (per-faixa, no gainMusica, sob o master)
    useEffect(() => {
        const ctx = ctxRef.current;
        const instancia = instanciaRef.current;
        if (ctx && instancia) instancia.gainMusica.gain.setTargetAtTime(ganhoNormalizacao, ctx.currentTime, 0.04);
    }, [ganhoNormalizacao]);

    useEffect(() => {
        let cancelado = false;

        function obterCtx(): AudioContext {
            if (!ctxRef.current) {
                ctxRef.current = new AudioContext();
                masterGainRef.current = ctxRef.current.createGain();
                masterGainRef.current.gain.value = volumeRef.current;
                lowCutRef.current = ctxRef.current.createBiquadFilter();
                lowCutRef.current.type = 'highpass';
                lowCutRef.current.Q.value = 0.707;
                lowCutRef.current.frequency.value = 20;
                masterGainRef.current.connect(lowCutRef.current);
                lowCutRef.current.connect(ctxRef.current.destination);
            }
            return ctxRef.current;
        }

        function removerGesto() {
            if (!gestoRef.current) return;
            window.removeEventListener('pointerdown', gestoRef.current);
            window.removeEventListener('keydown', gestoRef.current);
            gestoRef.current = null;
        }

        function sobreposicaoSegura(m: MontagemLoop): number {
            const limite = Math.max(0, m.fimMs - m.retornoMs - SOBREPOSICAO_MINIMA_FOLGA_MS);
            return Math.min(m.transicaoLoop.sobreposicaoInicioLoopMs, limite);
        }

        function agendarFonte(instancia: InstanciaMusica, buffer: AudioBuffer, offsetMs: number, duracaoMs: number, quando: number, fadeInMs: number, fadeOutMs: number) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const ganho = ctx.createGain();
            source.connect(ganho);
            const t0 = Math.max(ctx.currentTime, quando);
            const dur = Math.max(0.02, duracaoMs / 1000);
            // automação de volume: um ganho por-trecho que segue a curva (pontos) ao longo do buffer tocado — mesma envelope do editor; o loop reaplica a curva do trecho a cada ciclo
            const pontosAuto = instancia.montagem.automacaoVolume ?? [];
            const ganhoLinAutoEm = (ms: number): number => {
                if (pontosAuto.length === 0) return 1;
                if (ms <= pontosAuto[0].tMs) return Math.pow(10, pontosAuto[0].ganhoDb / 20);
                const ultimo = pontosAuto[pontosAuto.length - 1];
                if (ms >= ultimo.tMs) return Math.pow(10, ultimo.ganhoDb / 20);
                for (let i = 0; i < pontosAuto.length - 1; i++) { const a = pontosAuto[i], b = pontosAuto[i + 1]; if (ms >= a.tMs && ms <= b.tMs) { const f = (ms - a.tMs) / (b.tMs - a.tMs); return Math.pow(10, (a.ganhoDb + f * (b.ganhoDb - a.ganhoDb)) / 20); } }
                return 1;
            };
            const ganhoAuto = ctx.createGain();
            ganhoAuto.gain.setValueAtTime(ganhoLinAutoEm(offsetMs), t0);
            for (const p of pontosAuto) if (p.tMs > offsetMs && p.tMs < offsetMs + duracaoMs) ganhoAuto.gain.linearRampToValueAtTime(Math.pow(10, p.ganhoDb / 20), t0 + (p.tMs - offsetMs) / 1000);
            ganhoAuto.gain.linearRampToValueAtTime(ganhoLinAutoEm(offsetMs + duracaoMs), t0 + dur);
            ganho.connect(ganhoAuto);
            ganhoAuto.connect(instancia.gainMusica);
            const fadeIn = fadeInMs / 1000;
            const fadeOut = fadeOutMs / 1000;
            if (fadeIn > 0) { ganho.gain.setValueAtTime(0, t0); ganho.gain.linearRampToValueAtTime(1, t0 + Math.min(fadeIn, dur)); }
            else ganho.gain.setValueAtTime(1, t0);
            if (fadeOut > 0) { ganho.gain.setValueAtTime(1, t0 + Math.max(fadeIn, dur - fadeOut)); ganho.gain.linearRampToValueAtTime(0, t0 + dur); }
            source.start(t0, Math.max(0, offsetMs / 1000), dur);
            source.onended = () => { instancia.sources = instancia.sources.filter(item => item !== source); source.disconnect(); };
            instancia.sources.push(source);
        }

        function agendarProximas(instancia: InstanciaMusica, buffer: AudioBuffer) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const m = instancia.montagem;
            const sobreposicao = sobreposicaoSegura(m);
            const periodo = Math.max(0.05, (m.fimMs - m.retornoMs - sobreposicao) / 1000);
            while (instancia.proximaT < ctx.currentTime + LOOKAHEAD_S) {
                agendarFonte(instancia, buffer, m.retornoMs, m.fimMs - m.retornoMs, instancia.proximaT, m.transicaoLoop.duracaoFadeInMs, m.transicaoLoop.duracaoFadeOutMs);
                instancia.proximaT += periodo;
            }
        }

        function criarInstancia(buffer: AudioBuffer, m: MontagemLoop) {
            const ctx = ctxRef.current;
            if (!ctx || !masterGainRef.current || cancelado || instanciaRef.current) return;
            if (lowCutRef.current) lowCutRef.current.frequency.setTargetAtTime(m.lowCutHz && m.lowCutHz > 0 ? m.lowCutHz : 20, ctx.currentTime, 0.05);
            const gainMusica = ctx.createGain();
            gainMusica.gain.value = ganhoNormRef.current;
            gainMusica.connect(masterGainRef.current);
            const instancia: InstanciaMusica = { gainMusica, montagem: m, sources: [], intervalo: null, proximaT: 0 };
            const t0 = ctx.currentTime + 0.1;
            agendarFonte(instancia, buffer, m.inicioMs, m.fimMs - m.inicioMs, t0, FADE_IN_INICIAL_MS, m.transicaoLoop.duracaoFadeOutMs);
            instancia.proximaT = t0 + (m.fimMs - m.inicioMs) / 1000 - sobreposicaoSegura(m) / 1000;
            agendarProximas(instancia, buffer);
            instancia.intervalo = window.setInterval(() => agendarProximas(instancia, buffer), INTERVALO_AGENDADOR_MS);
            instanciaRef.current = instancia;
        }

        function fadeOutInstancia(instancia: InstanciaMusica) {
            if (instancia.intervalo !== null) { window.clearInterval(instancia.intervalo); instancia.intervalo = null; }
            const ctx = ctxRef.current;
            if (!ctx) { instancia.sources.forEach(item => { try { item.stop(); } catch { /* ja parou */ } item.disconnect(); }); instancia.gainMusica.disconnect(); return; }
            const t = ctx.currentTime;
            instancia.gainMusica.gain.cancelScheduledValues(t);
            instancia.gainMusica.gain.setValueAtTime(instancia.gainMusica.gain.value, t);
            instancia.gainMusica.gain.linearRampToValueAtTime(0, t + FADE_OUT_TROCA_MS / 1000);
            window.setTimeout(() => {
                instancia.sources.forEach(item => { try { item.stop(); } catch { /* ja parou */ } item.disconnect(); });
                instancia.sources = [];
                instancia.gainMusica.disconnect();
            }, FADE_OUT_TROCA_MS + 120);
        }

        function iniciarComBuffer(buffer: AudioBuffer, m: MontagemLoop) {
            const ctx = obterCtx();
            if (ctx.state === 'running') { criarInstancia(buffer, m); return; }
            ctx.resume().then(() => { if (ctx.state === 'running') criarInstancia(buffer, m); }).catch(() => undefined);
            const aoGesto = () => { const atual = ctxRef.current; if (!atual) return; atual.resume().then(() => criarInstancia(buffer, m)).catch(() => undefined); };
            gestoRef.current = aoGesto;
            window.addEventListener('pointerdown', aoGesto);
            window.addEventListener('keydown', aoGesto);
        }

        if (caminhoArquivo && montagem) {
            (async () => {
                try {
                    const resposta = await fetch(getImageUrl(caminhoArquivo));
                    const bytes = await resposta.arrayBuffer();
                    if (cancelado) return;
                    const ctx = obterCtx();
                    const buffer = await ctx.decodeAudioData(bytes);
                    if (cancelado) return;
                    iniciarComBuffer(buffer, montagem);
                } catch { /* faixa indisponivel: silencio */ }
            })();
        }

        // cleanup: ao trocar de música (ou sem música), a anterior faz fade-out de 2.5s
        return () => {
            cancelado = true;
            removerGesto();
            const anterior = instanciaRef.current;
            instanciaRef.current = null;
            if (anterior) fadeOutInstancia(anterior);
        };
    }, [chave]);

    useEffect(() => () => {
        if (ctxRef.current) { ctxRef.current.close().catch(() => undefined); ctxRef.current = null; masterGainRef.current = null; lowCutRef.current = null; instanciaRef.current = null; }
    }, []);
};
