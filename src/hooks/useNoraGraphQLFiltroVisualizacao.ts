'use client';

import { useMemo } from 'react';
import { GraphqlFiltroCampoTipo, GraphqlFiltroOperador, GraphqlFiltroVisualizacaoCampoDef, GraphqlSelectEntradaRuntime, GraphqlSelectRuntime, normalizaSelectGraphql } from 'types-nora-api';

export type NoraGraphQLFiltroVisualizacaoValor = string | number | boolean | Date | null;

export type NoraGraphQLFiltroVisualizacaoAtivo<TCampo extends string = string> = {
    readonly id: string;
    readonly campo: TCampo;
    readonly operador: GraphqlFiltroOperador;
    readonly valor: NoraGraphQLFiltroVisualizacaoValor;
};

export type NoraGraphQLResultadoFiltroVisualizacao<TRegistro extends object> = {
    readonly registrosOriginais: readonly TRegistro[];
    readonly registrosFiltrados: readonly TRegistro[];
    readonly filtrosAtivos: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
    readonly totalOriginal: number;
    readonly totalFiltrado: number;
    readonly possuiFiltroAtivo: boolean;
};

type ValorFiltroVisualizacaoRuntime = string | number | boolean | Date | null | undefined;

type ValorCaminhoFiltroVisualizacao = ValorFiltroVisualizacaoRuntime | ObjetoCaminhoFiltroVisualizacao;

type ObjetoCaminhoFiltroVisualizacao = {
    readonly [key: string]: ValorCaminhoFiltroVisualizacao;
};

type UseNoraGraphQLFiltroVisualizacaoParams<TRegistro extends object> = {
    readonly registros: readonly TRegistro[];
    readonly campos: readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    readonly filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
};

function valorEhObjetoCaminhoFiltroVisualizacao(valor: ValorCaminhoFiltroVisualizacao): valor is ObjetoCaminhoFiltroVisualizacao {
    if (valor === null) return false;
    if (valor === undefined) return false;
    if (valor instanceof Date) return false;
    if (Array.isArray(valor)) return false;

    return typeof valor === 'object';
};

function obtemValorPorPath<TRegistro extends object>(registro: TRegistro, path: readonly string[]): ValorCaminhoFiltroVisualizacao {
    let valorAtual: ValorCaminhoFiltroVisualizacao = registro as ObjetoCaminhoFiltroVisualizacao;

    for (const parte of path) {
        if (!valorEhObjetoCaminhoFiltroVisualizacao(valorAtual)) return undefined;

        valorAtual = valorAtual[parte];
    }

    return valorAtual;
};

function normalizaTextoFiltroVisualizacao(valor: string): string {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

function converteValorParaTexto(valor: ValorCaminhoFiltroVisualizacao | NoraGraphQLFiltroVisualizacaoValor): string {
    if (valor === null) return '';
    if (valor === undefined) return '';
    if (valor instanceof Date) return valor.toISOString();

    return String(valor);
};

function converteValorParaNumero(valor: ValorCaminhoFiltroVisualizacao | NoraGraphQLFiltroVisualizacaoValor): number | null {
    if (valor === null) return null;
    if (valor === undefined) return null;
    if (valor instanceof Date) return valor.getTime();

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : null;
};

function converteValorParaBoolean(valor: ValorCaminhoFiltroVisualizacao | NoraGraphQLFiltroVisualizacaoValor): boolean | null {
    if (typeof valor === 'boolean') return valor;
    if (typeof valor === 'string') {
        const valorNormalizado = normalizaTextoFiltroVisualizacao(valor);
        if (valorNormalizado === 'true') return true;
        if (valorNormalizado === 'false') return false;
        if (valorNormalizado === 'sim') return true;
        if (valorNormalizado === 'nao') return false;
    }

    return null;
};

function converteValorParaTempoData(valor: ValorCaminhoFiltroVisualizacao | NoraGraphQLFiltroVisualizacaoValor): number | null {
    if (valor === null) return null;
    if (valor === undefined) return null;
    if (valor instanceof Date) return valor.getTime();

    const data = new Date(String(valor));
    const tempo = data.getTime();

    return Number.isFinite(tempo) ? tempo : null;
};

function comparaTexto(valorRegistro: ValorCaminhoFiltroVisualizacao, filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    const textoRegistro = normalizaTextoFiltroVisualizacao(converteValorParaTexto(valorRegistro));
    const textoFiltro = normalizaTextoFiltroVisualizacao(converteValorParaTexto(filtro.valor));

    if (filtro.operador === GraphqlFiltroOperador.CONTEM) return textoRegistro.includes(textoFiltro);
    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return textoRegistro === textoFiltro;
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return textoRegistro !== textoFiltro;

    return true;
};

function comparaNumero(valorRegistro: ValorCaminhoFiltroVisualizacao, filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    const numeroRegistro = converteValorParaNumero(valorRegistro);
    const numeroFiltro = converteValorParaNumero(filtro.valor);

    if (numeroRegistro === null || numeroFiltro === null) return false;

    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return numeroRegistro === numeroFiltro;
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return numeroRegistro !== numeroFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_QUE) return numeroRegistro > numeroFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_OU_IGUAL) return numeroRegistro >= numeroFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MENOR_QUE) return numeroRegistro < numeroFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MENOR_OU_IGUAL) return numeroRegistro <= numeroFiltro;

    return true;
};

function comparaBoolean(valorRegistro: ValorCaminhoFiltroVisualizacao, filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    const booleanRegistro = converteValorParaBoolean(valorRegistro);
    const booleanFiltro = converteValorParaBoolean(filtro.valor);

    if (booleanRegistro === null || booleanFiltro === null) return false;

    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return booleanRegistro === booleanFiltro;
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return booleanRegistro !== booleanFiltro;

    return true;
};

function comparaData(valorRegistro: ValorCaminhoFiltroVisualizacao, filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    const tempoRegistro = converteValorParaTempoData(valorRegistro);
    const tempoFiltro = converteValorParaTempoData(filtro.valor);

    if (tempoRegistro === null || tempoFiltro === null) return false;

    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return new Date(tempoRegistro).toISOString().slice(0, 10) === new Date(tempoFiltro).toISOString().slice(0, 10);
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return new Date(tempoRegistro).toISOString().slice(0, 10) !== new Date(tempoFiltro).toISOString().slice(0, 10);
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_QUE) return tempoRegistro > tempoFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_OU_IGUAL) return tempoRegistro >= tempoFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MENOR_QUE) return tempoRegistro < tempoFiltro;
    if (filtro.operador === GraphqlFiltroOperador.MENOR_OU_IGUAL) return tempoRegistro <= tempoFiltro;

    return true;
};

function filtroEstaNulo(valorRegistro: ValorCaminhoFiltroVisualizacao): boolean {
    return valorRegistro === null || valorRegistro === undefined || valorRegistro === '';
};

function filtroEhAplicavel(filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    if (filtro.operador === GraphqlFiltroOperador.ESTA_NULO) return true;
    if (filtro.valor === null) return false;
    if (typeof filtro.valor === 'string') return filtro.valor.trim().length > 0;

    return true;
};

function registroPassaNoFiltro<TRegistro extends object>(registro: TRegistro, campo: GraphqlFiltroVisualizacaoCampoDef<TRegistro>, filtro: NoraGraphQLFiltroVisualizacaoAtivo): boolean {
    const valorRegistro = obtemValorPorPath(registro, campo.path);

    if (filtro.operador === GraphqlFiltroOperador.ESTA_NULO) return filtroEstaNulo(valorRegistro);

    if (campo.tipo === GraphqlFiltroCampoTipo.STRING) return comparaTexto(valorRegistro, filtro);
    if (campo.tipo === GraphqlFiltroCampoTipo.NUMBER) return comparaNumero(valorRegistro, filtro);
    if (campo.tipo === GraphqlFiltroCampoTipo.BOOLEAN) return comparaBoolean(valorRegistro, filtro);
    if (campo.tipo === GraphqlFiltroCampoTipo.DATE) return comparaData(valorRegistro, filtro);

    return true;
};

function registroPassaNosFiltros<TRegistro extends object>(registro: TRegistro, campos: readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[], filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]): boolean {
    for (const filtro of filtros) {
        if (!filtroEhAplicavel(filtro)) continue;

        const campo = campos.find(campoFiltro => campoFiltro.campo === filtro.campo);
        if (!campo) continue;

        if (!registroPassaNoFiltro(registro, campo, filtro)) return false;
    }

    return true;
};

function selectContemPath(selectRuntime: GraphqlSelectRuntime, path: readonly string[]): boolean {
    let selectAtual: true | GraphqlSelectRuntime | undefined = selectRuntime;

    for (const parte of path) {
        if (selectAtual === true) return true;
        if (!selectAtual) return false;

        selectAtual = selectAtual[parte];
    }

    return selectAtual !== undefined;
};

export function filtraCamposFiltroVisualizacaoPorSelect<TRegistro extends object>(select: GraphqlSelectEntradaRuntime, campos: readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[]): readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[] {
    const selectRuntime = normalizaSelectGraphql(select);

    return campos.filter(campo => selectContemPath(selectRuntime, campo.path));
};

export default function useNoraGraphQLFiltroVisualizacao<TRegistro extends object>(params: UseNoraGraphQLFiltroVisualizacaoParams<TRegistro>): NoraGraphQLResultadoFiltroVisualizacao<TRegistro> {
    return useMemo(() => {
        const filtrosAplicaveis = params.filtros.filter(filtroEhAplicavel);
        const registrosFiltrados = params.registros.filter(registro => registroPassaNosFiltros(registro, params.campos, filtrosAplicaveis));

        return {
            registrosOriginais: params.registros,
            registrosFiltrados,
            filtrosAtivos: filtrosAplicaveis,
            totalOriginal: params.registros.length,
            totalFiltrado: registrosFiltrados.length,
            possuiFiltroAtivo: filtrosAplicaveis.length > 0,
        };
    }, [params.registros, params.campos, params.filtros]);
};