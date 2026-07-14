'use client';

import { useEffect, useRef } from 'react';
import type { FluxoMusicaDto } from 'types-nora-api';

import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';

// Faixa resolvida da música do PULSO (o dono do fluxo busca via GraphQL); idMusica identifica a quem o caminho pertence
// para o motor nunca tocar o arquivo de uma música com o pulso de outra durante a troca.
export type FluxoMusicaFaixa = { idMusica: number; caminhoArquivo: string; ganhoNormalizacao: number };

type FatiaAtiva = { idMusica: number; gain: GainNode; source: AudioBufferSourceNode };

const FADE_OUT_FIM_DO_FLUXO_MS = 1100;

// Motor de ÁUDIO do Controle de Música em tempo real (reutilizável — palco, protótipo, futuras superfícies):
// toca a FATIA do bloco apontado pelo pulso, com offset pelo iniciadoEmTs (entrar tarde = entrar sincronizado)
// e crossfade pelos fades da transição que trouxe o pulso. O avanço bloco→bloco vem SEMPRE da autoridade dona
// do fluxo (servidor no palco; motor local no protótipo) — aqui não há relógio de avanço, só reação a pulsos.
export function useFluxoMusicaAudio({ fluxo, faixa, volume }: { fluxo: FluxoMusicaDto | null; faixa: FluxoMusicaFaixa | null; volume: number }): void {
    const ctxRef = useRef<AudioContext | null>(null);
    const masterRef = useRef<GainNode | null>(null);
    const buffersRef = useRef<Map<number, AudioBuffer>>(new Map());
    const atualRef = useRef<FatiaAtiva | null>(null);
    const volumeRef = useRef(volume);
    volumeRef.current = volume;

    // Volume da faixa do palco muda sem reiniciar a fatia.
    useEffect(() => {
        const ctx = ctxRef.current;
        if (ctx && masterRef.current) masterRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.04);
    }, [volume]);

    const pulso = fluxo?.pulso ?? null;
    const chavePulso = pulso ? `${pulso.idMusica}:${pulso.idBloco}:${pulso.iniciadoEmTs}` : '';
    const caminhoDaMusicaDoPulso = pulso && faixa && faixa.idMusica === pulso.idMusica ? faixa.caminhoArquivo : null;

    useEffect(() => {
        let cancelado = false;

        function obterCtx(): AudioContext {
            if (!ctxRef.current) {
                ctxRef.current = new AudioContext();
                masterRef.current = ctxRef.current.createGain();
                masterRef.current.gain.value = volumeRef.current;
                masterRef.current.connect(ctxRef.current.destination);
            }
            if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
            return ctxRef.current;
        };

        function apagarAtual(fadeOutMs: number): void {
            const atual = atualRef.current;
            const ctx = ctxRef.current;
            if (!atual || !ctx) return;
            const fadeS = Math.max(fadeOutMs, 30) / 1000;
            atual.gain.gain.setValueAtTime(Math.max(atual.gain.gain.value, 0.0001), ctx.currentTime);
            atual.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeS);
            try { atual.source.stop(ctx.currentTime + fadeS + 0.05); } catch { /* source já parada (fatia terminou sozinha): nada a fazer */ };
            atualRef.current = null;
        };

        // Pulso apagado (silenciar / fim do fluxo): fade-out e silêncio.
        if (!pulso) { apagarAtual(FADE_OUT_FIM_DO_FLUXO_MS); return; }
        if (!fluxo || !caminhoDaMusicaDoPulso || !faixa) return;

        const bloco = fluxo.musicas.find(m => m.idMusica === pulso.idMusica)?.blocos.find(b => b.id === pulso.idBloco);
        if (!bloco) return;

        (async () => {
            const ctx = obterCtx();

            let buffer = buffersRef.current.get(pulso.idMusica) ?? null;
            if (!buffer) {
                try {
                    const resposta = await fetch(getImageUrl(caminhoDaMusicaDoPulso));
                    const bytes = await resposta.arrayBuffer();
                    if (cancelado) return;
                    buffer = await ctx.decodeAudioData(bytes);
                    buffersRef.current.set(pulso.idMusica, buffer);
                } catch { return; /* faixa indisponível: o palco segue só com as vozes */ }
            }
            if (cancelado) return;

            // Offset sincronizado: quem chega tarde entra no ponto certo do bloco; passou do fim = o servidor já vai avançar.
            const decorridoS = Math.max(0, (Date.now() - pulso.iniciadoEmTs) / 1000);
            const offsetS = bloco.inicioMs / 1000 + decorridoS;
            const duracaoS = bloco.fimMs / 1000 - offsetS;
            if (duracaoS <= 0.05) return;

            apagarAtual(pulso.fadeOutMs);

            const gain = ctx.createGain();
            const fadeInS = Math.max(pulso.fadeInMs, 30) / 1000;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(Math.max(faixa.ganhoNormalizacao, 0.0001), ctx.currentTime + fadeInS);
            gain.connect(masterRef.current as GainNode);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(gain);
            source.start(ctx.currentTime, offsetS, duracaoS + 0.1);

            atualRef.current = { idMusica: pulso.idMusica, gain, source };
        })().catch(() => {});

        return () => { cancelado = true; };
    }, [chavePulso, caminhoDaMusicaDoPulso]);

    // Desmontou (saiu do palco/Central): corta tudo.
    useEffect(() => () => {
        const ctx = ctxRef.current;
        const atual = atualRef.current;
        if (atual && ctx) {
            atual.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
            try { atual.source.stop(ctx.currentTime + 0.3); } catch { /* source já parada: nada a fazer */ };
        }
        atualRef.current = null;
    }, []);
};
