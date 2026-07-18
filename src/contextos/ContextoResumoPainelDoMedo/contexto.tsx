'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { RESPONSE__ResumoPainelDoMedoUsuario } from 'types-nora-api';

import { resumoPainelDoMedo as apiResumoPainelDoMedo } from 'Uteis/ApiConsumer/PainelDoMedoMiddleware';

// Painel de resumo do Painel do Medo aberto pela BarraAcoesFlutuante: cartoes que o usuario participa, atividade recente e marcacoes recebidas.
interface ContextoResumoPainelDoMedoProps {
    painelAberto: boolean;
    togglePainel: () => void;
    fecharPainel: () => void;
    resumo: RESPONSE__ResumoPainelDoMedoUsuario | null;
    carregando: boolean;
};

const ContextoResumoPainelDoMedo = createContext<ContextoResumoPainelDoMedoProps | undefined>(undefined);

export const useContextoResumoPainelDoMedo = (): ContextoResumoPainelDoMedoProps => {
    const context = useContext(ContextoResumoPainelDoMedo);
    if (!context) throw new Error('useContextoResumoPainelDoMedo precisa estar dentro de ContextoResumoPainelDoMedo__Provider');
    return context;
};

export const ContextoResumoPainelDoMedo__Provider = ({ children }: { children: React.ReactNode }) => {
    const [painelAberto, setPainelAberto] = useState<boolean>(false);
    const [resumo, setResumo] = useState<RESPONSE__ResumoPainelDoMedoUsuario | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);

    const togglePainel = useCallback(() => setPainelAberto(v => !v), []);
    const fecharPainel = useCallback(() => setPainelAberto(false), []);

    // Recarrega a cada abertura: o resumo e um retrato do momento (nao ha assinatura WS aqui); o resumo anterior fica visivel enquanto o novo chega.
    useEffect(() => {
        if (!painelAberto) return;
        let ativo = true;
        setCarregando(true);
        apiResumoPainelDoMedo().then(resposta => { if (ativo && resposta) setResumo(resposta); }).finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, [painelAberto]);

    return (
        <ContextoResumoPainelDoMedo.Provider value={{ painelAberto, togglePainel, fecharPainel, resumo, carregando }}>
            {children}
        </ContextoResumoPainelDoMedo.Provider>
    );
};
