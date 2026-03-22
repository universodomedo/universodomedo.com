'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaJogador__PaginaInicial from 'Conteineres/PaginaJogador/paginas/SPA__PaginaJogador__PaginaInicial/SPA__PaginaJogador__PaginaInicial';

interface ContextoPaginaJogador__PaginaInicialProps {

};

const ContextoPaginaJogador__PaginaInicial = createContext<ContextoPaginaJogador__PaginaInicialProps | undefined>(undefined);

export const useContextoPaginaJogador__PaginaInicial = (): ContextoPaginaJogador__PaginaInicialProps => {
    const context = useContext(ContextoPaginaJogador__PaginaInicial);
    if (!context) throw new Error('useContextoPaginaJogador__PaginaInicial precisa estar dentro de um ContextoPaginaJogador__PaginaInicial');
    return context;
};

export const ContextoPaginaJogador__PaginaInicialProvider = () => {
    useConfigurarLayoutContextualizado({ titulo: `Página de Jogador`, fecharProps: undefined }, 'patch');

    return (
        <ContextoPaginaJogador__PaginaInicial.Provider value={{ }}>
            <SPA__PaginaJogador__PaginaInicial />
        </ContextoPaginaJogador__PaginaInicial.Provider>
    );
};