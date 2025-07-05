'use client';

import { redirect } from 'next/navigation';
import { useEffect } from "react";

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import Chat from 'Componentes/Elementos/Chat/Chat.tsx';
import { PaginaObjeto } from 'types-nora-api';
import useNotificarSaidaPagina from 'Hooks/useNotificarSaidaPagina';

export function ControladorSlot({ pageConfig, children, }: { pageConfig: { paginaAtual?: PaginaObjeto | null; comCabecalho?: boolean; usuarioObrigatorio?: boolean }; children: React.ReactNode; }) {
    console.log(`ControladorSlot`);
    const { carregando, checkAuth, estaAutenticado } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    const { comCabecalho = false, usuarioObrigatorio = false } = pageConfig;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho]);

    useEffect(() => {
        checkAuth(pageConfig.paginaAtual);
    }, []);

    console.log(`chamando useNotificarSaidaPagina`);
    console.log(`estaAutenticado: [${estaAutenticado}]`);
    useNotificarSaidaPagina(estaAutenticado);

    if (carregando) return (<h1>carregando....</h1>);

    if (usuarioObrigatorio && !estaAutenticado) redirect('/acessar');

    return (
        <>
            {comCabecalho && <Cabecalho />}
            {false && estaAutenticado && <Chat />}
            {children}
        </>
    );
};