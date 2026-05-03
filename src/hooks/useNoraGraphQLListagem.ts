'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { ApiOperacaoGraphqlGet, EventosApiGraphqlV2, GraphqlFiltroConsultaCampoDef, GraphqlFiltroVisualizacaoCampoDef, GraphqlSelectEntradaRuntime } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import type { ContextoFiltrosConsultaValor } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import type { ContextoFiltrosVisualizacaoValor } from 'Contextos/Contexto__Filtros/contexto';
import type { ListagemCompostaListagem, ListagemCompostaPaginacaoProps } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import useNoraGraphQLFiltroConsulta, { NoraGraphQLFiltroConsultaAtivo, NoraGraphQLFiltroConsultaWhere } from 'Hooks/useNoraGraphQLFiltroConsulta';
import useNoraGraphQLFiltroVisualizacao, { filtraCamposFiltroVisualizacaoPorSelect, NoraGraphQLFiltroVisualizacaoAtivo } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type NoraGraphQLOperacoesLeitura = typeof EventosApiGraphqlV2.obtem;

type NoraGraphQLOperacaoBase = ApiOperacaoGraphqlGet<Record<string, never>, object, object>;

type NoraGraphQLRespostaBruta<TOperacao extends NoraGraphQLOperacaoBase> = TOperacao extends { readonly __noraApiTipoResposta?: infer TResposta } ? TResposta extends object ? TResposta : object : object;

export type UseNoraGraphQLListagemParams<TRegistro extends object, TParametros extends object, TOperacao extends NoraGraphQLOperacaoBase> = {
    readonly select: GraphqlSelectEntradaRuntime;
    readonly camposFiltroConsulta: readonly GraphqlFiltroConsultaCampoDef<object>[];
    readonly camposFiltroVisualizacao: readonly GraphqlFiltroVisualizacaoCampoDef<object>[];
    readonly itensPorPagina: number;
    readonly carregando: string;
    readonly mensagemErro: string;
    readonly mensagemListaVazia: string;
    readonly mensagemListaVaziaComFiltro: string;
    readonly carregamento?: NoraApiCarregamento;
    readonly montaParametrosConsulta: (where: NoraGraphQLFiltroConsultaWhere | null) => TParametros;
    readonly criaOperacao: (obtem: NoraGraphQLOperacoesLeitura, parametros: TParametros) => TOperacao;
    readonly contador?: ReactNode;
    readonly acoes?: ReactNode;
    readonly rodape?: ReactNode;
};

export type UseNoraGraphQLListagemResultado<TRegistro extends object> = ListagemCompostaListagem<TRegistro>;

function normalizaValorFiltroParaComparacao(valor: NoraGraphQLFiltroConsultaAtivo['valor']): string {
    if (valor === null) return 'null';
    if (valor instanceof Date) return valor.toISOString();

    return String(valor).trim().toLowerCase();
};

function serializaFiltroConsulta(filtro: NoraGraphQLFiltroConsultaAtivo): string {
    return `${filtro.campo}:${filtro.operador}:${normalizaValorFiltroParaComparacao(filtro.valor)}`;
};

function serializaFiltrosConsulta(filtros: readonly NoraGraphQLFiltroConsultaAtivo[]): string {
    return filtros.map(serializaFiltroConsulta).sort().join('|');
};

function filtrosConsultaSaoIguais(a: readonly NoraGraphQLFiltroConsultaAtivo[], b: readonly NoraGraphQLFiltroConsultaAtivo[]): boolean {
    return serializaFiltrosConsulta(a) === serializaFiltrosConsulta(b);
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

function extraiListaRespostaGraphQL<TRegistro extends object>(resposta: object): readonly TRegistro[] {
    const valoresResposta = Object.values(resposta);

    if (valoresResposta.length === 0) throw new Error('Resposta GraphQL de listagem não possui nenhum campo de dados');
    if (valoresResposta.length > 1) throw new Error('Resposta GraphQL de listagem possui múltiplos campos de dados');

    const valorResposta = valoresResposta[0];

    if (!Array.isArray(valorResposta)) throw new Error('Resposta GraphQL de listagem não retornou uma lista');

    return valorResposta as readonly TRegistro[];
};

function criaPaginacao(params: { readonly paginaAtual: number; readonly totalPaginas: number; readonly setPaginaAtual: Dispatch<SetStateAction<number>>; }): ListagemCompostaPaginacaoProps {
    return {
        temPaginaAnterior: params.paginaAtual > 1,
        temProximaPagina: params.paginaAtual < params.totalPaginas,
        aoVoltarPagina: () => params.setPaginaAtual(paginaAtual => Math.max(1, paginaAtual - 1)),
        aoAvancarPagina: () => params.setPaginaAtual(paginaAtual => Math.min(params.totalPaginas, paginaAtual + 1)),
    };
};

export default function useNoraGraphQLListagem<TRegistro extends object, TParametros extends object, const TOperacao extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase>(params: UseNoraGraphQLListagemParams<TRegistro, TParametros, TOperacao>): UseNoraGraphQLListagemResultado<TRegistro> {
    const [filtrosConsulta, setFiltrosConsulta] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [filtrosConsultaAplicados, setFiltrosConsultaAplicados] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [versaoAplicacaoConsulta, setVersaoAplicacaoConsulta] = useState(0);
    const [filtrosVisualizacao, setFiltrosVisualizacao] = useState<readonly NoraGraphQLFiltroVisualizacaoAtivo[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const versaoAplicacaoConsultaAnteriorRef = useRef(versaoAplicacaoConsulta);
    const itensPorPaginaNormalizado = normalizaItensPorPagina(params.itensPorPagina);

    const resultadoFiltroConsulta = useNoraGraphQLFiltroConsulta({
        campos: params.camposFiltroConsulta,
        filtros: filtrosConsultaAplicados,
    });

    const parametrosConsulta = useMemo(() => {
        return params.montaParametrosConsulta(resultadoFiltroConsulta.where);
    }, [params, resultadoFiltroConsulta.where]);

    const consulta = useNoraGraphQLConsulta(obtem => params.criaOperacao(obtem, parametrosConsulta), {
        valorInicial: [] as readonly TRegistro[],
        extrair: (resposta: NoraGraphQLRespostaBruta<TOperacao>) => extraiListaRespostaGraphQL<TRegistro>(resposta),
        carregando: params.carregando,
        mensagemErro: params.mensagemErro,
        carregamento: params.carregamento ?? NoraApiCarregamento.BLOQUEIA_INTERFACE,
    });

    const camposFiltroVisualizacao = useMemo(() => {
        return filtraCamposFiltroVisualizacaoPorSelect(params.select, params.camposFiltroVisualizacao) as readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    }, [params.camposFiltroVisualizacao, params.select]);

    const resultadoFiltroVisualizacao = useNoraGraphQLFiltroVisualizacao({
        registros: consulta.data,
        campos: camposFiltroVisualizacao,
        filtros: filtrosVisualizacao,
    });

    const totalPaginas = calculaTotalPaginas(resultadoFiltroVisualizacao.registrosFiltrados.length, itensPorPaginaNormalizado);

    const registrosPaginaAtual = useMemo(() => {
        const indiceInicial = calculaIndiceInicialPagina(paginaAtual, itensPorPaginaNormalizado);

        return resultadoFiltroVisualizacao.registrosFiltrados.slice(indiceInicial, indiceInicial + itensPorPaginaNormalizado);
    }, [itensPorPaginaNormalizado, paginaAtual, resultadoFiltroVisualizacao.registrosFiltrados]);

    const possuiFiltroConsultaAtivo = filtrosConsulta.length > 0;
    const possuiFiltroConsultaAplicado = filtrosConsultaAplicados.length > 0;
    const possuiAlteracaoPendenteConsulta = !filtrosConsultaSaoIguais(filtrosConsulta, filtrosConsultaAplicados);
    const possuiFiltroAtivo = possuiFiltroConsultaAplicado || resultadoFiltroVisualizacao.possuiFiltroAtivo;

    const aplicaFiltrosConsulta = useCallback(() => {
        setFiltrosConsultaAplicados(filtrosConsulta);
        setVersaoAplicacaoConsulta(versaoAtual => versaoAtual + 1);
    }, [filtrosConsulta]);

    const limpaFiltrosConsulta = useCallback(() => {
        setFiltrosConsulta([]);
        setFiltrosConsultaAplicados([]);
        setVersaoAplicacaoConsulta(versaoAtual => versaoAtual + 1);
    }, []);

    const filtrosConsultaValor = useMemo<ContextoFiltrosConsultaValor<object>>(() => ({
        campos: params.camposFiltroConsulta,
        filtros: filtrosConsulta,
        filtrosAplicados: filtrosConsultaAplicados,
        setFiltros: setFiltrosConsulta,
        where: resultadoFiltroConsulta.where,
        possuiFiltroAtivo: possuiFiltroConsultaAtivo,
        possuiFiltroAplicado: possuiFiltroConsultaAplicado,
        possuiAlteracaoPendente: possuiAlteracaoPendenteConsulta,
        versaoAplicacao: versaoAplicacaoConsulta,
        aplicaFiltros: aplicaFiltrosConsulta,
        limpaFiltros: limpaFiltrosConsulta,
    }), [aplicaFiltrosConsulta, filtrosConsulta, filtrosConsultaAplicados, limpaFiltrosConsulta, params.camposFiltroConsulta, possuiAlteracaoPendenteConsulta, possuiFiltroConsultaAplicado, possuiFiltroConsultaAtivo, resultadoFiltroConsulta.where, versaoAplicacaoConsulta]);

    const filtrosVisualizacaoValor = useMemo<ContextoFiltrosVisualizacaoValor<TRegistro>>(() => ({
        registrosOriginais: resultadoFiltroVisualizacao.registrosOriginais,
        registrosFiltrados: resultadoFiltroVisualizacao.registrosFiltrados,
        campos: camposFiltroVisualizacao,
        filtros: filtrosVisualizacao,
        setFiltros: setFiltrosVisualizacao,
        totalOriginal: resultadoFiltroVisualizacao.totalOriginal,
        totalFiltrado: resultadoFiltroVisualizacao.totalFiltrado,
        possuiFiltroAtivo: resultadoFiltroVisualizacao.possuiFiltroAtivo,
    }), [camposFiltroVisualizacao, filtrosVisualizacao, resultadoFiltroVisualizacao.possuiFiltroAtivo, resultadoFiltroVisualizacao.registrosFiltrados, resultadoFiltroVisualizacao.registrosOriginais, resultadoFiltroVisualizacao.totalFiltrado, resultadoFiltroVisualizacao.totalOriginal]);

    useEffect(() => {
        if (versaoAplicacaoConsultaAnteriorRef.current === versaoAplicacaoConsulta) return;

        versaoAplicacaoConsultaAnteriorRef.current = versaoAplicacaoConsulta;
        consulta.recarregar().catch(() => undefined);
    }, [consulta.recarregar, versaoAplicacaoConsulta]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [consulta.data, filtrosConsultaAplicados, filtrosVisualizacao]);

    useEffect(() => {
        if (paginaAtual <= totalPaginas) return;

        setPaginaAtual(totalPaginas);
    }, [paginaAtual, totalPaginas]);

    return {
        registros: registrosPaginaAtual,
        carregando: consulta.carregando,
        erro: consulta.erro,
        mensagemListaVazia: possuiFiltroAtivo ? params.mensagemListaVaziaComFiltro : params.mensagemListaVazia,
        filtrosConsulta: filtrosConsultaValor,
        filtrosVisualizacao: filtrosVisualizacaoValor,
        paginacao: criaPaginacao({ paginaAtual, totalPaginas, setPaginaAtual }),
        contador: params.contador,
        acoes: params.acoes,
        rodape: params.rodape,
    };
};