'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type Contexto__PaginaColaboradorPainelDoMedo__Props = Record<string, never>;

const Contexto__PaginaColaboradorPainelDoMedo = createContext<Contexto__PaginaColaboradorPainelDoMedo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo = (): Contexto__PaginaColaboradorPainelDoMedo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo');
    return context;
};

export const Contexto__PaginaColaboradorPainelDoMedo__Provider = ({ children }: { children: ReactNode }) => {
    return (
        <Contexto__PaginaColaboradorPainelDoMedo.Provider value={{}}>
            {children}
        </Contexto__PaginaColaboradorPainelDoMedo.Provider>
    );
};
