'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaUplodImagemArtistaProps {
    
};

const ContextoPaginaUplodImagemArtista = createContext<ContextoPaginaUplodImagemArtistaProps | undefined>(undefined);

export const useContextoPaginaUplodImagemArtista = (): ContextoPaginaUplodImagemArtistaProps => {
    const context = useContext(ContextoPaginaUplodImagemArtista);
    if (!context) throw new Error('useContextoPaginaUplodImagemArtista precisa estar dentro de um ContextoPaginaUplodImagemArtista');
    return context;
};

export const ContextoPaginaUplodImagemArtistaProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaUplodImagemArtista.Provider value={{  }}>
            {children}
        </ContextoPaginaUplodImagemArtista.Provider>
    );
};