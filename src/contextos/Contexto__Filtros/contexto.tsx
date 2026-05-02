'use client';

import { createContext, useContext, useState } from 'react';
import { GraphqlFiltroVisualizacaoCampoDef } from 'types-nora-api';

import useNoraGraphQLFiltroVisualizacao, { NoraGraphQLFiltroVisualizacaoAtivo } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

export type ContextoFiltrosVisualizacaoValor<TRegistro extends object> = {
    readonly registrosOriginais: readonly TRegistro[];
    readonly registrosFiltrados: readonly TRegistro[];
    readonly campos: readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    readonly filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
    readonly setFiltros: (filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]) => void;
    readonly totalOriginal: number;
    readonly totalFiltrado: number;
    readonly possuiFiltroAtivo: boolean;
};

type FiltrosVisualizacaoProviderProps<TRegistro extends object> = {
    readonly registros: readonly TRegistro[];
    readonly campos: readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    readonly children: React.ReactNode;
};

const ContextoFiltrosVisualizacao = createContext<ContextoFiltrosVisualizacaoValor<object> | undefined>(undefined);

export function useContextoFiltrosVisualizacao<TRegistro extends object>(): ContextoFiltrosVisualizacaoValor<TRegistro> {
    const context = useContext(ContextoFiltrosVisualizacao);
    if (!context) throw new Error('useContextoFiltrosVisualizacao precisa estar dentro de um FiltrosVisualizacaoProvider');

    return context as ContextoFiltrosVisualizacaoValor<TRegistro>;
};

export function FiltrosVisualizacaoProvider<TRegistro extends object>({ registros, campos, children }: FiltrosVisualizacaoProviderProps<TRegistro>) {
    const [filtros, setFiltros] = useState<readonly NoraGraphQLFiltroVisualizacaoAtivo[]>([]);

    const resultado = useNoraGraphQLFiltroVisualizacao({
        registros,
        campos,
        filtros,
    });

    return (
        <ContextoFiltrosVisualizacao.Provider value={{
            registrosOriginais: resultado.registrosOriginais,
            registrosFiltrados: resultado.registrosFiltrados,
            campos,
            filtros,
            setFiltros,
            totalOriginal: resultado.totalOriginal,
            totalFiltrado: resultado.totalFiltrado,
            possuiFiltroAtivo: resultado.possuiFiltroAtivo,
        }}>
            {children}
        </ContextoFiltrosVisualizacao.Provider>
    );
};