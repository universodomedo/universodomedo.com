'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, type CodigoRecuperarFichaRuntime } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

interface ContextoControleTestesPericiaRuntimeProps {
    executaTestePericia: (idPericia: number) => void;
};

const ContextoControleTestesPericiaRuntime = createContext<ContextoControleTestesPericiaRuntimeProps | undefined>(undefined);

export const useContextoControleTestesPericiaRuntime = (): ContextoControleTestesPericiaRuntimeProps => {
    const context = useContext(ContextoControleTestesPericiaRuntime);
    if (!context) throw new Error('useContextoControleTestesPericiaRuntime precisa estar dentro de um ContextoControleTestesPericiaRuntime');
    return context;
};

export const ContextoControleTestesPericiaRuntimeProvider = ({ children, codigoRecuperarFichaRuntime }: { children: React.ReactNode; codigoRecuperarFichaRuntime?: CodigoRecuperarFichaRuntime; }) => {
    const { desativarAcoes } = useContextoFichaDePersonagem();

    function executaTestePericia(idPericia: number): void {
        if (desativarAcoes) return;
        if (!codigoRecuperarFichaRuntime) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaTestePericia, { codigoRecuperarFichaRuntime, idPericia });
    };

    return (
        <ContextoControleTestesPericiaRuntime.Provider value={{ executaTestePericia }}>
            {children}
        </ContextoControleTestesPericiaRuntime.Provider>
    );
};

export const ContextoControleTestesPericiaRuntimeSomenteLeituraProvider = ({ children }: { children: React.ReactNode; }) => {
    function executaTestePericia(idPericia: number): void { void idPericia; return; };

    return (
        <ContextoControleTestesPericiaRuntime.Provider value={{ executaTestePericia }}>
            {children}
        </ContextoControleTestesPericiaRuntime.Provider>
    );
};