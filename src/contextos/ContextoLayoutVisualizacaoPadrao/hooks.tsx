'use client';

import { ReactNode, useEffect } from 'react';

import { useContextoLayoutVisualizacaoPadrao } from "./contexto";


export function LayoutVisualizacaoPadrao_ConteudoGeral({ children, proporcaoFlex, hrefPaginaVoltar }: { children: ReactNode, proporcaoFlex?: number, hrefPaginaVoltar?: string }) {
    if (proporcaoFlex) useAtualizaProporcaoConteudos(proporcaoFlex);
    if (hrefPaginaVoltar) useAtualizaHrefParaVoltar(hrefPaginaVoltar);
    useAtualizaConteudoGeral(children);
    return null;
}

export function LayoutVisualizacaoPadrao_ConteudoMenu({ children }: { children: ReactNode }) {
    useAtualizaConteudoMenu(children);
    return null;
}

function useAtualizaConteudoGeral(conteudo: ReactNode) {
    const { setConteudoGeral } = useContextoLayoutVisualizacaoPadrao();

    useEffect(() => {
        setConteudoGeral(conteudo);
        return () => setConteudoGeral(null);
    }, [conteudo, setConteudoGeral]);
};

function useAtualizaConteudoMenu(conteudo: ReactNode) {
    const { setConteudoMenu } = useContextoLayoutVisualizacaoPadrao();
    
    useEffect(() => {
        setConteudoMenu(conteudo);
        return () => setConteudoMenu(null);
    }, [conteudo, setConteudoMenu]);
};

export function useAtualizaProporcaoConteudos(proporcaoFlex: number) {
    const { setProporcaoGeral } = useContextoLayoutVisualizacaoPadrao();

    useEffect(() => {
        setProporcaoGeral(proporcaoFlex);
        return () => setProporcaoGeral(0.8);
    }, [proporcaoFlex]);
};

export function useAtualizaHrefParaVoltar(hrefPaginaVoltar: string) {
    const { setHrefPaginaParaVoltar } = useContextoLayoutVisualizacaoPadrao();
    
    useEffect(() => {
        setHrefPaginaParaVoltar(hrefPaginaVoltar);
        return () => setHrefPaginaParaVoltar(null);
    }, [hrefPaginaVoltar, setHrefPaginaParaVoltar]);
};