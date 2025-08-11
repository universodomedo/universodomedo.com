'use client';

import { useEffect } from 'react';

import { useAppDispatch } from 'redux/hooks/useRedux';
import { setMenuKey } from 'redux/slices/menuSlice';
import { ChaveMenuLayout } from 'componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

export function useLayoutContextualizado(key: ChaveMenuLayout) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setMenuKey(key));
        return () => {
            dispatch(setMenuKey(null));
        };
    }, [dispatch, key]);
};