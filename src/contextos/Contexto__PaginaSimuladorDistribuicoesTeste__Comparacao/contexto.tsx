'use client';

import { createContext, useContext } from 'react';

import SPA__PaginaSimuladorDistribuicoesTeste__Comparacao from 'Conteineres/PaginaSimuladorDistribuicoesTeste/paginas/SPA__PaginaSimuladorDistribuicoesTeste__Comparacao/SPA__PaginaSimuladorDistribuicoesTeste__Comparacao';
import type { Contexto__PaginaSimuladorDistribuicoesTeste__Props } from 'Contextos/Contexto__PaginaSimuladorDistribuicoesTeste/contexto';

const Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao = createContext<Contexto__PaginaSimuladorDistribuicoesTeste__Props | undefined>(undefined);

export const useContexto__PaginaSimuladorDistribuicoesTeste__Comparacao = (): Contexto__PaginaSimuladorDistribuicoesTeste__Props => {
    const context = useContext(Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao);
    if (!context) throw new Error('useContexto__PaginaSimuladorDistribuicoesTeste__Comparacao precisa estar dentro de um Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao');
    return context;
};

export const Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao__Provider = ({ estado }: { estado: Contexto__PaginaSimuladorDistribuicoesTeste__Props; }) => {
    return (
        <Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao.Provider value={estado}>
            <SPA__PaginaSimuladorDistribuicoesTeste__Comparacao />
        </Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao.Provider>
    );
};