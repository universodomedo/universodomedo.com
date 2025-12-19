'use client';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { createContext, useContext, useEffect, useState } from 'react';
import { FichaDeJogo } from 'types-nora-api';
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
    const [erro, setErro] = useState<string | null>(null);
    const [ficha, setFicha] = useState<FichaDeJogo>();

    // useEmitWsComDisparoInicial(
    //     Eventos_Emite.Jogo.eventos.emitirDadosParaParticipanteDeSala,
    //     {
    //         onSuccess: data => {
    //             console.log('onSuccess');
    //             setErro(null);
    //             setFicha(data.dados.fichaDeJogo);
    //         },
    //         onError: err => {
    //             console.log('onError');
    //             setErro(err.mensagem);
    //             setFicha(undefined);
    //         }
    //     }
    // );

    if (erro) return (<h1>Erro ao carregar ficha: {erro}</h1>);

    if (!ficha) return (<h1>carregando ficha...</h1>)

    return (
        <ContextoFichaPersonagem.Provider value={{ ficha }}>
            {children}
        </ContextoFichaPersonagem.Provider>
    );
};