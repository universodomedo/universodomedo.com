'use client';

import { useEffect } from 'react';
import { decidirAcessoPagina, PAGINAS, resolverMenuInterno, type PaginaFolha } from 'types-nora-api';

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';

export function ControladorSlot({ pagina, children }: { pagina: PaginaFolha; children: React.ReactNode; }) {
    const { carregando, checkAuth, estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();

    const comCabecalho = pagina.comCabecalho === true;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho, setTamanhoReduzido]);

    useEffect(() => {
        checkAuth(pagina.template);
    }, []);

    if (carregando) return (<h1>carregando....</h1>);

    const decisao = decidirAcessoPagina(pagina, { estaAutenticado, verificarCapacidade }, { resolverMenuInterno, redirectNaoAutenticado: PAGINAS.acessar, redirectSemCapacidade: PAGINAS.home });

    if (!decisao.permitido) return <RedirecionadorInterno pagina={decisao.redirecionarPara} />;

    return (
        <>
            {comCabecalho && <Cabecalho />}
            {children}
        </>
    );
};