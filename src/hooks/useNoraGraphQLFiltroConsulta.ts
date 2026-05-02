'use client';

import { useMemo } from 'react';
import { GraphqlFiltroConsultaCampoDef, GraphqlFiltroOperador } from 'types-nora-api';

import { NoraGraphQLFiltroVisualizacaoAtivo, NoraGraphQLFiltroVisualizacaoValor } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

export type NoraGraphQLFiltroConsultaAtivo = NoraGraphQLFiltroVisualizacaoAtivo;

export type NoraGraphQLFiltroConsultaValor = NoraGraphQLFiltroVisualizacaoValor;

export type NoraGraphQLFiltroConsultaWhereOperadores = {
    readonly eq?: NoraGraphQLFiltroConsultaValor;
    readonly ne?: NoraGraphQLFiltroConsultaValor;
    readonly gt?: NoraGraphQLFiltroConsultaValor;
    readonly gte?: NoraGraphQLFiltroConsultaValor;
    readonly lt?: NoraGraphQLFiltroConsultaValor;
    readonly lte?: NoraGraphQLFiltroConsultaValor;
    readonly isNull?: boolean;
};

export type NoraGraphQLFiltroConsultaWhereValor = NoraGraphQLFiltroConsultaValor | NoraGraphQLFiltroConsultaWhereOperadores | NoraGraphQLFiltroConsultaWhere;

export type NoraGraphQLFiltroConsultaWhere = {
    readonly [campo: string]: NoraGraphQLFiltroConsultaWhereValor | undefined;
};

type NoraGraphQLFiltroConsultaWhereMutavel = {
    [campo: string]: NoraGraphQLFiltroConsultaWhereValor | undefined;
};

type UseNoraGraphQLFiltroConsultaParams<TRegistro extends object> = {
    readonly campos: readonly GraphqlFiltroConsultaCampoDef<TRegistro>[];
    readonly filtros: readonly NoraGraphQLFiltroConsultaAtivo[];
};

type UseNoraGraphQLFiltroConsultaResultado = {
    readonly where: NoraGraphQLFiltroConsultaWhere | null;
    readonly possuiFiltroConsultaAtivo: boolean;
};

function obtemCampoFiltroConsulta<TRegistro extends object>(campos: readonly GraphqlFiltroConsultaCampoDef<TRegistro>[], nomeCampo: string): GraphqlFiltroConsultaCampoDef<TRegistro> | null {
    return campos.find(campo => campo.campo === nomeCampo) ?? null;
};

function validaFiltroConsulta<TRegistro extends object>(campo: GraphqlFiltroConsultaCampoDef<TRegistro> | null, filtro: NoraGraphQLFiltroConsultaAtivo): GraphqlFiltroConsultaCampoDef<TRegistro> {
    if (!campo) throw new Error(`Filtro de consulta GraphQL recebeu campo não permitido: ${filtro.campo}`);
    if (!campo.operadores.includes(filtro.operador)) throw new Error(`Filtro de consulta GraphQL recebeu operador não permitido para o campo ${filtro.campo}: ${filtro.operador}`);

    return campo;
};

function operadorFiltroConsultaExigeValor(operador: GraphqlFiltroOperador): boolean {
    return operador !== GraphqlFiltroOperador.ESTA_NULO;
};

function validaValorFiltroConsulta(filtro: NoraGraphQLFiltroConsultaAtivo): void {
    if (!operadorFiltroConsultaExigeValor(filtro.operador)) return;
    if (filtro.valor === null) throw new Error(`Filtro de consulta GraphQL recebeu valor vazio para o campo ${filtro.campo}`);
    if (typeof filtro.valor === 'string' && filtro.valor.trim().length === 0) throw new Error(`Filtro de consulta GraphQL recebeu texto vazio para o campo ${filtro.campo}`);
};

function montaOperadorWhereFiltroConsulta(filtro: NoraGraphQLFiltroConsultaAtivo): NoraGraphQLFiltroConsultaWhereOperadores {
    if (filtro.operador === GraphqlFiltroOperador.ESTA_NULO) return { isNull: true };
    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return { eq: filtro.valor };
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return { ne: filtro.valor };
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_QUE) return { gt: filtro.valor };
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_OU_IGUAL) return { gte: filtro.valor };
    if (filtro.operador === GraphqlFiltroOperador.MENOR_QUE) return { lt: filtro.valor };
    if (filtro.operador === GraphqlFiltroOperador.MENOR_OU_IGUAL) return { lte: filtro.valor };

    throw new Error(`Operador não suportado em filtro de consulta GraphQL: ${filtro.operador}`);
};

function ehObjetoWhereConsulta(valor: NoraGraphQLFiltroConsultaWhereValor | undefined): valor is NoraGraphQLFiltroConsultaWhereMutavel {
    if (!valor) return false;
    if (valor instanceof Date) return false;
    if (Array.isArray(valor)) return false;

    return typeof valor === 'object';
};

function mesclaOperadoresWhereConsulta(valorAtual: NoraGraphQLFiltroConsultaWhereValor | undefined, valorNovo: NoraGraphQLFiltroConsultaWhereOperadores, campo: string): NoraGraphQLFiltroConsultaWhereOperadores {
    if (!valorAtual) return valorNovo;
    if (valorAtual instanceof Date) throw new Error(`Filtro de consulta GraphQL recebeu conflito de valor para o campo ${campo}`);
    if (Array.isArray(valorAtual)) throw new Error(`Filtro de consulta GraphQL recebeu conflito de lista para o campo ${campo}`);
    if (typeof valorAtual !== 'object') throw new Error(`Filtro de consulta GraphQL recebeu conflito escalar para o campo ${campo}`);

    return { ...valorAtual, ...valorNovo };
};

function atribuiValorWherePorPath(objeto: NoraGraphQLFiltroConsultaWhereMutavel, path: readonly string[], valor: NoraGraphQLFiltroConsultaWhereOperadores): void {
    if (path.length === 0) throw new Error('Filtro de consulta GraphQL recebeu path vazio');

    let cursor = objeto;

    for (let indice = 0; indice < path.length; indice++) {
        const segmento = path[indice];
        const ultimo = indice === path.length - 1;

        if (ultimo) {
            cursor[segmento] = mesclaOperadoresWhereConsulta(cursor[segmento], valor, path.join('.'));
            continue;
        }

        const valorAtual = cursor[segmento];

        if (!ehObjetoWhereConsulta(valorAtual)) cursor[segmento] = {};

        cursor = cursor[segmento] as NoraGraphQLFiltroConsultaWhereMutavel;
    }
};

function montaWhereFiltroConsulta<TRegistro extends object>(campos: readonly GraphqlFiltroConsultaCampoDef<TRegistro>[], filtros: readonly NoraGraphQLFiltroConsultaAtivo[]): NoraGraphQLFiltroConsultaWhere | null {
    if (filtros.length === 0) return null;

    const where: NoraGraphQLFiltroConsultaWhereMutavel = {};

    for (const filtro of filtros) {
        const campo = validaFiltroConsulta(obtemCampoFiltroConsulta(campos, filtro.campo), filtro);

        validaValorFiltroConsulta(filtro);
        atribuiValorWherePorPath(where, campo.path, montaOperadorWhereFiltroConsulta(filtro));
    }

    return where;
};

export function converteFiltrosConsultaParaWhere<TRegistro extends object>(params: UseNoraGraphQLFiltroConsultaParams<TRegistro>): NoraGraphQLFiltroConsultaWhere | null {
    return montaWhereFiltroConsulta(params.campos, params.filtros);
};

export default function useNoraGraphQLFiltroConsulta<TRegistro extends object>(params: UseNoraGraphQLFiltroConsultaParams<TRegistro>): UseNoraGraphQLFiltroConsultaResultado {
    const where = useMemo(() => converteFiltrosConsultaParaWhere(params), [params]);

    return {
        where,
        possuiFiltroConsultaAtivo: params.filtros.length > 0,
    };
};