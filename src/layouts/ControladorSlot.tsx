'use client';

import { redirect } from 'next/navigation';
import { useEffect } from "react";

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import { PaginaObjeto } from 'types-nora-api';
import useInicializarSocket from 'Hooks/useInicializarSocket';

export function ControladorSlot({ pageConfig, children, }: { pageConfig: { paginaAtual?: PaginaObjeto; comCabecalho?: boolean; usuarioObrigatorio?: boolean }; children: React.ReactNode; }) {
    const { carregando, checkAuth, estaAutenticado } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    const { comCabecalho = false, usuarioObrigatorio = false } = pageConfig;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho]);

    useEffect(() => {
        checkAuth(pageConfig.paginaAtual);
    }, []);

    useInicializarSocket(estaAutenticado && !carregando);
        
    if (carregando) return (<h1>carregando....</h1>);

    if (usuarioObrigatorio && !estaAutenticado) redirect('/acessar');

    return (
        <>
            {comCabecalho && <Cabecalho />}
            {children}
        </>
    );
};