'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseListagemPaginadaChaveReset = string | number | boolean | null;

export type UseListagemPaginadaParams<TRegistro extends object> = {
    readonly registros: readonly TRegistro[];
    readonly itensPorPagina: number;
    readonly chaveReset?: UseListagemPaginadaChaveReset;
};

export type UseListagemPaginadaPaginacao = {
    readonly temPaginaAnterior: boolean;
    readonly temProximaPagina: boolean;
    readonly aoVoltarPagina: () => void;
    readonly aoAvancarPagina: () => void;
};

export type UseListagemPaginadaResultado<TRegistro extends object> = {
    readonly registrosPaginaAtual: readonly TRegistro[];
    readonly paginaAtual: number;
    readonly totalPaginas: number;
    readonly paginacao: UseListagemPaginadaPaginacao;
};

function normalizaItensPorPagina(itensPorPagina: number): number {
    if (!Number.isFinite(itensPorPagina)) return 1;
    if (itensPorPagina < 1) return 1;

    return Math.floor(itensPorPagina);
};

function calculaTotalPaginas(totalRegistros: number, itensPorPagina: number): number {
    return Math.max(1, Math.ceil(totalRegistros / itensPorPagina));
};

function calculaIndiceInicialPagina(paginaAtual: number, itensPorPagina: number): number {
    return (paginaAtual - 1) * itensPorPagina;
};

export default function useListagemPaginada<TRegistro extends object>({ registros, itensPorPagina, chaveReset = null }: UseListagemPaginadaParams<TRegistro>): UseListagemPaginadaResultado<TRegistro> {
    const itensPorPaginaNormalizado = normalizaItensPorPagina(itensPorPagina);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = calculaTotalPaginas(registros.length, itensPorPaginaNormalizado);

    const registrosPaginaAtual = useMemo(() => {
        const indiceInicial = calculaIndiceInicialPagina(paginaAtual, itensPorPaginaNormalizado);
        return registros.slice(indiceInicial, indiceInicial + itensPorPaginaNormalizado);
    }, [itensPorPaginaNormalizado, paginaAtual, registros]);

    const voltarPagina = useCallback(() => {
        setPaginaAtual(pagina => Math.max(1, pagina - 1));
    }, []);

    const avancarPagina = useCallback(() => {
        setPaginaAtual(pagina => Math.min(totalPaginas, pagina + 1));
    }, [totalPaginas]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [chaveReset]);

    useEffect(() => {
        if (paginaAtual <= totalPaginas) return;

        setPaginaAtual(totalPaginas);
    }, [paginaAtual, totalPaginas]);

    return {
        registrosPaginaAtual,
        paginaAtual,
        totalPaginas,
        paginacao: {
            temPaginaAnterior: paginaAtual > 1,
            temProximaPagina: paginaAtual < totalPaginas,
            aoVoltarPagina: voltarPagina,
            aoAvancarPagina: avancarPagina,
        },
    };
};