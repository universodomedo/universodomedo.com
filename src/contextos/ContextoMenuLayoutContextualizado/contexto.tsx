'use client';

import { ReactNode, createContext, useContext } from 'react';

import { Menu } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenuLayoutContextualizado.tsx/MenuLayoutContextualizado';

const ContextoMenuLayoutContextualizado = createContext({});

export function ContextoMenuLayoutContextualizadoProvider({ children }: { children: ReactNode }) {
    return (
        <>
            <Menu />
            {children}
        </>
    );
};

export function useContextoMenuLayoutContextualizado() {
    return useContext(ContextoMenuLayoutContextualizado);
};