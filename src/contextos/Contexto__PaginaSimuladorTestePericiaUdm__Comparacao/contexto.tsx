'use client';

import { createContext, useContext } from 'react';

import SPA__PaginaSimuladorTestePericiaUdm__Comparacao from 'Conteineres/PaginaSimuladorTestePericiaUdm/paginas/SPA__PaginaSimuladorTestePericiaUdm__Comparacao/SPA__PaginaSimuladorTestePericiaUdm__Comparacao';
import type { Contexto__PaginaSimuladorTestePericiaUdm__Props } from 'Contextos/Contexto__PaginaSimuladorTestePericiaUdm/contexto';

const Contexto__PaginaSimuladorTestePericiaUdm__Comparacao = createContext<Contexto__PaginaSimuladorTestePericiaUdm__Props | undefined>(undefined);

export const useContexto__PaginaSimuladorTestePericiaUdm__Comparacao = (): Contexto__PaginaSimuladorTestePericiaUdm__Props => {
    const context = useContext(Contexto__PaginaSimuladorTestePericiaUdm__Comparacao);
    if (!context) throw new Error('useContexto__PaginaSimuladorTestePericiaUdm__Comparacao precisa estar dentro de um Contexto__PaginaSimuladorTestePericiaUdm__Comparacao');
    return context;
};

export const Contexto__PaginaSimuladorTestePericiaUdm__Comparacao__Provider = ({ estado }: { estado: Contexto__PaginaSimuladorTestePericiaUdm__Props; }) => {
    return (
        <Contexto__PaginaSimuladorTestePericiaUdm__Comparacao.Provider value={estado}>
            <SPA__PaginaSimuladorTestePericiaUdm__Comparacao />
        </Contexto__PaginaSimuladorTestePericiaUdm__Comparacao.Provider>
    );
};