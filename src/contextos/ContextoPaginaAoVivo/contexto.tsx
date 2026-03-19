'use client';

import { createContext, useContext, useState } from 'react';
import { Eventos_Emite, SalaDeJogo_SessaoDto } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

interface ContextoPaginaAoVivo__Props {
    sessaoEmAndamento: SalaDeJogo_SessaoDto | null;
};

const ContextoPaginaAoVivo = createContext<ContextoPaginaAoVivo__Props | undefined>(undefined);

export const useContextoPaginaAoVivo = (): ContextoPaginaAoVivo__Props => {
    const context = useContext(ContextoPaginaAoVivo);
    if (!context) throw new Error('useContextoPaginaAoVivo precisa estar dentro de um ContextoPaginaAoVivo');
    return context;
};

export const ContextoPaginaAoVivo__Provider = ({ children }: { children: React.ReactNode }) => {
    const [sessaoEmAndamento, setSessaoEmAndamento] = useState<SalaDeJogo_SessaoDto | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirSessaoEmAndamento, {
        onSuccess: data => {
            setSessaoEmAndamento(data.sessaoEmAndamento);
        },
        onError: () => {
            setSessaoEmAndamento(null);
        },
    });

    return (
        <ContextoPaginaAoVivo.Provider value={{ sessaoEmAndamento }}>
            {children}
        </ContextoPaginaAoVivo.Provider>
    );
};