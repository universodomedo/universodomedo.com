'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type FluxoPaginaPalco = 'SEM_CODIGO' | 'PALCO';

interface Contexto__PaginaPalco__Props {
    fluxo: FluxoPaginaPalco;
    codigoPalco: string | null;
};

const Contexto__PaginaPalco = createContext<Contexto__PaginaPalco__Props | undefined>(undefined);

export const useContexto__PaginaPalco = (): Contexto__PaginaPalco__Props => {
    const context = useContext(Contexto__PaginaPalco);
    if (!context) throw new Error('useContexto__PaginaPalco precisa estar dentro de um Contexto__PaginaPalco__Provider');
    return context;
};

// A página de palco resolve pelo código na query (?codigoPalco=...): cada palco vivo tem a sua URL.
export const Contexto__PaginaPalco__Provider = ({ children }: { children: ReactNode; }) => {
    const searchParams = useSearchParams();
    const codigoPalco = searchParams.get('codigoPalco');

    return (
        <Contexto__PaginaPalco.Provider value={{ fluxo: codigoPalco ? 'PALCO' : 'SEM_CODIGO', codigoPalco }}>
            {children}
        </Contexto__PaginaPalco.Provider>
    );
};