'use client';

import { redirect } from 'next/navigation';
import { useEffect } from "react";

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

export function ControladorSlot({ pageConfig, children, }: { pageConfig: { comCabecalho?: boolean; usuarioObrigatorio?: boolean }; children: React.ReactNode; }) {
    const { carregando, estaAutenticado } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    const { comCabecalho = false, usuarioObrigatorio = false } = pageConfig;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho]);

    if (carregando) return (<h1>carregando....</h1>);

    if (usuarioObrigatorio && !estaAutenticado) redirect('/acessar');

    return (
        <>
            {comCabecalho && <Cabecalho />}
            {children}
        </>
    );
};