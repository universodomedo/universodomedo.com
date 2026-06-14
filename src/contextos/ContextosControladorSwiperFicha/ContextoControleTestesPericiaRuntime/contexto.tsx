'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoSalaDeJogo__Jogador } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';

interface ContextoControleTestesPericiaRuntimeProps {
    executaTestePericia: (idPericia: number) => void;
};

const ContextoControleTestesPericiaRuntime = createContext<ContextoControleTestesPericiaRuntimeProps | undefined>(undefined);

export const useContextoControleTestesPericiaRuntime = (): ContextoControleTestesPericiaRuntimeProps => {
    const context = useContext(ContextoControleTestesPericiaRuntime);
    if (!context) throw new Error('useContextoControleTestesPericiaRuntime precisa estar dentro de um ContextoControleTestesPericiaRuntime');
    return context;
};

export const ContextoControleTestesPericiaRuntimeProvider = ({ children }: { children: React.ReactNode; }) => {
    const { desativarAcoes } = useContextoFichaDePersonagem();
    const { objetoEmJogo } = useContextoSalaDeJogo__Jogador();

    function executaTestePericia(idPericia: number): void {
        if (desativarAcoes) return;
        const objetoInicialSala = objetoEmJogo.objetoInicialSala;
        if (objetoInicialSala.tipoParticipante !== SalaDeJogo_TipoParticipante.JOGADOR) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaTestePericia, { codigoRecuperarFichaRuntime: `${objetoInicialSala.codigoSalaDeJogo}_${objetoInicialSala.idFicha}`, idPericia });
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