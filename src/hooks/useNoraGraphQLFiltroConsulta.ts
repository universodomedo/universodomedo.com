'use client';

import { useMemo } from 'react';
import { GraphqlFiltroConsultaCampoDef, GraphqlFiltroOperador } from 'types-nora-api';

import { NoraGraphQLFiltroVisualizacaoAtivo, NoraGraphQLFiltroVisualizacaoValor, NoraGraphQLFiltroVisualizacaoValorEscalar, NoraGraphQLFiltroVisualizacaoValorLista } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

export type NoraGraphQLFiltroConsultaAtivo = NoraGraphQLFiltroVisualizacaoAtivo;

export type NoraGraphQLFiltroConsultaValor = NoraGraphQLFiltroVisualizacaoValor;

export type NoraGraphQLFiltroConsultaWhereOperadores = {
    readonly eq?: NoraGraphQLFiltroVisualizacaoValorEscalar;
    readonly ne?: NoraGraphQLFiltroVisualizacaoValorEscalar;
    readonly in?: NoraGraphQLFiltroVisualizacaoValorLista;
    readonly notIn?: NoraGraphQLFiltroVisualizacaoValorLista;
    readonly gt?: NoraGraphQLFiltroVisualizacaoValorEscalar;
    readonly gte?: NoraGraphQLFiltroVisualizacaoValorEscalar;
    readonly lt?: NoraGraphQLFiltroVisualizacaoValorEscalar;
    readonly lte?: NoraGraphQLFiltroVisualizacaoValorEscalar;
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

function valorFiltroConsultaEhLista(valor: NoraGraphQLFiltroConsultaValor): valor is NoraGraphQLFiltroVisualizacaoValorLista {
    return Array.isArray(valor);
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

    const valor = filtro.valor;

    if (valorFiltroConsultaEhLista(valor)) {
        if (valor.length === 0) throw new Error(`Filtro de consulta GraphQL recebeu lista vazia para o campo ${filtro.campo}`);

        return;
    }

    if (valor === null) throw new Error(`Filtro de consulta GraphQL recebeu valor vazio para o campo ${filtro.campo}`);
    if (typeof valor === 'string' && valor.trim().length === 0) throw new Error(`Filtro de consulta GraphQL recebeu texto vazio para o campo ${filtro.campo}`);
};

function montaOperadorWhereFiltroConsulta(filtro: NoraGraphQLFiltroConsultaAtivo): NoraGraphQLFiltroConsultaWhereOperadores {
    if (filtro.operador === GraphqlFiltroOperador.ESTA_NULO) return { isNull: true };

    const valor = filtro.valor;

    if (valorFiltroConsultaEhLista(valor)) {
        if (filtro.operador === GraphqlFiltroOperador.IGUAL) return { in: valor };
        if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return { notIn: valor };

        throw new Error(`Filtro de consulta GraphQL recebeu lista de valores com operador incompatível para o campo ${filtro.campo}: ${filtro.operador}`);
    }

    if (filtro.operador === GraphqlFiltroOperador.IGUAL) return { eq: valor };
    if (filtro.operador === GraphqlFiltroOperador.DIFERENTE) return { ne: valor };
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_QUE) return { gt: valor };
    if (filtro.operador === GraphqlFiltroOperador.MAIOR_OU_IGUAL) return { gte: valor };
    if (filtro.operador === GraphqlFiltroOperador.MENOR_QUE) return { lt: valor };
    if (filtro.operador === GraphqlFiltroOperador.MENOR_OU_IGUAL) return { lte: valor };

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