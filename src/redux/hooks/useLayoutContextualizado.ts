import { useEffect, useMemo } from 'react';

import type { LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { patchLayoutContextualizado, updateLayoutContextualizado, type LayoutContextualizadoModo } from 'Redux/slices/layoutContextualizadoSlice';
import { selectLayoutEscondeFundo, selectLayoutFecharProps, selectLayoutProporcoes, selectLayoutTitulo } from 'Redux/selectors/layoutContextualizadoSelectors';

export type ConfigurarConteudoArgs = { titulo?: string; escondeFundo?: boolean; proporcaoConteudo?: number; fecharProps?: LayoutContextualizadoFecharProps | undefined };

function normalizeForKey(value: unknown): unknown {
    if (value === null) return null;
    if (value === undefined) return undefined;
    if (typeof value === 'function') return '[fn]';
    if (typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(normalizeForKey);
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const out: Record<string, unknown> = {};
    for (const k of keys) {
        const v = normalizeForKey(obj[k]);
        if (v === undefined) continue;
        out[k] = v;
    }
    return out;
};

function makeKey(modo: LayoutContextualizadoModo, args: ConfigurarConteudoArgs) { return JSON.stringify({ modo, args: normalizeForKey(args) }); };

export function useLayoutContextualizado() {
    const titulo = useAppSelector(selectLayoutTitulo);
    const escondeFundo = useAppSelector(selectLayoutEscondeFundo);
    const fecharProps = useAppSelector(selectLayoutFecharProps);
    const proporcoes = useAppSelector(selectLayoutProporcoes);
    return { titulo, escondeFundo, fecharProps, proporcoes };
};

export function useConfigurarLayoutContextualizado(args: ConfigurarConteudoArgs, modo: LayoutContextualizadoModo = 'patch') {
    const dispatch = useAppDispatch();
    const key = useMemo(() => makeKey(modo, args), [modo, args]);
    useEffect(() => { dispatch(modo === 'update' ? updateLayoutContextualizado(args) : patchLayoutContextualizado(args)); }, [dispatch, key]);
};