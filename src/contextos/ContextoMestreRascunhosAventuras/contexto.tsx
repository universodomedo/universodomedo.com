'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoMestreRascunhosAventurasProps {
    
};

const ContextoMestreRascunhosAventuras = createContext<ContextoMestreRascunhosAventurasProps | undefined>(undefined);

export const useContextoMestreRascunhosAventuras = (): ContextoMestreRascunhosAventurasProps => {
    const context = useContext(ContextoMestreRascunhosAventuras);
    if (!context) throw new Error('useContextoMestreRascunhosAventuras precisa estar dentro de um ContextoMestreRascunhosAventuras');
    return context;
};

export const ContextoMestreRascunhosAventurasProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoMestreRascunhosAventuras.Provider value={{  }}>
            {children}
        </ContextoMestreRascunhosAventuras.Provider>
    );
};