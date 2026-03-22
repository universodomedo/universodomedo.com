'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaInicialJogoProps {
    
};

const ContextoPaginaInicialJogo = createContext<ContextoPaginaInicialJogoProps | undefined>(undefined);

export const useContextoPaginaInicialJogo = (): ContextoPaginaInicialJogoProps => {
    const context = useContext(ContextoPaginaInicialJogo);
    if (!context) throw new Error('useContextoPaginaInicialJogo precisa estar dentro de um ContextoPaginaInicialJogo');
    return context;
};

export const ContextoPaginaInicialJogoProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaInicialJogo.Provider value={{  }}>
            {children}
        </ContextoPaginaInicialJogo.Provider>
    );
};