'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface Contexto__PaginaMestreAventuras__Props {
    
};

const Contexto__PaginaMestreAventuras = createContext<Contexto__PaginaMestreAventuras__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras = (): Contexto__PaginaMestreAventuras__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras precisa estar dentro de um Contexto__PaginaMestreAventuras');
    return context;
};

export const Contexto__PaginaMestreAventuras__Provider = ({ children }: { children: React.ReactNode }) => {

    return (
        <Contexto__PaginaMestreAventuras.Provider value={{  }}>
            {children}
        </Contexto__PaginaMestreAventuras.Provider>
    );
};