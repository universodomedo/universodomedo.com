'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoSalaDeJogo__Jogador } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';

interface ContextoControleAcoesRuntimeProps {
    executaAcao: (keyAcao: string) => void;
};

const ContextoControleAcoesRuntime = createContext<ContextoControleAcoesRuntimeProps | undefined>(undefined);

export const useContextoControleAcoesRuntime = (): ContextoControleAcoesRuntimeProps => {
    const context = useContext(ContextoControleAcoesRuntime);
    if (!context) throw new Error('useContextoControleAcoesRuntime precisa estar dentro de um ContextoControleAcoesRuntime');
    return context;
};

export const ContextoControleAcoesRuntimeProvider = ({ children }: { children: React.ReactNode; }) => {
    const { desativarAcoes } = useContextoFichaDePersonagem();
    const { objetoEmJogo } = useContextoSalaDeJogo__Jogador();

    function executaAcao(keyAcao: string): void {
        if (desativarAcoes) return;
        const objetoInicialSala = objetoEmJogo.objetoInicialSala;
        if (objetoInicialSala.tipoParticipante !== SalaDeJogo_TipoParticipante.JOGADOR) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaAcao, { codigoRecuperarFichaRuntime: `${objetoInicialSala.codigoSalaDeJogo}_${objetoInicialSala.idFicha}`, keyAcao });
    };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};