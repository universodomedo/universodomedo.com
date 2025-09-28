'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaAovivoProps {
    
};

const ContextoPaginaAovivo = createContext<ContextoPaginaAovivoProps | undefined>(undefined);

export const useContextoPaginaAovivo = (): ContextoPaginaAovivoProps => {
    const context = useContext(ContextoPaginaAovivo);
    if (!context) throw new Error('useContextoPaginaAovivo precisa estar dentro de um ContextoPaginaAovivo');
    return context;
};

export const ContextoPaginaAovivoProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaAovivo.Provider value={{  }}>
            {children}
        </ContextoPaginaAovivo.Provider>
    );
};