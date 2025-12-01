'use client';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { createContext, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, FichaDeJogo } from 'types-nora-api';
import { obtemFichaDePersonagemEmNivel } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoFichaPersonagemProps {
    ficha: FichaDeJogo;
};

const ContextoFichaPersonagem = createContext<ContextoFichaPersonagemProps | undefined>(undefined);

export const useContextoFichaPersonagem = (): ContextoFichaPersonagemProps => {
    const context = useContext(ContextoFichaPersonagem);
    if (!context) throw new Error('useContextoFichaPersonagem precisa estar dentro de um ContextoFichaPersonagem');
    return context;
};

export const ContextoFichaPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [ficha, setFicha] = useState<FichaDeJogo>();

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirDadosParaParticipanteDeSala, data => {
        setFicha(data.dados.fichaDeJogo);
    });

    // const obtemPersonagem = async () => {
    //     const retorno = await obtemFichaDePersonagemEmNivel();
    //     setFicha(retorno);
    // }

    // useEffect(() => {
    //     obtemPersonagem();
    // }, []);

    if (!ficha) return (<h1>carregando ficha...</h1>)

    return (
        <ContextoFichaPersonagem.Provider value={{ ficha }}>
            {children}
        </ContextoFichaPersonagem.Provider>
    );
};