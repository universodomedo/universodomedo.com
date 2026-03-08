'use client';

import { createContext, useContext } from 'react';
import { FichaEmJogo } from 'types-nora-api';

import ControladorSwiperFicha from 'Componentes/ElementosDeJogo/ControladorSwiperFicha/CotroladorSwiperFicha';

interface ContextoFichaPersonagemProps {
    ficha: FichaEmJogo;
};

const ContextoFichaPersonagem = createContext<ContextoFichaPersonagemProps | undefined>(undefined);

export const useContextoFichaPersonagem = (): ContextoFichaPersonagemProps => {
    const context = useContext(ContextoFichaPersonagem);
    if (!context) throw new Error('useContextoFichaPersonagem precisa estar dentro de um ContextoFichaPersonagem');
    return context;
};

export function RecipienteFichaPersonagem({ ficha }: { ficha: FichaEmJogo; }) { return <ContextoFichaPersonagemProvider ficha={ficha} />; };

const ContextoFichaPersonagemProvider = ({ ficha }: { ficha: FichaEmJogo; }) => {
    return (
        <ContextoFichaPersonagem.Provider value={{ ficha }}>
            <ControladorSwiperFicha />
        </ContextoFichaPersonagem.Provider>
    );
};