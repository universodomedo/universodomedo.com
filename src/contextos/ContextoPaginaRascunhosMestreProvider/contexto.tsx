'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaRascunhosMestreProps {
    
};

const ContextoPaginaRascunhosMestre = createContext<ContextoPaginaRascunhosMestreProps | undefined>(undefined);

export const useContextoPaginaRascunhosMestre = (): ContextoPaginaRascunhosMestreProps => {
    const context = useContext(ContextoPaginaRascunhosMestre);
    if (!context) throw new Error('useContextoPaginaRascunhosMestre precisa estar dentro de um ContextoPaginaRascunhosMestre');
    return context;
};

export const ContextoPaginaRascunhosMestreProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaRascunhosMestre.Provider value={{  }}>
            {children}
        </ContextoPaginaRascunhosMestre.Provider>
    );
};