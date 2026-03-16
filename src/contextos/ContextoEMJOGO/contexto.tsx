
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, LogicaJogoUsuario_ObjetoEmJogoDto } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

interface ContextoEMJOGOProps {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto;
};

const ContextoEMJOGO = createContext<ContextoEMJOGOProps | undefined>(undefined);

export const useContextoEMJOGO = (): ContextoEMJOGOProps => {
    const context = useContext(ContextoEMJOGO);
    if (!context) throw new Error('useContextoEMJOGO precisa estar dentro de um ContextoEMJOGO');
    return context;
};

export const ContextoEMJOGOProvider = ({ children }: { children: React.ReactNode }) => {
    const [objetoEmJogo, setObjetoEmJogo] = useState<LogicaJogoUsuario_ObjetoEmJogoDto | null>(null)

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirObjetoEmJogo, {
        onSuccess: data => {
            setObjetoEmJogo(data.objetoEmJogo)
        },
        onError: err => {
            setObjetoEmJogo(null);
            toast.erro('Houve um erro no carregamento da Sala de Jogo');
        },
    });

    if (objetoEmJogo === null) return <h2>Carregando Sala...</h2>;

    return (
        <ContextoEMJOGO.Provider value={{ objetoEmJogo }}>
            {children}
        </ContextoEMJOGO.Provider>
    );
};