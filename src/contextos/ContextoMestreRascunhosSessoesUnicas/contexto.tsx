'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoMestreRascunhosSessoesUnicasProps {
    
};

const ContextoMestreRascunhosSessoesUnicas = createContext<ContextoMestreRascunhosSessoesUnicasProps | undefined>(undefined);

export const useContextoMestreRascunhosSessoesUnicas = (): ContextoMestreRascunhosSessoesUnicasProps => {
    const context = useContext(ContextoMestreRascunhosSessoesUnicas);
    if (!context) throw new Error('useContextoMestreRascunhosSessoesUnicas precisa estar dentro de um ContextoMestreRascunhosSessoesUnicas');
    return context;
};

export const ContextoMestreRascunhosSessoesUnicasProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ContextoMestreRascunhosSessoesUnicas.Provider value={{  }}>
            {children}
        </ContextoMestreRascunhosSessoesUnicas.Provider>
    );
};