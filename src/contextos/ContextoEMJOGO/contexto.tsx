
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, ObjetoEmJogoDto, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

interface ContextoEMJOGOProps {
    objetoEmJogo: ObjetoEmJogoDto;
};

const ContextoEMJOGO = createContext<ContextoEMJOGOProps | undefined>(undefined);

export const useContextoEMJOGO = (): ContextoEMJOGOProps => {
    const context = useContext(ContextoEMJOGO);
    if (!context) throw new Error('useContextoEMJOGO precisa estar dentro de um ContextoEMJOGO');
    return context;
};

export const ContextoEMJOGOProvider = ({ children }: { children: React.ReactNode }) => {
    const [objetoEmJogo, setObjetoEmJogo] = useState<ObjetoEmJogoDto | null>(null)

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirObjetoEmJogo, {
        onSuccess: data => {
            setObjetoEmJogo(data.objetoEmJogo)
        },
        onError: err => {
            setObjetoEmJogo(null);
        }
    });

    useEffect(() => {
        if (objetoEmJogo && objetoEmJogo.tipoParticipante === SalaDeJogo_TipoParticipante.SALA__JOGADOR && !objetoEmJogo.ficha) toast.erro('Você, jogador dessa sessão, não tem Ficha configurada');
    }, [objetoEmJogo]);

    if (!objetoEmJogo) return <h2>Você não está participando de Sessões agora</h2>;

    return (
        <ContextoEMJOGO.Provider value={{ objetoEmJogo }}>
            {children}
        </ContextoEMJOGO.Provider>
    );
};