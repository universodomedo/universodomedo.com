'use client';

import { ReactNode, useEffect } from 'react';

import { useContextoLayoutVisualizacaoPadrao } from "./contexto";


export function LayoutVisualizacaoPadrao_ConteudoGeral({ children }: { children: ReactNode }) {
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