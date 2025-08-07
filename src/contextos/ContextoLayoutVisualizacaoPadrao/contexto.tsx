'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ContextoLayoutVisualizacaoPadraoProps {
    conteudoGeral: ReactNode;
    setConteudoGeral: (content: ReactNode) => void;
    conteudoMenu: ReactNode;
    setConteudoMenu: (content: ReactNode) => void;
};

const ContextoLayoutVisualizacaoPadrao = createContext<ContextoLayoutVisualizacaoPadraoProps | undefined>(undefined);

export const useContextoLayoutVisualizacaoPadrao = (): ContextoLayoutVisualizacaoPadraoProps => {
    const context = useContext(ContextoLayoutVisualizacaoPadrao);
    if (!context) throw new Error('useContextoLayoutVisualizacaoPadrao precisa estar dentro de um ContextoLayoutVisualizacaoPadrao');
    return context;
};

export const ContextoLayoutVisualizacaoPadraoProvider = ({ children }: { children: React.ReactNode }) => {
    const [conteudoGeral, setConteudoGeral] = useState<ReactNode>(null);
    const [conteudoMenu, setConteudoMenu] = useState<ReactNode>(null);

    return (
        <ContextoLayoutVisualizacaoPadrao.Provider value={{ conteudoGeral, setConteudoGeral, conteudoMenu, setConteudoMenu}}>
            {children}
        </ContextoLayoutVisualizacaoPadrao.Provider>
    );
};