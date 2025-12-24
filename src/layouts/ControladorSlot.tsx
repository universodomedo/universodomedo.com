'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { decidirAcessoPagina, PAGINAS, type AcessoPagina, type PaginaFolha } from 'types-nora-api';

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

export function ControladorSlot({ pagina, children }: { pagina: PaginaFolha; children: React.ReactNode; }) {
    const { carregando, checkAuth, estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();

    const comCabecalho = pagina.comCabecalho === true;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho]);

    useEffect(() => {
        checkAuth(pagina.template);
    }, []);

    if (carregando) return (<h1>carregando....</h1>);

    const decisao = decidirAcessoPagina(pagina.acesso, { estaAutenticado, verificarCapacidade });

    if (!decisao.permitido) redirect(decisao.redirecionarPara.href);

    return (
        <>
            {comCabecalho && <Cabecalho />}
            {children}
        </>
    );
};