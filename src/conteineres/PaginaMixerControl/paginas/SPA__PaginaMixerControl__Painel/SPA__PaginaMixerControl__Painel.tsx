'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type Contexto__PaginaMixerControl__Props } from 'Contextos/Contexto__PaginaMixerControl/contexto';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import FluxoLinearMixer from './componentes/FluxoLinearMixer/FluxoLinearMixer';
import styles from './styles.module.css';

const DURACAO_PADRAO_MIXER_MS = 108000;

function calculaPosicaoSegundos(estado: NonNullable<Contexto__PaginaMixerControl__Props['estado']>): number {
    if (estado.status === 'PAUSADO' || estado.iniciadoEmMs === null) return estado.posicaoMs / 1000;
    return (estado.posicaoMs + Math.max(0, Date.now() - estado.iniciadoEmMs)) / 1000;
};

export default function SPA__PaginaMixerControl__Painel({ estado, erro, sincronizarEstado }: Contexto__PaginaMixerControl__Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const srcAudio = estado?.faixa ? getImageUrl(estado.faixa.caminhoArquivo) : null;
    const [duracaoMs, setDuracaoMs] = useState(DURACAO_PADRAO_MIXER_MS);
    const [posicaoVisualMs, setPosicaoVisualMs] = useState(0);

    const atualizarPosicaoVisual = useCallback((posicaoMs: number): void => {
        const posicaoLimitadaMs = Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs)));
        setPosicaoVisualMs(posicaoAtualMs => Math.abs(posicaoAtualMs - posicaoLimitadaMs) < 35 ? posicaoAtualMs : posicaoLimitadaMs);
    }, [duracaoMs]);

    const sincronizarPeloAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;
        sincronizarEstado(audio.paused ? 'PAUSADO' : 'TOCANDO', Math.round(Math.max(0, audio.currentTime) * 1000));
    }, [sincronizarEstado]);

    const alternarStatus = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio || !estado?.faixa) return;

        if (audio.paused) {
            audio.play().then(() => { sincronizarPeloAudio(); }).catch(() => {});
            return;
        }

        audio.pause();
        sincronizarPeloAudio();
    }, [estado?.faixa, sincronizarPeloAudio]);

    const definirPosicao = useCallback((posicaoMs: number): void => {
        const audio = audioRef.current;
        const posicaoLimitadaMs = Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs)));
        setPosicaoVisualMs(posicaoLimitadaMs);
        if (audio) audio.currentTime = posicaoLimitadaMs / 1000;
        sincronizarEstado(audio && !audio.paused ? 'TOCANDO' : 'PAUSADO', posicaoLimitadaMs);
    }, [duracaoMs, sincronizarEstado]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !estado) return;

        const posicaoSegundos = calculaPosicaoSegundos(estado);
        atualizarPosicaoVisual(posicaoSegundos * 1000);
        if (Number.isFinite(posicaoSegundos) && Math.abs(audio.currentTime - posicaoSegundos) > 0.45) audio.currentTime = posicaoSegundos;

        if (estado.status === 'TOCANDO') {
            audio.play().catch(() => {});
            return;
        }

        audio.pause();
    }, [atualizarPosicaoVisual, estado]);

    useEffect(() => {
        let frame: number | null = null;

        const tick = (): void => {
            const audio = audioRef.current;
            if (audio) atualizarPosicaoVisual(audio.currentTime * 1000);
            frame = window.requestAnimationFrame(tick);
        };

        frame = window.requestAnimationFrame(tick);
        return () => { if (frame !== null) window.cancelAnimationFrame(frame); };
    }, [atualizarPosicaoVisual]);

    const registrarDuracao = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const novaDuracaoMs = Math.round(audio.duration * 1000);
        setDuracaoMs(novaDuracaoMs);
        setPosicaoVisualMs(Math.max(0, Math.min(novaDuracaoMs, Math.round(audio.currentTime * 1000))));
    }, []);

    return (
        <main className={styles.pagina}>
            <section className={styles.painel}>
                <header className={styles.cabecalho}>
                    <div>
                        <h1 className={styles.titulo}>Controle do Mixer</h1>
                        <p className={styles.descricao}>Fluxo de execucao da musica ativa.</p>
                    </div>
                    <span className={styles.status}>{estado?.status ?? 'CONECTANDO'}</span>
                </header>
                {erro && <p className={styles.erro}>{erro}</p>}
                {!estado?.faixa && <p className={styles.erro}>Arquivo de musica do teste nao encontrado.</p>}
                {srcAudio && <audio ref={audioRef} src={srcAudio} preload="auto" hidden onLoadedMetadata={registrarDuracao} />}
                <FluxoLinearMixer status={estado?.status ?? 'PAUSADO'} duracaoMs={duracaoMs} posicaoMs={posicaoVisualMs} podeControlar={!!estado?.faixa} aoAlternarStatus={alternarStatus} aoDefinirPosicao={definirPosicao} />
            </section>
        </main>
    );
};