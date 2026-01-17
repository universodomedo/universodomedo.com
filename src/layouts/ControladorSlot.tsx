'use client';

import React, { useEffect, useMemo } from 'react';
import { decidirAcessoPagina, PAGINAS, resolverMenuInterno, obterMenuInternoLayoutContexto, type PaginaFolha, type LayoutContextualizadoInicial, type MenuLayoutLeaf, type MenuNode } from 'types-nora-api';

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { updateLayoutContextualizado, setMenuLeaf } from 'Redux/slices/layoutContextualizadoSlice';
import { selectMenuLayoutTipo } from 'Redux/selectors/layoutContextualizadoSelectors';

import { MenuLayoutDinamicoProvider, useMenuLayoutDinamicoValor } from './MenuLayoutDinamico';

export type EmbrulhoSlot = React.ComponentType<{ children: React.ReactNode }>;

type PaginaComLayout = PaginaFolha & { readonly layoutContextualizadoInicial: LayoutContextualizadoInicial };

function isPaginaComLayout(pagina: PaginaFolha): pagina is PaginaComLayout { return Object.prototype.hasOwnProperty.call(pagina, 'layoutContextualizadoInicial'); };

function isLeafArray(leaf: MenuLayoutLeaf): leaf is readonly MenuNode[] { return Array.isArray(leaf); };

function resolverMenuLeaf(pagina: PaginaFolha): MenuLayoutLeaf { return obterMenuInternoLayoutContexto(pagina) ?? { tipo: 'vazio' }; };

function temMenuParaRenderizar(leaf: MenuLayoutLeaf): boolean {
    if (isLeafArray(leaf)) return leaf.length > 0;
    return leaf.tipo !== 'vazio';
}

function MenuArea({ leaf }: { leaf: MenuLayoutLeaf }) {
    const menuTipo = useAppSelector(selectMenuLayoutTipo);
    const menuDinamico = useMenuLayoutDinamicoValor();

    if (isLeafArray(leaf)) return <MenuInterno itens={leaf} />;
    if (leaf.tipo === 'vazio') return null;

    if (menuTipo !== 'dinamico') return null;
    return <>{menuDinamico}</>;
};

export function ControladorSlot({ pagina, children, embrulho: Embrulho }: { pagina: PaginaFolha; children: React.ReactNode; embrulho?: EmbrulhoSlot | undefined; }) {
    const dispatch = useAppDispatch();
    const { carregando, checkAuth, estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();

    const comCabecalho = pagina.comCabecalho === true;
    const temLayout = isPaginaComLayout(pagina);
    const menuLeaf = useMemo(() => resolverMenuLeaf(pagina), [pagina]);
    const temMenu = useMemo(() => temMenuParaRenderizar(menuLeaf), [menuLeaf]);

    useEffect(() => {
        if (!comCabecalho) setTamanhoReduzido(true);
    }, [comCabecalho, setTamanhoReduzido]);

    useEffect(() => {
        checkAuth(pagina.template);
    }, []);

    const decisao = useMemo(() => decidirAcessoPagina(pagina, { estaAutenticado, verificarCapacidade }, { resolverMenuInterno, redirectNaoAutenticado: PAGINAS.acessar, redirectSemCapacidade: PAGINAS.home }), [pagina, estaAutenticado, verificarCapacidade]);

    useEffect(() => {
        if (!temLayout) return;
        if (!decisao.permitido) return;
        dispatch(updateLayoutContextualizado(pagina.layoutContextualizadoInicial));
        dispatch(setMenuLeaf(menuLeaf));
    }, [dispatch, temLayout, decisao.permitido, pagina, menuLeaf]);

    if (carregando) return (<h1>carregando....</h1>);
    if (!decisao.permitido) return (<RedirecionadorInterno pagina={decisao.redirecionarPara} />);

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

    const layout = (
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
                        {layout}
                    </Embrulho>
                ) : (
                    layout
                )}
            </MenuLayoutDinamicoProvider>
        </>
    );

    return corpoComLayout;
};