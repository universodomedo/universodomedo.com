'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { obtemAvataresDeComparacao, obtemListagemDePersonagensComAvatares } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

interface ContextoGerenciarEmblemas__Props {

};

const ContextoGerenciarEmblemas = createContext<ContextoGerenciarEmblemas__Props | undefined>(undefined);

export const useContextoGerenciarEmblemas = (): ContextoGerenciarEmblemas__Props => {
    const context = useContext(ContextoGerenciarEmblemas);
    if (!context) throw new Error('useContextoGerenciarEmblemas precisa estar dentro de um ContextoGerenciarEmblemas');
    return context;
};

export const ContextoGerenciarEmblemas__Provider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoGerenciarEmblemas.Provider value={{ }}>
            {children}
        </ContextoGerenciarEmblemas.Provider>
    );
};