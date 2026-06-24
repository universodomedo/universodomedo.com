'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type AbaEdicao = 'MONTAGEM' | 'CLIMA';

interface Contexto__PaginaConfigurarMusica__Edicao__Abas__Props {
    abaAtual: AbaEdicao;
    navegarPara: (aba: AbaEdicao) => void;
};

const Contexto__PaginaConfigurarMusica__Edicao__Abas = createContext<Contexto__PaginaConfigurarMusica__Edicao__Abas__Props | undefined>(undefined);

export const useContexto__PaginaConfigurarMusica__Edicao__Abas = (): Contexto__PaginaConfigurarMusica__Edicao__Abas__Props => {
    const context = useContext(Contexto__PaginaConfigurarMusica__Edicao__Abas);
    if (!context) throw new Error('useContexto__PaginaConfigurarMusica__Edicao__Abas precisa estar dentro de um Contexto__PaginaConfigurarMusica__Edicao__Abas__Provider');
    return context;
};

export const Contexto__PaginaConfigurarMusica__Edicao__Abas__Provider = ({ children }: { children: ReactNode; }) => {
    const [abaAtual, setAbaAtual] = useState<AbaEdicao>('MONTAGEM');
    const navegarPara = useCallback((aba: AbaEdicao) => setAbaAtual(aba), []);

    return (
        <Contexto__PaginaConfigurarMusica__Edicao__Abas.Provider value={{ abaAtual, navegarPara }}>
            {children}
        </Contexto__PaginaConfigurarMusica__Edicao__Abas.Provider>
    );
};
