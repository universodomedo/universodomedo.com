'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoPaginaSUDODeletarArquivosAbsolutoProps {
    
};

const ContextoPaginaSUDODeletarArquivosAbsoluto = createContext<ContextoPaginaSUDODeletarArquivosAbsolutoProps | undefined>(undefined);

export const useContextoPaginaSUDODeletarArquivosAbsoluto = (): ContextoPaginaSUDODeletarArquivosAbsolutoProps => {
    const context = useContext(ContextoPaginaSUDODeletarArquivosAbsoluto);
    if (!context) throw new Error('useContextoPaginaSUDODeletarArquivosAbsoluto precisa estar dentro de um ContextoPaginaSUDODeletarArquivosAbsoluto');
    return context;
};

export const ContextoPaginaSUDODeletarArquivosAbsolutoProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoPaginaSUDODeletarArquivosAbsoluto.Provider value={{  }}>
            {children}
        </ContextoPaginaSUDODeletarArquivosAbsoluto.Provider>
    );
};