'use client';

import { useCallback, useEffect, useRef } from 'react';

import { type Contexto__PaginaTesteMixer__Props } from 'Contextos/Contexto__PaginaTesteMixer/contexto';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';

function calculaPosicaoAtualSegundos(estado: NonNullable<Contexto__PaginaTesteMixer__Props['estado']>): number {
    if (estado.status === 'PAUSADO' || estado.iniciadoEmMs === null) return estado.posicaoMs / 1000;
    return (estado.posicaoMs + Math.max(0, Date.now() - estado.iniciadoEmMs)) / 1000;
};

export default function SPA__PaginaTesteMixer__ReceptorAudio({ estado }: Contexto__PaginaTesteMixer__Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const srcAudio = estado?.faixa ? getImageUrl(estado.faixa.caminhoArquivo) : undefined;

    const sincronizarAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio || !estado || !srcAudio) return;

        const posicaoSegundos = calculaPosicaoAtualSegundos(estado);
        if (Number.isFinite(posicaoSegundos) && Math.abs(audio.currentTime - posicaoSegundos) > 0.45) audio.currentTime = posicaoSegundos;

        if (estado.status === 'TOCANDO') {
            audio.play().catch(() => {});
            return;
        }

        audio.pause();
    }, [estado, srcAudio]);

    useEffect(() => { sincronizarAudio(); }, [sincronizarAudio]);

    useEffect(() => {
        window.addEventListener('pointerdown', sincronizarAudio);
        window.addEventListener('keydown', sincronizarAudio);
        return () => {
            window.removeEventListener('pointerdown', sincronizarAudio);
            window.removeEventListener('keydown', sincronizarAudio);
        };
    }, [sincronizarAudio]);

    if (!srcAudio) return null;

    return <audio ref={audioRef} src={srcAudio} preload="auto" hidden />;
};