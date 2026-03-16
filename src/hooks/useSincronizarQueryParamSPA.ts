'use client';

import { useEffect } from 'react';

import { useQueryParamsSPA } from './useQueryParamsSPA';

type QueryParamValor = string | number | null | undefined;

export function useSincronizarQueryParamSPA(chave: string, valor: QueryParamValor): void {
    const { atualizarQueryParamsSPA } = useQueryParamsSPA();

    useEffect(() => {
        atualizarQueryParamsSPA({ [chave]: valor });
    }, [atualizarQueryParamsSPA, chave, valor]);
};