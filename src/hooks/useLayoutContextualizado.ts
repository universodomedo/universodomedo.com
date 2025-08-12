'use client';

import { useEffect } from 'react';

import { useAppDispatch } from 'redux/hooks/useRedux';
import { setMenuKey, setTituloConteudo } from 'redux/slices/menuSlice';
import { ChaveMenuLayout } from 'componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

export function useLayoutContextualizado(key: ChaveMenuLayout, tituloConteudo?: string) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const mudouMenu = key !== null;
        if (mudouMenu) {
            dispatch(setMenuKey(key));
            if (tituloConteudo) dispatch(setTituloConteudo(tituloConteudo));
        }

        return () => {
            // só limpar se estiver realmente saindo para página sem menu
            dispatch(setMenuKey(null));
            dispatch(setTituloConteudo(null));
        };
    }, [dispatch, key, tituloConteudo]);
};