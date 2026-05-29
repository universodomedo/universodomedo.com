'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

type FluxoPaginaPalco = 'ADMIN' | 'PARTICIPANTE';

interface Contexto__PaginaPalco__Props {
    fluxo: FluxoPaginaPalco;
};

const Contexto__PaginaPalco = createContext<Contexto__PaginaPalco__Props | undefined>(undefined);

export const useContexto__PaginaPalco = (): Contexto__PaginaPalco__Props => {
    const context = useContext(Contexto__PaginaPalco);
    if (!context) throw new Error('useContexto__PaginaPalco precisa estar dentro de um Contexto__PaginaPalco__Provider');
    return context;
};

function resolveFluxoPaginaPalco(idUsuarioLogado: number | undefined): FluxoPaginaPalco { return idUsuarioLogado === 1 ? 'ADMIN' : 'PARTICIPANTE'; };

export const Contexto__PaginaPalco__Provider = ({ children }: { children: ReactNode; }) => {
    const { usuarioLogado } = useContextoAutenticacao();

    return (
        <Contexto__PaginaPalco.Provider value={{ fluxo: resolveFluxoPaginaPalco(usuarioLogado?.id) }}>
            {children}
        </Contexto__PaginaPalco.Provider>
    );
};