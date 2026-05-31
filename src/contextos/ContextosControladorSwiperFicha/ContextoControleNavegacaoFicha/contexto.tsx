'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ContextoControleNavegacaoFichaProps {
    paginaAbertaFicha: number;
    selecionaPaginaFicha: (indicePagina: number) => void;
    garantePaginaFichaValida: (quantidadePaginas: number) => void;
};

const ContextoControleNavegacaoFicha = createContext<ContextoControleNavegacaoFichaProps | undefined>(undefined);

export const useContextoControleNavegacaoFicha = (): ContextoControleNavegacaoFichaProps => {
    const context = useContext(ContextoControleNavegacaoFicha);
    if (!context) throw new Error('useContextoControleNavegacaoFicha precisa estar dentro de um ContextoControleNavegacaoFicha');
    return context;
};

export function ContextoControleNavegacaoFichaProvider({ children }: { children: React.ReactNode }) {
    const [paginaAbertaFicha, setPaginaAbertaFicha] = useState(0);

    const selecionaPaginaFicha = useCallback((indicePagina: number) => {
        setPaginaAbertaFicha(Math.max(0, indicePagina));
    }, []);

    const garantePaginaFichaValida = useCallback((quantidadePaginas: number) => {
        setPaginaAbertaFicha(paginaAtual => paginaAtual < quantidadePaginas ? paginaAtual : 0);
    }, []);

    return (
        <ContextoControleNavegacaoFicha.Provider value={{ paginaAbertaFicha, selecionaPaginaFicha, garantePaginaFichaValida }}>
            {children}
        </ContextoControleNavegacaoFicha.Provider>
    );
};
