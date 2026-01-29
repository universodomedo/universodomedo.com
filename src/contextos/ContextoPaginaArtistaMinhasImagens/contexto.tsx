'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaArtistaMinhasImagensProps {
    
};

const ContextoPaginaArtistaMinhasImagens = createContext<ContextoPaginaArtistaMinhasImagensProps | undefined>(undefined);

export const useContextoPaginaArtistaMinhasImagens = (): ContextoPaginaArtistaMinhasImagensProps => {
    const context = useContext(ContextoPaginaArtistaMinhasImagens);
    if (!context) throw new Error('useContextoPaginaArtistaMinhasImagens precisa estar dentro de um ContextoPaginaArtistaMinhasImagens');
    return context;
};

export const ContextoPaginaArtistaMinhasImagensProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaArtistaMinhasImagens.Provider value={{  }}>
            {children}
        </ContextoPaginaArtistaMinhasImagens.Provider>
    );
};