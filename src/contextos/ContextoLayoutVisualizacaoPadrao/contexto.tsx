'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ContextoLayoutVisualizacaoPadraoProps {
    conteudoGeral: ReactNode;
    setConteudoGeral: (children: ReactNode) => void;
    conteudoMenu: ReactNode;
    setConteudoMenu: (children: ReactNode) => void;
    setProporcaoGeral: (proporcaoGeral: number) => void;
    hrefPaginaParaVoltar: string | null;
    setHrefPaginaParaVoltar: (hrefPaginaParaVoltar: string | null) => void;
};

const ContextoLayoutVisualizacaoPadrao = createContext<ContextoLayoutVisualizacaoPadraoProps | undefined>(undefined);

export const useContextoLayoutVisualizacaoPadrao = (): ContextoLayoutVisualizacaoPadraoProps => {
    const context = useContext(ContextoLayoutVisualizacaoPadrao);
    if (!context) throw new Error('useContextoLayoutVisualizacaoPadrao precisa estar dentro de um ContextoLayoutVisualizacaoPadrao');
    return context;
};

export const ContextoLayoutVisualizacaoPadraoProvider = ({ children }: { children: React.ReactNode }) => {
    const [conteudoGeral, setConteudoGeralState] = useState<ReactNode>(null);
    const [conteudoMenu, setConteudoMenu] = useState<ReactNode>(null);
    const [proporcaoGeral, setProporcaoGeral] = useState<number>(0.8);
    const [hrefPaginaParaVoltar, setHrefPaginaParaVoltar] = useState<string | null>(null);

    const setConteudoGeral = (conteudo: React.ReactNode, proporcao?: number) => {
        setConteudoGeralState(conteudo);
        if (proporcao !== undefined) setProporcaoGeral(proporcao);
    };

    const atualizarProporcoes = () => {
        document.documentElement.style.setProperty('--proporcao-geral', proporcaoGeral.toString());
        document.documentElement.style.setProperty('--proporcao-menu', (1 - proporcaoGeral).toString());
    };

    useEffect(() => {
        atualizarProporcoes();
    }, [proporcaoGeral]);

    return (
        <ContextoLayoutVisualizacaoPadrao.Provider value={{ conteudoGeral, setConteudoGeral, conteudoMenu, setConteudoMenu, setProporcaoGeral, hrefPaginaParaVoltar, setHrefPaginaParaVoltar }}>
            {children}
        </ContextoLayoutVisualizacaoPadrao.Provider>
    );
};