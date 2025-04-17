'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemDto } from 'types-nora-api';
import { obtemFichaPersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoFichaPersonagemProps {
    personagem: PersonagemDto | null;
};

const ContextoFichaPersonagem = createContext<ContextoFichaPersonagemProps | undefined>(undefined);

export const useContextoFichaPersonagem = (): ContextoFichaPersonagemProps => {
    const context = useContext(ContextoFichaPersonagem);
    if (!context) throw new Error('useContextoFichaPersonagem precisa estar dentro de um ContextoFichaPersonagem');
    return context;
};

export const ContextoFichaPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [personagem, setPersonagem] = useState<PersonagemDto | null>();

    const obtemPersonagem = async () => {
        const retorno = await obtemFichaPersonagem(80);
        setPersonagem(retorno);
    }

    useEffect(() => {
        obtemPersonagem();
    }, []);

    if (!personagem) return (<h1>carregando personagem...</h1>)

    return (
        <ContextoFichaPersonagem.Provider value={{ personagem }}>
            {children}
        </ContextoFichaPersonagem.Provider>
    );
};