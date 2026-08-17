'use client';

import React, { useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { decidirAcessoRuntime, type PaginaFolha, type MenuLeafRuntime } from 'types-nora-api';

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';
import RedirecionadorHref from 'Componentes/Elementos/RedirecionadorHref/RedirecionadorHref';
import { montaHrefAcessarComDestino } from 'Funcionalidades/Acessos/destinoPosLogin';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoNavegacaoRuntime } from 'Contextos/ContextoNavegacaoRuntime/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import { useAtualizarPaginaAtualWs } from 'Hooks/useAtualizarPaginaAtualWs';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { updateLayoutContextualizado, setMenuLeaf } from 'Redux/slices/layoutContextualizadoSlice';
import { selectLayoutEsconderMenu, selectMenuLayoutTipo } from 'Redux/selectors/layoutContextualizadoSelectors';
import { useDefinirMusicaPagina } from 'Hooks/useDefinirMusicaPagina';

import { MenuLayoutDinamicoProvider, useMenuLayoutDinamicoValor } from './MenuLayoutDinamico';

export type EmbrulhoSlot = React.ComponentType<{ children: React.ReactNode }>;

const OPTS_ACESSO = { redirectNaoAutenticado: '/acessar', redirectSemCapacidade: '/' };

function temMenuParaRenderizar(leaf: MenuLeafRuntime): boolean {
    if (leaf.tipo === 'menu') return leaf.nodes.length > 0;
    return leaf.tipo !== 'vazio';
}

function MenuArea({ leaf }: { leaf: MenuLeafRuntime }) {
    const menuTipo = useAppSelector(selectMenuLayoutTipo);
    const menuDinamico = useMenuLayoutDinamicoValor();

    if (leaf.tipo === 'menu') return <MenuInterno itens={leaf.nodes} />;
    if (leaf.tipo === 'vazio') return null;

    if (menuTipo !== 'dinamico') return null;
    return <>{menuDinamico}</>;
};

export function ControladorSlot({ pagina, children, embrulho: Embrulho }: { pagina: PaginaFolha; children: React.ReactNode; embrulho?: EmbrulhoSlot | undefined; }) {
    const dispatch = useAppDispatch();
    const definirMusicaPagina = useDefinirMusicaPagina();
    const { carregando, estaAutenticado, verificarCapacidade, cadastroPermitido } = useContextoAutenticacao();
    const { indice } = useContextoNavegacaoRuntime();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    const esconderMenu = useAppSelector(selectLayoutEsconderMenu);

    const pagConfig = indice ? indice.paginaPorTemplate.get(pagina.template) ?? null : null;
    const comCabecalho = pagConfig?.comCabecalho === true;
    const layout = pagConfig?.layout ?? null;
    const temLayout = layout !== null;
    const menuLeaf = useMemo<MenuLeafRuntime>(() => (indice ? indice.leafPorTemplate.get(pagina.template) : undefined) ?? { tipo: 'vazio' }, [indice, pagina.template]);
    const menuConfigurado = useMemo(() => temMenuParaRenderizar(menuLeaf), [menuLeaf]);
    const temMenu = menuConfigurado && esconderMenu !== true;

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho, setTamanhoReduzido]);

    useAtualizarPaginaAtualWs(pagina.template);

    const decisao = useMemo(() => {
        if (indice === null) return null;
        return decidirAcessoRuntime(pagina.template, indice, { estaAutenticado, verificarCapacidade, cadastroPermitido }, OPTS_ACESSO);
    }, [indice, pagina.template, estaAutenticado, verificarCapacidade, cadastroPermitido]);

    const permitido = decisao !== null && decisao.permitido;

    useEffect(() => {
        if (!temLayout || layout === null) return;
        if (!permitido) return;
        dispatch(updateLayoutContextualizado(layout));
        dispatch(setMenuLeaf(menuLeaf));
    }, [dispatch, temLayout, layout, permitido, menuLeaf]);

    useEffect(() => {
        if (!permitido) return;
        const idMusica = pagConfig?.idMusicaPagina ?? null;
        definirMusicaPagina(idMusica, idMusica !== null ? (pagConfig?.label ?? null) : null);
    }, [definirMusicaPagina, permitido, pagConfig]);

    if (carregando || indice === null || decisao === null) return (<h1>carregando....</h1>);
    if (!decisao.permitido) {
        // Página inativa (para não-SUDO) responde igual a uma rota que não existe: o 404 real do Next.
        if (decisao.motivo === 'INEXISTENTE') notFound();

        // Quem foi barrado por não estar autenticado volta para onde estava indo assim que logar.
        if (decisao.motivo === 'NAO_AUTENTICADO' && typeof window !== 'undefined') return (<RedirecionadorHref href={montaHrefAcessarComDestino(window.location.pathname + window.location.search)} />);

        return (<RedirecionadorHref href={decisao.redirecionarPara} />);
    }

    const corpoSemLayout = (
        <>
            {comCabecalho && <Cabecalho />}
            {children}
        </>
    );

    if (!temLayout) {
        if (!Embrulho) return corpoSemLayout;
        return <Embrulho>{corpoSemLayout}</Embrulho>;
    }

    const layoutEl = (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo forcarLarguraTotal={!temMenu}>
                {children}
            </LayoutContextualizado.Conteudo>

            {temMenu && (
                <LayoutContextualizado.Menu>
                    <MenuArea leaf={menuLeaf} />
                </LayoutContextualizado.Menu>
            )}
        </LayoutContextualizado>
    );

    const corpoComLayout = (
        <>
            {comCabecalho && <Cabecalho />}
            <MenuLayoutDinamicoProvider>
                {Embrulho ? (
                    <Embrulho>
                        {layoutEl}
                    </Embrulho>
                ) : (
                    layoutEl
                )}
            </MenuLayoutDinamicoProvider>
        </>
    );

    return corpoComLayout;
};
