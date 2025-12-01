'use client';

import { createContext, useContext, useState } from 'react';
import { Eventos_Emite, SessaoDto } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

interface ContextoSessaoEmAndamentoProps {
    sessaoEmAndamento: SessaoDto | null;
};

const ContextoSessaoEmAndamento = createContext<ContextoSessaoEmAndamentoProps | undefined>(undefined);

export const useContextoSessaoEmAndamento = (): ContextoSessaoEmAndamentoProps => {
    const context = useContext(ContextoSessaoEmAndamento);
    if (!context) throw new Error('useContextoSessaoEmAndamento precisa estar dentro de um ContextoSessaoEmAndamento');
    return context;
};

export const ContextoSessaoEmAndamentoProvider = ({ children }: { children: React.ReactNode }) => {
    const [ sessaoEmAndamento, setSessaoEmAndamento ] = useState<SessaoDto | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirSessaoEmAndamento, data => {
        setSessaoEmAndamento(data.sessaoEmAndamento);
    });

    return (
        <ContextoSessaoEmAndamento.Provider value={{ sessaoEmAndamento }}>
            {children}
        </ContextoSessaoEmAndamento.Provider>
    );
};