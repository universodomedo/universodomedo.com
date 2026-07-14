'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual, selectPalcoNaCentral } from 'Redux/selectors/audioPaginaSelectors';

const DURACAO_ABERTURA_AUTOMATICA_MS = 4000;

interface ContextoCentralAudioProps {
    painelAberto: boolean;
    abrirPainel: () => void;
    fecharPainel: () => void;
    togglePainel: () => void;
    cancelarFechamentoAutomatico: () => void;
};

const ContextoCentralAudio = createContext<ContextoCentralAudioProps | undefined>(undefined);

export const useContextoCentralAudio = (): ContextoCentralAudioProps => {
    const context = useContext(ContextoCentralAudio);
    if (!context) throw new Error('useContextoCentralAudio precisa estar dentro de um ContextoCentralAudio__Provider');
    return context;
};

export const ContextoCentralAudio__Provider = ({ children }: { children: React.ReactNode }) => {
    const [painelAberto, setPainelAberto] = useState<boolean>(false);
    const timerRef = useRef<number | null>(null);

    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const anteriorRef = useRef<number | null>(null);

    const limparTimer = useCallback(() => { if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null; } }, []);

    const abrirPainel = useCallback(() => { limparTimer(); setPainelAberto(true); }, [limparTimer]);
    const fecharPainel = useCallback(() => { limparTimer(); setPainelAberto(false); }, [limparTimer]);
    const togglePainel = useCallback(() => { limparTimer(); setPainelAberto(valor => !valor); }, [limparTimer]);
    const cancelarFechamentoAutomatico = useCallback(() => { limparTimer(); }, [limparTimer]);

    const abrirTemporario = useCallback(() => {
        limparTimer();
        setPainelAberto(true);
        timerRef.current = window.setTimeout(() => { timerRef.current = null; setPainelAberto(false); }, DURACAO_ABERTURA_AUTOMATICA_MS);
    }, [limparTimer]);

    // Abre sozinha por 4s sempre que uma música começa (idMusica vira um novo não-nulo: 1ª carga, refresh ou troca); o mouse na Central cancela o fechamento.
    useEffect(() => {
        const anterior = anteriorRef.current;
        anteriorRef.current = idMusica;
        if (idMusica != null && idMusica !== anterior) abrirTemporario();
    }, [idMusica, abrirTemporario]);

    // Palco entrou na Central: abre PERSISTENTE (o usuário precisa ver a faixa ao vivo e o volume travado — o mudo pode estar invisível).
    const palcoNaCentral = useAppSelector(selectPalcoNaCentral);
    const codigoPalcoAnteriorRef = useRef<string | null>(null);
    useEffect(() => {
        const anterior = codigoPalcoAnteriorRef.current;
        codigoPalcoAnteriorRef.current = palcoNaCentral?.codigoPalco ?? null;
        if (palcoNaCentral && palcoNaCentral.codigoPalco !== anterior) abrirPainel();
    }, [palcoNaCentral, abrirPainel]);

    useEffect(() => () => limparTimer(), [limparTimer]);

    return (
        <ContextoCentralAudio.Provider value={{ painelAberto, abrirPainel, fecharPainel, togglePainel, cancelarFechamentoAutomatico }}>
            {children}
        </ContextoCentralAudio.Provider>
    );
};
