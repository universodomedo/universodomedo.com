'use client';

import { createContext, useContext } from 'react';
import { FichaEmClient, J_DadosFichaEmJogo } from 'types-nora-api';

import { useFichaDeJogo } from 'Hooks/useFichaDeJogo';

interface ContextoFichaDePersonagemProps {
    ficha: FichaEmClient;
    desativarAcoes: boolean;
};

const ContextoFichaDePersonagem = createContext<ContextoFichaDePersonagemProps | undefined>(undefined);

export const useContextoFichaDePersonagem = (): ContextoFichaDePersonagemProps => {
    const context = useContext(ContextoFichaDePersonagem);
    if (!context) throw new Error('useContextoFichaDePersonagem precisa estar dentro de um ContextoFichaDePersonagem');
    return context;
};

export const ContextoFichaDePersonagemProvider = ({ children, JDadosFichaEmJogo, desativarAcoes }: { children:React.ReactNode; JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; }) => {
    const { ficha, carregando, erro } = useFichaDeJogo(JDadosFichaEmJogo);

    if (carregando) return <h2>Carregando ficha...</h2>;
    if (erro || !ficha) return <h2>{erro ?? 'Erro ao montar ficha'}</h2>;

    return (
        <ContextoFichaDePersonagem.Provider value={{ ficha, desativarAcoes }}>
            {children}
        </ContextoFichaDePersonagem.Provider>
    );
};