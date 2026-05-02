'use client';

import { createContext, useContext, useState } from 'react';
import { GraphqlFiltroConsultaCampoDef } from 'types-nora-api';

import useNoraGraphQLFiltroConsulta, { NoraGraphQLFiltroConsultaAtivo, NoraGraphQLFiltroConsultaWhere } from 'Hooks/useNoraGraphQLFiltroConsulta';

export type ContextoFiltrosConsultaValor<TRegistro extends object> = {
    readonly campos: readonly GraphqlFiltroConsultaCampoDef<TRegistro>[];
    readonly filtros: readonly NoraGraphQLFiltroConsultaAtivo[];
    readonly filtrosAplicados: readonly NoraGraphQLFiltroConsultaAtivo[];
    readonly setFiltros: (filtros: readonly NoraGraphQLFiltroConsultaAtivo[]) => void;
    readonly where: NoraGraphQLFiltroConsultaWhere | null;
    readonly possuiFiltroAtivo: boolean;
    readonly possuiFiltroAplicado: boolean;
    readonly possuiAlteracaoPendente: boolean;
    readonly versaoAplicacao: number;
    readonly aplicaFiltros: () => void;
    readonly limpaFiltros: () => void;
};

type FiltrosConsultaProviderProps<TRegistro extends object> = {
    readonly campos: readonly GraphqlFiltroConsultaCampoDef<TRegistro>[];
    readonly children: React.ReactNode;
};

const ContextoFiltrosConsulta = createContext<ContextoFiltrosConsultaValor<object> | undefined>(undefined);

function normalizaValorFiltroConsultaParaComparacao(valor: NoraGraphQLFiltroConsultaAtivo['valor']): string {
    if (valor === null) return 'null';
    if (valor instanceof Date) return valor.toISOString();

    return String(valor).trim().toLowerCase();
};

function serializaFiltroConsulta(filtro: NoraGraphQLFiltroConsultaAtivo): string {
    return `${filtro.campo}:${filtro.operador}:${normalizaValorFiltroConsultaParaComparacao(filtro.valor)}`;
};

function serializaFiltrosConsulta(filtros: readonly NoraGraphQLFiltroConsultaAtivo[]): string {
    return filtros.map(serializaFiltroConsulta).sort().join('|');
};

function filtrosConsultaSaoIguais(a: readonly NoraGraphQLFiltroConsultaAtivo[], b: readonly NoraGraphQLFiltroConsultaAtivo[]): boolean {
    return serializaFiltrosConsulta(a) === serializaFiltrosConsulta(b);
};

export function useContextoFiltrosConsulta<TRegistro extends object>(): ContextoFiltrosConsultaValor<TRegistro> {
    const context = useContext(ContextoFiltrosConsulta);
    if (!context) throw new Error('useContextoFiltrosConsulta precisa estar dentro de um FiltrosConsultaProvider');

    return context as ContextoFiltrosConsultaValor<TRegistro>;
};

export function FiltrosConsultaProvider<TRegistro extends object>({ campos, children }: FiltrosConsultaProviderProps<TRegistro>) {
    const [filtros, setFiltros] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [filtrosAplicados, setFiltrosAplicados] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [versaoAplicacao, setVersaoAplicacao] = useState(0);

    const resultado = useNoraGraphQLFiltroConsulta({
        campos,
        filtros: filtrosAplicados,
    });

    const possuiFiltroAtivo = filtros.length > 0;
    const possuiFiltroAplicado = filtrosAplicados.length > 0;
    const possuiAlteracaoPendente = !filtrosConsultaSaoIguais(filtros, filtrosAplicados);

    function aplicaFiltros() {
        setFiltrosAplicados(filtros);
        setVersaoAplicacao(versaoAtual => versaoAtual + 1);
    };

    function limpaFiltros() {
        setFiltros([]);
        setFiltrosAplicados([]);
        setVersaoAplicacao(versaoAtual => versaoAtual + 1);
    };

    return (
        <ContextoFiltrosConsulta.Provider value={{
            campos,
            filtros,
            filtrosAplicados,
            setFiltros,
            where: resultado.where,
            possuiFiltroAtivo,
            possuiFiltroAplicado,
            possuiAlteracaoPendente,
            versaoAplicacao,
            aplicaFiltros,
            limpaFiltros,
        }}>
            {children}
        </ContextoFiltrosConsulta.Provider>
    );
};