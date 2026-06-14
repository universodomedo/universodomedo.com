'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, type CodigoRecuperarFichaRuntime } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

interface ContextoControleAcoesRuntimeProps {
    executaAcao: (keyAcao: string) => void;
};

const ContextoControleAcoesRuntime = createContext<ContextoControleAcoesRuntimeProps | undefined>(undefined);

export const useContextoControleAcoesRuntime = (): ContextoControleAcoesRuntimeProps => {
    const context = useContext(ContextoControleAcoesRuntime);
    if (!context) throw new Error('useContextoControleAcoesRuntime precisa estar dentro de um ContextoControleAcoesRuntime');
    return context;
};

export const ContextoControleAcoesRuntimeProvider = ({ children, codigoRecuperarFichaRuntime }: { children: React.ReactNode; codigoRecuperarFichaRuntime?: CodigoRecuperarFichaRuntime; }) => {
    const { desativarAcoes } = useContextoFichaDePersonagem();

    function executaAcao(keyAcao: string): void {
        if (desativarAcoes) return;
        if (!codigoRecuperarFichaRuntime) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaAcao, { codigoRecuperarFichaRuntime, keyAcao });
    };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};

export const ContextoControleAcoesRuntimeSomenteLeituraProvider = ({ children }: { children: React.ReactNode; }) => {
    function executaAcao(keyAcao: string): void { void keyAcao; return; };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};