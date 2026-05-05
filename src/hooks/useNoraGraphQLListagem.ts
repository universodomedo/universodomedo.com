'use client';

import { createContext, createElement, useCallback, useEffect, useMemo, useRef, useState, useContext, type ReactNode } from 'react';
import { ApiOperacaoGraphqlGet, EventosApiGraphqlV2, GraphqlFiltroConsultaCampoDef, GraphqlFiltroVisualizacaoCampoDef, GraphqlObjetoDeSelectDef, GraphqlResultado, GraphqlSelect, GraphqlSelectEntradaRuntime } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import type { ContextoFiltrosConsultaValor } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import type { ContextoFiltrosVisualizacaoValor } from 'Contextos/Contexto__Filtros/contexto';
import type { ListagemCompostaCarregarMaisProps, ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import useNoraGraphQLFiltroConsulta, { NoraGraphQLFiltroConsultaAtivo, NoraGraphQLFiltroConsultaWhere } from 'Hooks/useNoraGraphQLFiltroConsulta';
import useNoraGraphQLFiltroVisualizacao, { filtraCamposFiltroVisualizacaoPorSelect, NoraGraphQLFiltroVisualizacaoAtivo } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type NoraGraphQLOperacoesLeitura = typeof EventosApiGraphqlV2.obtem;

type NoraGraphQLOperacaoBase = ApiOperacaoGraphqlGet<Record<string, never>, object, object>;

type NoraGraphQLRespostaBruta<TOperacao extends NoraGraphQLOperacaoBase> = TOperacao extends { readonly __noraApiTipoResposta?: infer TResposta } ? TResposta extends object ? TResposta : object : object;

type UseNoraGraphQLListagemObjeto<TGraphql extends UseNoraGraphQLListagemContratoBase> = GraphqlObjetoDeSelectDef<TGraphql['select']>;

type UseNoraGraphQLListagemRegistro<TGraphql extends UseNoraGraphQLListagemContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TGraphql>>> = GraphqlResultado<UseNoraGraphQLListagemObjeto<TGraphql>, TSelect>;

export type UseNoraGraphQLListagemConsultaParams = {
    readonly where: NoraGraphQLFiltroConsultaWhere | null;
    readonly limit: number | null;
    readonly offset: number | null;
};

export type UseNoraGraphQLListagemCarregamento = keyof typeof NoraApiCarregamento;

export type UseNoraGraphQLListagemContratoBase = {
    readonly CamposFiltroConsulta: readonly GraphqlFiltroConsultaCampoDef<object>[];
    readonly CamposFiltroVisualizacao: readonly GraphqlFiltroVisualizacaoCampoDef<object>[];
    readonly select: { readonly __noraGraphqlObjeto?: object; };
};

export type UseNoraGraphQLListagemParams<TGraphql extends UseNoraGraphQLListagemContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TGraphql>>, TParametros extends object, TOperacaoRegistros extends NoraGraphQLOperacaoBase, TOperacaoTotalDeRegistros extends NoraGraphQLOperacaoBase> = {
    readonly graphql: TGraphql;
    readonly select: TSelect;
    readonly itensPorPagina: number;
    readonly carregando: string;
    readonly mensagemErro: string;
    readonly mensagemListaVazia: string;
    readonly mensagemListaVaziaComFiltro: string;
    readonly carregamento?: UseNoraGraphQLListagemCarregamento;
    readonly montaParametrosConsulta: (params: UseNoraGraphQLListagemConsultaParams) => TParametros;
    readonly montaParametrosTotalDeRegistros?: (where: NoraGraphQLFiltroConsultaWhere | null) => TParametros;
    readonly criaOperacao: (obtem: NoraGraphQLOperacoesLeitura, parametros: TParametros, select: TSelect) => TOperacaoRegistros;
    readonly criaOperacaoTotalDeRegistros: (obtem: NoraGraphQLOperacoesLeitura, parametros: TParametros) => TOperacaoTotalDeRegistros;
    readonly contador?: ReactNode;
    readonly acoes?: ReactNode;
    readonly rodape?: ReactNode;
};

export type UseNoraGraphQLListagemResultado<TRegistro extends object> = ListagemCompostaListagem<TRegistro>;

type UseNoraGraphQLListagemExtrasParams<TRegistro extends object> = {
    readonly listagem: UseNoraGraphQLListagemResultado<TRegistro>;
};

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

function obtemCarregamentoNoraApi(carregamento: UseNoraGraphQLListagemCarregamento | undefined): NoraApiCarregamento {
    if (!carregamento) return NoraApiCarregamento.BLOQUEIA_INTERFACE;

    return NoraApiCarregamento[carregamento];
};

function extraiListaRespostaGraphQL<TRegistro extends object>(resposta: object): readonly TRegistro[] {
    const valoresResposta = Object.values(resposta);

    if (valoresResposta.length === 0) throw new Error('Resposta GraphQL de listagem não possui nenhum campo de dados');
    if (valoresResposta.length > 1) throw new Error('Resposta GraphQL de listagem possui múltiplos campos de dados');

    const valorResposta = valoresResposta[0];

    if (!Array.isArray(valorResposta)) throw new Error('Resposta GraphQL de listagem não retornou uma lista');

    return valorResposta as readonly TRegistro[];
};

function extraiTotalDeRegistrosRespostaGraphQL(resposta: object): number {
    const respostaTipada = resposta as { readonly totalDeRegistros?: number };
    const totalDeRegistros = respostaTipada.totalDeRegistros;

    if (typeof totalDeRegistros !== 'number') throw new Error('Resposta GraphQL de totalDeRegistros não retornou um número');
    if (!Number.isFinite(totalDeRegistros)) throw new Error('Resposta GraphQL de totalDeRegistros retornou um número inválido');

    return totalDeRegistros;
};

function montaContadorPadrao(params: { readonly totalDeRegistros: number | null; readonly totalCarregado: number; readonly totalFiltrado: number; readonly possuiFiltroVisualizacao: boolean; readonly carregandoTotal: string | null; }): ReactNode {
    if (params.carregandoTotal && params.totalDeRegistros === null) return 'Calculando total de registros...';
    if (params.totalDeRegistros === null && params.possuiFiltroVisualizacao) return `${params.totalFiltrado} registros exibidos nesta lista · ${params.totalCarregado} carregados`;
    if (params.totalDeRegistros === null) return `${params.totalCarregado} registros exibidos`;
    if (params.possuiFiltroVisualizacao) return `${params.totalFiltrado} de ${params.totalDeRegistros} registros exibidos`;

    return `${params.totalCarregado} de ${params.totalDeRegistros} registros exibidos`;
};

function criaCarregarMais(params: { readonly podeCarregarMais: boolean; readonly carregando: string | null; readonly erro: string | null; readonly carregarMais: () => void; }): ListagemCompostaCarregarMaisProps {
    return {
        podeCarregarMais: params.podeCarregarMais,
        carregando: params.carregando,
        erro: params.erro,
        aoCarregarMais: params.carregarMais,
        textoBotao: 'Carregar mais',
        textoCarregando: 'Carregando mais registros...',
        textoEsgotado: 'Todos os registros encontrados já foram carregados.',
    };
};

function useNoraGraphQLListagemExtrasVazio<TRegistro extends object>(_: UseNoraGraphQLListagemExtrasParams<TRegistro>): Record<string, never> {
    return {};
};

export default function useNoraGraphQLListagem<const TGraphql extends UseNoraGraphQLListagemContratoBase, const TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TGraphql>>, TParametros extends object, const TOperacaoRegistros extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase, const TOperacaoTotalDeRegistros extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase>(params: UseNoraGraphQLListagemParams<TGraphql, TSelect, TParametros, TOperacaoRegistros, TOperacaoTotalDeRegistros>): UseNoraGraphQLListagemResultado<UseNoraGraphQLListagemRegistro<TGraphql, TSelect>> {
    type TObjeto = UseNoraGraphQLListagemObjeto<TGraphql>;
    type TRegistro = UseNoraGraphQLListagemRegistro<TGraphql, TSelect>;

    const [filtrosConsulta, setFiltrosConsulta] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [filtrosConsultaAplicados, setFiltrosConsultaAplicados] = useState<readonly NoraGraphQLFiltroConsultaAtivo[]>([]);
    const [versaoAplicacaoConsulta, setVersaoAplicacaoConsulta] = useState(0);
    const [filtrosVisualizacao, setFiltrosVisualizacao] = useState<readonly NoraGraphQLFiltroVisualizacaoAtivo[]>([]);
    const [offsetConsulta, setOffsetConsulta] = useState(0);
    const [versaoRequisicaoRegistros, setVersaoRequisicaoRegistros] = useState(0);
    const [versaoRequisicaoTotalDeRegistros, setVersaoRequisicaoTotalDeRegistros] = useState(0);
    const [registrosAcumulados, setRegistrosAcumulados] = useState<readonly TRegistro[]>([]);
    const [quantidadeUltimaPaginaRecebida, setQuantidadeUltimaPaginaRecebida] = useState(0);

    const offsetConsultaRef = useRef(offsetConsulta);
    const primeiraRequisicaoRegistrosRef = useRef(true);
    const primeiraRequisicaoTotalDeRegistrosRef = useRef(true);
    const primeiraAplicacaoConsultaRef = useRef(true);
    const ultimaDataRegistrosProcessadaRef = useRef<readonly TRegistro[] | null>(null);

    const itensPorPaginaNormalizado = normalizaItensPorPagina(params.itensPorPagina);
    const carregamento = obtemCarregamentoNoraApi(params.carregamento);
    const camposFiltroConsulta = params.graphql.CamposFiltroConsulta as readonly GraphqlFiltroConsultaCampoDef<TObjeto>[];
    const camposFiltroVisualizacaoContrato = params.graphql.CamposFiltroVisualizacao as readonly GraphqlFiltroVisualizacaoCampoDef<TObjeto>[];

    const resultadoFiltroConsulta = useNoraGraphQLFiltroConsulta({
        campos: camposFiltroConsulta,
        filtros: filtrosConsultaAplicados,
    });

    const parametrosConsultaRegistros = useMemo(() => {
        return params.montaParametrosConsulta({
            where: resultadoFiltroConsulta.where,
            limit: itensPorPaginaNormalizado,
            offset: offsetConsulta,
        });
    }, [itensPorPaginaNormalizado, offsetConsulta, params, resultadoFiltroConsulta.where]);

    const parametrosTotalDeRegistros = useMemo(() => {
        if (params.montaParametrosTotalDeRegistros) return params.montaParametrosTotalDeRegistros(resultadoFiltroConsulta.where);

        return params.montaParametrosConsulta({
            where: resultadoFiltroConsulta.where,
            limit: null,
            offset: null,
        });
    }, [params, resultadoFiltroConsulta.where]);

    const consultaRegistros = useNoraGraphQLConsulta(obtem => params.criaOperacao(obtem, parametrosConsultaRegistros, params.select), {
        valorInicial: [] as readonly TRegistro[],
        extrair: (resposta: NoraGraphQLRespostaBruta<TOperacaoRegistros>) => extraiListaRespostaGraphQL<TRegistro>(resposta),
        carregando: params.carregando,
        mensagemErro: params.mensagemErro,
        carregamento,
    });

    const consultaTotalDeRegistros = useNoraGraphQLConsulta(obtem => params.criaOperacaoTotalDeRegistros(obtem, parametrosTotalDeRegistros), {
        valorInicial: null as number | null,
        extrair: (resposta: NoraGraphQLRespostaBruta<TOperacaoTotalDeRegistros>) => extraiTotalDeRegistrosRespostaGraphQL(resposta),
        carregando: 'Calculando total de registros',
        mensagemErro: 'Houve um erro calculando o total de registros',
        carregamento,
    });

    const recarregarRegistrosRef = useRef(consultaRegistros.recarregar);
    const recarregarTotalDeRegistrosRef = useRef(consultaTotalDeRegistros.recarregar);

    const camposFiltroVisualizacao = useMemo(() => {
        return filtraCamposFiltroVisualizacaoPorSelect(params.select as GraphqlSelectEntradaRuntime, camposFiltroVisualizacaoContrato) as readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    }, [camposFiltroVisualizacaoContrato, params.select]);

    const resultadoFiltroVisualizacao = useNoraGraphQLFiltroVisualizacao({
        registros: registrosAcumulados,
        campos: camposFiltroVisualizacao,
        filtros: filtrosVisualizacao,
    });

    const possuiFiltroConsultaAtivo = filtrosConsulta.length > 0;
    const possuiFiltroConsultaAplicado = filtrosConsultaAplicados.length > 0;
    const possuiAlteracaoPendenteConsulta = !filtrosConsultaSaoIguais(filtrosConsulta, filtrosConsultaAplicados);
    const possuiFiltroAtivo = possuiFiltroConsultaAplicado || resultadoFiltroVisualizacao.possuiFiltroAtivo;
    const totalDeRegistros = consultaTotalDeRegistros.data;
    const totalCarregado = registrosAcumulados.length;
    const carregandoPrimeiraPagina = totalCarregado === 0 ? consultaRegistros.carregando : null;
    const carregandoMaisRegistros = totalCarregado > 0 ? consultaRegistros.carregando : null;
    const erroListagem = totalCarregado === 0 ? consultaRegistros.erro : null;
    const erroCarregarMais = totalCarregado > 0 ? consultaRegistros.erro : null;
    const podeCarregarMaisComTotal = totalDeRegistros !== null && totalCarregado < totalDeRegistros;
    const podeCarregarMaisSemTotal = totalDeRegistros === null && quantidadeUltimaPaginaRecebida >= itensPorPaginaNormalizado;
    const podeCarregarMais = !consultaRegistros.carregando && (podeCarregarMaisComTotal || podeCarregarMaisSemTotal);

    const aplicaFiltrosConsulta = useCallback(() => {
        setFiltrosConsultaAplicados(filtrosConsulta);
        setVersaoAplicacaoConsulta(versaoAtual => versaoAtual + 1);
    }, [filtrosConsulta]);

    const limpaFiltrosConsulta = useCallback(() => {
        setFiltrosConsulta([]);
        setFiltrosConsultaAplicados([]);
        setVersaoAplicacaoConsulta(versaoAtual => versaoAtual + 1);
    }, []);

    const carregarMais = useCallback(() => {
        if (!podeCarregarMais) return;

        setOffsetConsulta(totalCarregado);
        setVersaoRequisicaoRegistros(versaoAtual => versaoAtual + 1);
    }, [podeCarregarMais, totalCarregado]);

    const filtrosConsultaValor = useMemo<ContextoFiltrosConsultaValor<object>>(() => ({
        campos: camposFiltroConsulta,
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
    }), [aplicaFiltrosConsulta, camposFiltroConsulta, filtrosConsulta, filtrosConsultaAplicados, limpaFiltrosConsulta, possuiAlteracaoPendenteConsulta, possuiFiltroConsultaAplicado, possuiFiltroConsultaAtivo, resultadoFiltroConsulta.where, versaoAplicacaoConsulta]);

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
        offsetConsultaRef.current = offsetConsulta;
    }, [offsetConsulta]);

    useEffect(() => {
        recarregarRegistrosRef.current = consultaRegistros.recarregar;
    }, [consultaRegistros.recarregar]);

    useEffect(() => {
        recarregarTotalDeRegistrosRef.current = consultaTotalDeRegistros.recarregar;
    }, [consultaTotalDeRegistros.recarregar]);

    useEffect(() => {
        if (ultimaDataRegistrosProcessadaRef.current === consultaRegistros.data) return;

        ultimaDataRegistrosProcessadaRef.current = consultaRegistros.data;
        setQuantidadeUltimaPaginaRecebida(consultaRegistros.data.length);

        if (offsetConsultaRef.current <= 0) {
            setRegistrosAcumulados(consultaRegistros.data);
            return;
        }

        setRegistrosAcumulados(registrosAtuais => [...registrosAtuais, ...consultaRegistros.data]);
    }, [consultaRegistros.data]);

    useEffect(() => {
        if (primeiraRequisicaoRegistrosRef.current) {
            primeiraRequisicaoRegistrosRef.current = false;
            return;
        }

        recarregarRegistrosRef.current().catch(() => undefined);
    }, [versaoRequisicaoRegistros]);

    useEffect(() => {
        if (primeiraRequisicaoTotalDeRegistrosRef.current) {
            primeiraRequisicaoTotalDeRegistrosRef.current = false;
            return;
        }

        recarregarTotalDeRegistrosRef.current().catch(() => undefined);
    }, [versaoRequisicaoTotalDeRegistros]);

    useEffect(() => {
        if (primeiraAplicacaoConsultaRef.current) {
            primeiraAplicacaoConsultaRef.current = false;
            return;
        }

        setOffsetConsulta(0);
        setRegistrosAcumulados([]);
        setQuantidadeUltimaPaginaRecebida(0);
        setVersaoRequisicaoRegistros(versaoAtual => versaoAtual + 1);
        setVersaoRequisicaoTotalDeRegistros(versaoAtual => versaoAtual + 1);
    }, [versaoAplicacaoConsulta]);

    return {
        registros: resultadoFiltroVisualizacao.registrosFiltrados,
        carregando: carregandoPrimeiraPagina,
        erro: erroListagem,
        mensagemListaVazia: possuiFiltroAtivo ? params.mensagemListaVaziaComFiltro : params.mensagemListaVazia,
        filtrosConsulta: filtrosConsultaValor,
        filtrosVisualizacao: filtrosVisualizacaoValor,
        carregarMais: criaCarregarMais({ podeCarregarMais, carregando: carregandoMaisRegistros, erro: erroCarregarMais, carregarMais }),
        contador: params.contador ?? montaContadorPadrao({
            totalDeRegistros,
            totalCarregado,
            totalFiltrado: resultadoFiltroVisualizacao.totalFiltrado,
            possuiFiltroVisualizacao: resultadoFiltroVisualizacao.possuiFiltroAtivo,
            carregandoTotal: consultaTotalDeRegistros.carregando,
        }),
        acoes: params.acoes,
        rodape: params.rodape,
    };
};

export function criaContextoNoraGraphQLListagem<const TNomeListagem extends string, const TGraphql extends UseNoraGraphQLListagemContratoBase, const TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TGraphql>>, TParametros extends object, const TOperacaoRegistros extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase, const TOperacaoTotalDeRegistros extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase, TExtras extends object = Record<string, never>>(params: { readonly nomeListagem: TNomeListagem; readonly mensagemErroContexto: string; readonly listagem: UseNoraGraphQLListagemParams<TGraphql, TSelect, TParametros, TOperacaoRegistros, TOperacaoTotalDeRegistros>; readonly useExtras?: (params: UseNoraGraphQLListagemExtrasParams<UseNoraGraphQLListagemRegistro<TGraphql, TSelect>>) => TExtras; }) {
    type TRegistro = UseNoraGraphQLListagemRegistro<TGraphql, TSelect>;
    type TResultado = UseNoraGraphQLListagemResultado<TRegistro>;
    type TContextoBase = { readonly [TChave in TNomeListagem]: TResultado };
    type TContexto = TContextoBase & TExtras;

    const Contexto = createContext<TContexto | undefined>(undefined);
    const useExtras = (params.useExtras ?? useNoraGraphQLListagemExtrasVazio) as (params: UseNoraGraphQLListagemExtrasParams<TRegistro>) => TExtras;

    const useContexto = (): TContexto => {
        const context = useContext(Contexto);
        if (!context) throw new Error(params.mensagemErroContexto);

        return context;
    };
    
    const Provider = ({ children }: { readonly children: ReactNode; }) => {
        const listagem = useNoraGraphQLListagem(params.listagem);
        const extras = useExtras({ listagem });
        const value = useMemo<TContexto>(() => ({ [params.nomeListagem]: listagem, ...extras } as TContexto), [extras, listagem]);

        return createElement(Contexto.Provider, { value }, children);
    };

    return { Provider, useContexto } as const;
};