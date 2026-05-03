'use client';

import { useMemo, useState } from 'react';

import useListagemPaginada, { UseListagemPaginadaPaginacao } from 'Hooks/useListagemPaginada';

export type UseListagemLocalParams<TRegistro extends object> = {
    readonly registros: readonly TRegistro[];
    readonly itensPorPagina: number;
    readonly filtrarRegistro: (registro: TRegistro, filtroNormalizado: string) => boolean;
    readonly normalizarFiltro?: (texto: string) => string;
};

export type UseListagemLocalResultado<TRegistro extends object> = {
    readonly textoFiltroLocal: string;
    readonly setTextoFiltroLocal: (texto: string) => void;
    readonly filtroLocalNormalizado: string;
    readonly possuiFiltroLocal: boolean;
    readonly registrosFiltrados: readonly TRegistro[];
    readonly registrosPaginaAtual: readonly TRegistro[];
    readonly paginaAtual: number;
    readonly totalPaginas: number;
    readonly paginacao: UseListagemPaginadaPaginacao;
};

function normalizaFiltroLocalPadrao(texto: string): string {
    return texto.trim().toLowerCase();
};

export default function useListagemLocal<TRegistro extends object>({ registros, itensPorPagina, filtrarRegistro, normalizarFiltro = normalizaFiltroLocalPadrao }: UseListagemLocalParams<TRegistro>): UseListagemLocalResultado<TRegistro> {
    const [textoFiltroLocal, setTextoFiltroLocal] = useState('');
    const filtroLocalNormalizado = normalizarFiltro(textoFiltroLocal);
    const possuiFiltroLocal = filtroLocalNormalizado.length > 0;

    const registrosFiltrados = useMemo(() => {
        if (!possuiFiltroLocal) return registros;

        return registros.filter(registro => filtrarRegistro(registro, filtroLocalNormalizado));
    }, [filtrarRegistro, filtroLocalNormalizado, possuiFiltroLocal, registros]);

    const listagemPaginada = useListagemPaginada({ registros: registrosFiltrados, itensPorPagina, chaveReset: filtroLocalNormalizado });

    return {
        textoFiltroLocal,
        setTextoFiltroLocal,
        filtroLocalNormalizado,
        possuiFiltroLocal,
        registrosFiltrados,
        registrosPaginaAtual: listagemPaginada.registrosPaginaAtual,
        paginaAtual: listagemPaginada.paginaAtual,
        totalPaginas: listagemPaginada.totalPaginas,
        paginacao: listagemPaginada.paginacao,
    };
};