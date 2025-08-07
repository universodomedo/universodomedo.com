'use client';

import { ReactNode, useEffect } from 'react';

import { useContextoLayoutVisualizacaoPadrao } from "./contexto";

export function useAtualizaConteudoGeral(conteudo: ReactNode) {
    const { setConteudoGeral } = useContextoLayoutVisualizacaoPadrao();

    useEffect(() => {
        setConteudoGeral(conteudo);
        return () => setConteudoGeral(null);
    }, [conteudo, setConteudoGeral]);
};

export function useAtualizaConteudoMenu(conteudo: ReactNode) {
    const { setConteudoMenu } = useContextoLayoutVisualizacaoPadrao();

    useEffect(() => {
        setConteudoMenu(conteudo);
        return () => setConteudoMenu(null);
    }, [conteudo, setConteudoMenu]);
};