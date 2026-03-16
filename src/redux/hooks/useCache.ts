'use client';

import { useEffect } from 'react';
import { ObjetoCache } from 'types-nora-api';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { fetchCacheCompleto, selectCache, selectCacheCarregando, selectCacheErro, selectCacheTimestamp, selectCacheInicializado, marcarComoInicializado, invalidarCache } from 'Redux/slices/cacheSlice';

// Tempo de validade do cache (5 minutos)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

type UseCacheBase = {
    carregando: boolean;
    erro: string | null;
    timestamp: number | null;
    inicializado: boolean;
    refetch: () => void;
    invalidar: () => void;
};

type UseCacheNaoPronto = UseCacheBase & {
    pronto: false;
    dados: null;
};

type UseCachePronto = UseCacheBase & {
    pronto: true;
    dados: ObjetoCache;
} & ObjetoCache;

export type UseCacheResult = UseCacheNaoPronto | UseCachePronto;

export const useCache = (): UseCacheResult => {
    const dispatch = useAppDispatch();
    const dados = useAppSelector(selectCache);
    const carregando = useAppSelector(selectCacheCarregando);
    const erro = useAppSelector(selectCacheErro);
    const timestamp = useAppSelector(selectCacheTimestamp);
    const inicializado = useAppSelector(selectCacheInicializado);

    useEffect(() => {
        const isCacheValido = timestamp && (Date.now() - timestamp) < CACHE_VALIDITY_MS;
        const deveCarregar = !inicializado && !carregando && !isCacheValido;

        if (deveCarregar) {
            dispatch(fetchCacheCompleto());
        } else if (!inicializado && !carregando) {
            dispatch(marcarComoInicializado());
        }
    }, [dispatch, carregando, timestamp, inicializado]);

    const pronto = inicializado && !carregando && timestamp !== null && dados !== null;

    const base: UseCacheBase = {
        carregando,
        erro,
        timestamp,
        inicializado,
        refetch: () => { dispatch(fetchCacheCompleto()); },
        invalidar: () => { dispatch(invalidarCache()); },
    };

    if (!pronto) {
        return {
            ...base,
            pronto: false,
            dados: null,
        };
    }

    return {
        ...base,
        pronto: true,
        dados,
        ...dados,
    };
};