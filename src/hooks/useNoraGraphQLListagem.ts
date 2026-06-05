'use client';

import { createContext, createElement, useCallback, useEffect, useMemo, useRef, useState, useContext, type ReactNode } from 'react';
import { ApiOperacaoGraphqlGet, GraphqlFiltroConsultaCampoDef, GraphqlFiltroControleVisualizacao, GraphqlFiltroVisualizacaoCampoDef, GraphqlLeituraNome, GraphqlLeituraPorNome, GraphqlLeituras, GraphqlObjetoDeSelectDef, GraphqlObtemVariosParametrosEntidade, GraphqlOpcoesFiltroConsultaCampo, GraphqlOpcoesFiltrosConsultaParametros, GraphqlResultado, GraphqlSelect, GraphqlSelectEntradaRuntime, GraphqlSelectNormalizadoObjeto, GraphqlSelectRuntime, GraphqlTotalDeRegistrosParametrosEntidade, normalizaSelectGraphql } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import type { ContextoFiltrosConsultaValor } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import type { ContextoFiltrosVisualizacaoValor } from 'Contextos/Contexto__Filtros/contexto';
import type { ListagemCompostaCarregarMaisProps, ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import useNoraGraphQLFiltroConsulta, { NoraGraphQLFiltroConsultaAtivo } from 'Hooks/useNoraGraphQLFiltroConsulta';
import useNoraGraphQLFiltroVisualizacao, { NoraGraphQLFiltroVisualizacaoAtivo } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type NoraGraphQLOperacaoBase = ApiOperacaoGraphqlGet<Record<string, never>, object, object>;

export type UseNoraGraphQLListagemContratoBase = {
    readonly CamposFiltroConsulta: readonly GraphqlFiltroConsultaCampoDef<object>[];
    readonly CamposFiltroVisualizacao: readonly GraphqlFiltroVisualizacaoCampoDef<object>[];
    readonly select: { readonly __noraGraphqlObjeto?: object; };
};

type UseNoraGraphQLListagemContrato<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> & UseNoraGraphQLListagemContratoBase;

type UseNoraGraphQLListagemObjeto<TNome extends GraphqlLeituraNome> = GraphqlObjetoDeSelectDef<UseNoraGraphQLListagemContrato<TNome>['select']>;

type UseNoraGraphQLListagemRegistro<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = GraphqlResultado<UseNoraGraphQLListagemObjeto<TNome>, TSelect>;

type UseNoraGraphQLListagemParametrosConsulta<TNome extends GraphqlLeituraNome> = GraphqlObtemVariosParametrosEntidade<UseNoraGraphQLListagemObjeto<TNome>>;

type UseNoraGraphQLListagemParametrosTotalDeRegistros<TNome extends GraphqlLeituraNome> = GraphqlTotalDeRegistrosParametrosEntidade<UseNoraGraphQLListagemObjeto<TNome>>;

type UseNoraGraphQLListagemParametrosOpcoesFiltrosConsulta<TNome extends GraphqlLeituraNome> = GraphqlOpcoesFiltrosConsultaParametros<UseNoraGraphQLListagemObjeto<TNome>, string>;

type UseNoraGraphQLListagemWhereGraphql<TNome extends GraphqlLeituraNome> = UseNoraGraphQLListagemParametrosConsulta<TNome>['where'];

type UseNoraGraphQLListagemEventos<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = {
    readonly varios: (definicao: { readonly parametros: UseNoraGraphQLListagemParametrosConsulta<TNome>; readonly select: TSelect; }) => NoraGraphQLOperacaoBase;
    readonly totalDeRegistros: (definicao: { readonly parametros: UseNoraGraphQLListagemParametrosTotalDeRegistros<TNome>; }) => NoraGraphQLOperacaoBase;
    readonly opcoesFiltrosConsulta: (definicao: { readonly parametros: UseNoraGraphQLListagemParametrosOpcoesFiltrosConsulta<TNome>; }) => NoraGraphQLOperacaoBase;
};

type UseNoraGraphQLListagemContratoComEventos<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = UseNoraGraphQLListagemContrato<TNome> & {
    readonly eventos: UseNoraGraphQLListagemEventos<TNome, TSelect>;
};

const LIMITE_MAXIMO_REGISTROS_CONSULTA_GRAPHQL = 100;

type UseNoraGraphQLListagemCampoFiltroDef<TCampo extends string = string, TPath extends readonly string[] = readonly string[]> = {
    readonly campo: TCampo;
    readonly path: TPath;
};

type UseNoraGraphQLListagemSelectNormalizado<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = GraphqlSelectNormalizadoObjeto<UseNoraGraphQLListagemObjeto<TNome>, TSelect>;

type UseNoraGraphQLListagemSelectContemPath<TSelect, TPath extends readonly string[]> = TPath extends readonly [infer THead extends string, ...infer TRest extends readonly string[]] ? THead extends keyof TSelect ? TSelect[THead] extends true ? true : TRest extends readonly [] ? true : TSelect[THead] extends object ? UseNoraGraphQLListagemSelectContemPath<TSelect[THead], TRest> : false : false : true;

type UseNoraGraphQLListagemCampoFiltroSelecionado<TSelectNormalizado, TCampoFiltro> = TCampoFiltro extends UseNoraGraphQLListagemCampoFiltroDef<infer TCampo, infer TPath> ? UseNoraGraphQLListagemSelectContemPath<TSelectNormalizado, TPath> extends true ? TCampo : never : never;

type UseNoraGraphQLListagemCamposFiltroConsultaContrato<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> extends { readonly CamposFiltroConsulta: infer TCampos extends readonly UseNoraGraphQLListagemCampoFiltroDef[] } ? TCampos[number] : never;

type UseNoraGraphQLListagemCamposFiltroVisualizacaoContrato<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> extends { readonly CamposFiltroVisualizacao: infer TCampos extends readonly UseNoraGraphQLListagemCampoFiltroDef[] } ? TCampos[number] : never;

type UseNoraGraphQLListagemWhereFixo<TNome extends GraphqlLeituraNome> = UseNoraGraphQLListagemWhereGraphql<TNome>;

export type UseNoraGraphQLListagemCampoFiltroConsulta<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = UseNoraGraphQLListagemCampoFiltroSelecionado<UseNoraGraphQLListagemSelectNormalizado<TNome, TSelect>, UseNoraGraphQLListagemCamposFiltroConsultaContrato<TNome>>;

export type UseNoraGraphQLListagemCampoFiltroVisualizacao<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = UseNoraGraphQLListagemCampoFiltroSelecionado<UseNoraGraphQLListagemSelectNormalizado<TNome, TSelect>, UseNoraGraphQLListagemCamposFiltroVisualizacaoContrato<TNome>>;

export type UseNoraGraphQLListagemConsultaParams<TNome extends GraphqlLeituraNome> = {
    readonly where: UseNoraGraphQLListagemWhereGraphql<TNome>;
    readonly limit: number | null;
    readonly offset: number | null;
};

export type UseNoraGraphQLListagemCarregamento = keyof typeof NoraApiCarregamento;

export type UseNoraGraphQLListagemParams<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>> = {
    readonly select: TSelect;
    readonly whereFixo?: UseNoraGraphQLListagemWhereFixo<NoInfer<TNome>>;
    readonly camposFiltroConsulta?: readonly UseNoraGraphQLListagemCampoFiltroConsulta<NoInfer<TNome>, NoInfer<TSelect>>[];
    readonly camposFiltroVisualizacao?: readonly UseNoraGraphQLListagemCampoFiltroVisualizacao<NoInfer<TNome>, NoInfer<TSelect>>[];
    readonly itensPorPagina: number;
    readonly carregando: string;
    readonly mensagemErro: string;
    readonly mensagemListaVazia: string;
    readonly mensagemListaVaziaComFiltro: string;
    readonly carregamento?: UseNoraGraphQLListagemCarregamento;
    readonly montaParametrosConsulta: (params: UseNoraGraphQLListagemConsultaParams<TNome>) => UseNoraGraphQLListagemParametrosConsulta<TNome>;
    readonly montaParametrosTotalDeRegistros?: (where: UseNoraGraphQLListagemWhereGraphql<TNome>) => UseNoraGraphQLListagemParametrosTotalDeRegistros<TNome>;
    readonly contador?: ReactNode;
    readonly acoes?: ReactNode;
    readonly rodape?: ReactNode;
};

export type UseNoraGraphQLListagemResultado<TRegistro extends object> = ListagemCompostaListagem<TRegistro> & {
    readonly recarregar: () => void;
};

type UseNoraGraphQLListagemExtrasParams<TRegistro extends object> = {
    readonly listagem: UseNoraGraphQLListagemResultado<TRegistro>;
};

type CampoFiltroComNomeEPath = {
    readonly campo: string;
    readonly path: readonly string[];
};

type FiltroAtivoComCampo = {
    readonly campo: string;
};

type WhereListagemEscalar = string | number | boolean | Date | null;

type WhereListagemValor = WhereListagemEscalar | readonly WhereListagemEscalar[] | WhereListagemObjeto;

type WhereListagemObjeto = object;

type WhereListagemInput = WhereListagemObjeto | readonly WhereListagemObjeto[] | null | undefined;

type WhereListagemOutput = WhereListagemObjeto | readonly WhereListagemObjeto[] | undefined;

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

    return Math.min(Math.floor(itensPorPagina), LIMITE_MAXIMO_REGISTROS_CONSULTA_GRAPHQL);
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

function extraiOpcoesFiltrosConsultaRespostaGraphQL(resposta: object): readonly GraphqlOpcoesFiltroConsultaCampo[] {
    const valoresResposta = Object.values(resposta);

    if (valoresResposta.length === 0) throw new Error('Resposta GraphQL de opções de filtros não possui nenhum campo de dados');
    if (valoresResposta.length > 1) throw new Error('Resposta GraphQL de opções de filtros possui múltiplos campos de dados');

    const valorResposta = valoresResposta[0];

    if (!Array.isArray(valorResposta)) throw new Error('Resposta GraphQL de opções de filtros não retornou uma lista');

    return valorResposta as readonly GraphqlOpcoesFiltroConsultaCampo[];
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

function selectContemPath(selectRuntime: GraphqlSelectRuntime, path: readonly string[]): boolean {
    let selectAtual: true | GraphqlSelectRuntime | undefined = selectRuntime;

    for (const parte of path) {
        if (selectAtual === true) return true;
        if (!selectAtual) return false;

        selectAtual = selectAtual[parte];
    }

    return selectAtual !== undefined;
};

function filtraCamposFiltroPorSelect<TCampo extends CampoFiltroComNomeEPath>(select: GraphqlSelectEntradaRuntime, campos: readonly TCampo[]): readonly TCampo[] {
    const selectRuntime = normalizaSelectGraphql(select);

    return campos.filter(campo => selectContemPath(selectRuntime, campo.path));
};

function filtraCamposFiltroPorNomesPermitidos<TCampo extends CampoFiltroComNomeEPath>(campos: readonly TCampo[], nomesPermitidos: readonly string[] | undefined): readonly TCampo[] {
    if (!nomesPermitidos) return campos;
    if (nomesPermitidos.length === 0) return [];

    const nomesPermitidosSet = new Set<string>(nomesPermitidos);

    return campos.filter(campo => nomesPermitidosSet.has(campo.campo));
};

function filtraCamposFiltroDisponiveis<TCampo extends CampoFiltroComNomeEPath>(select: GraphqlSelectEntradaRuntime, campos: readonly TCampo[], nomesPermitidos: readonly string[] | undefined): readonly TCampo[] {
    return filtraCamposFiltroPorNomesPermitidos(filtraCamposFiltroPorSelect(select, campos), nomesPermitidos);
};

function filtraFiltrosAtivosPorCamposDisponiveis<TFiltro extends FiltroAtivoComCampo>(filtros: readonly TFiltro[], campos: readonly CampoFiltroComNomeEPath[]): readonly TFiltro[] {
    if (filtros.length === 0) return filtros;

    const camposDisponiveisSet = new Set<string>(campos.map(campo => campo.campo));
    const filtrosDisponiveis = filtros.filter(filtro => camposDisponiveisSet.has(filtro.campo));

    if (filtrosDisponiveis.length === filtros.length) return filtros;

    return filtrosDisponiveis;
};

function campoConsultaPrecisaDeOpcoesRemotas(campo: GraphqlFiltroConsultaCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.MULTISELECT;
};

function criaAssinaturaCamposOpcoesFiltrosConsulta(campos: readonly GraphqlFiltroConsultaCampoDef<object>[]): string {
    return campos.map(campo => campo.campo).sort().join('|');
};

function useNoraGraphQLListagemExtrasVazio<TRegistro extends object>(_: UseNoraGraphQLListagemExtrasParams<TRegistro>): Record<string, never> {
    void _;
    return {};
};

function whereListagemEhLista(where: Exclude<WhereListagemInput, null | undefined>): where is readonly WhereListagemObjeto[] {
    return Array.isArray(where);
};

function normalizaWhereListagem(where: WhereListagemInput): readonly WhereListagemObjeto[] {
    if (where === null || where === undefined) return [];
    if (whereListagemEhLista(where)) return where;

    return [where];
};

function obtemCamposWhereListagem(where: WhereListagemObjeto): readonly string[] {
    return Object.keys(where);
};

function obtemValorWhereListagem(where: WhereListagemObjeto, campo: string): WhereListagemValor | undefined {
    const whereIndexado = where as { readonly [campo: string]: WhereListagemValor | undefined };

    return whereIndexado[campo];
};

function valorWhereListagemEhObjetoComposto(valor: WhereListagemValor | undefined): valor is WhereListagemObjeto {
    if (valor === undefined) return false;
    if (valor === null) return false;
    if (valor instanceof Date) return false;
    if (Array.isArray(valor)) return false;

    return typeof valor === 'object';
};

function whereObjetoEhVazio(where: WhereListagemObjeto): boolean {
    for (const campo of obtemCamposWhereListagem(where)) {
        const valor = obtemValorWhereListagem(where, campo);

        if (valor === undefined) continue;
        if (valorWhereListagemEhObjetoComposto(valor) && whereObjetoEhVazio(valor)) continue;

        return false;
    }

    return true;
};

function mesclaObjetoWhereListagem(whereAtual: WhereListagemObjeto, whereNovo: WhereListagemObjeto): WhereListagemObjeto {
    const resultado: { [campo: string]: WhereListagemValor | undefined } = {};

    for (const campo of obtemCamposWhereListagem(whereAtual)) {
        resultado[campo] = obtemValorWhereListagem(whereAtual, campo);
    }

    for (const campo of obtemCamposWhereListagem(whereNovo)) {
        const valorAtual = resultado[campo];
        const valorNovo = obtemValorWhereListagem(whereNovo, campo);

        if (valorNovo === undefined) continue;

        if (valorWhereListagemEhObjetoComposto(valorAtual) && valorWhereListagemEhObjetoComposto(valorNovo)) {
            resultado[campo] = mesclaObjetoWhereListagem(valorAtual, valorNovo);
            continue;
        }

        resultado[campo] = valorNovo;
    }

    return resultado;
};

function combinaListaWhereListagem(wheresFixo: readonly WhereListagemObjeto[], wheresDinamico: readonly WhereListagemObjeto[]): readonly WhereListagemObjeto[] {
    if (wheresFixo.length === 0) return wheresDinamico;
    if (wheresDinamico.length === 0) return wheresFixo;

    const wheresCombinados: WhereListagemObjeto[] = [];

    for (const whereFixo of wheresFixo) {
        for (const whereDinamico of wheresDinamico) {
            wheresCombinados.push(mesclaObjetoWhereListagem(whereFixo, whereDinamico));
        }
    }

    return wheresCombinados;
};

function combinaWhereListagem(whereFixo: WhereListagemInput, whereDinamico: WhereListagemInput): WhereListagemOutput {
    const wheresFixo = normalizaWhereListagem(whereFixo);
    const wheresDinamico = normalizaWhereListagem(whereDinamico);
    const wheresCombinados = combinaListaWhereListagem(wheresFixo, wheresDinamico).filter(where => !whereObjetoEhVazio(where));

    if (wheresCombinados.length === 0) return undefined;
    if (wheresCombinados.length === 1) return wheresCombinados[0];

    return wheresCombinados;
};

export default function useNoraGraphQLListagem<const TNome extends GraphqlLeituraNome, const TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>>(nomeLeitura: TNome, params: UseNoraGraphQLListagemParams<TNome, TSelect>): UseNoraGraphQLListagemResultado<UseNoraGraphQLListagemRegistro<TNome, TSelect>> {
    type TObjeto = UseNoraGraphQLListagemObjeto<TNome>;
    type TRegistro = UseNoraGraphQLListagemRegistro<TNome, TSelect>;

    const graphql = GraphqlLeituras[nomeLeitura] as UseNoraGraphQLListagemContratoComEventos<TNome, TSelect>;

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
    const primeiraRequisicaoOpcoesFiltrosConsultaRef = useRef(true);
    const primeiraAplicacaoConsultaRef = useRef(true);
    const ultimaDataRegistrosProcessadaRef = useRef<readonly TRegistro[] | null>(null);

    const itensPorPaginaNormalizado = normalizaItensPorPagina(params.itensPorPagina);
    const carregamento = obtemCarregamentoNoraApi(params.carregamento);
    const camposFiltroConsultaContrato = graphql.CamposFiltroConsulta as readonly GraphqlFiltroConsultaCampoDef<TObjeto>[];
    const camposFiltroVisualizacaoContrato = graphql.CamposFiltroVisualizacao as readonly GraphqlFiltroVisualizacaoCampoDef<TObjeto>[];

    const camposFiltroConsulta = useMemo(() => {
        return filtraCamposFiltroDisponiveis(params.select as GraphqlSelectEntradaRuntime, camposFiltroConsultaContrato, params.camposFiltroConsulta) as readonly GraphqlFiltroConsultaCampoDef<TObjeto>[];
    }, [camposFiltroConsultaContrato, params.camposFiltroConsulta, params.select]);

    const camposFiltroVisualizacao = useMemo(() => {
        return filtraCamposFiltroDisponiveis(params.select as GraphqlSelectEntradaRuntime, camposFiltroVisualizacaoContrato, params.camposFiltroVisualizacao) as readonly GraphqlFiltroVisualizacaoCampoDef<TRegistro>[];
    }, [camposFiltroVisualizacaoContrato, params.camposFiltroVisualizacao, params.select]);

    const camposOpcoesFiltrosConsulta = useMemo(() => {
        return camposFiltroConsulta.filter(campo => campoConsultaPrecisaDeOpcoesRemotas(campo as GraphqlFiltroConsultaCampoDef<object>)) as readonly GraphqlFiltroConsultaCampoDef<TObjeto>[];
    }, [camposFiltroConsulta]);

    const assinaturaCamposOpcoesFiltrosConsulta = useMemo(() => criaAssinaturaCamposOpcoesFiltrosConsulta(camposOpcoesFiltrosConsulta as readonly GraphqlFiltroConsultaCampoDef<object>[]), [camposOpcoesFiltrosConsulta]);

    const filtrosConsultaDisponiveis = useMemo(() => {
        return filtraFiltrosAtivosPorCamposDisponiveis(filtrosConsulta, camposFiltroConsulta);
    }, [camposFiltroConsulta, filtrosConsulta]);

    const filtrosConsultaAplicadosDisponiveis = useMemo(() => {
        return filtraFiltrosAtivosPorCamposDisponiveis(filtrosConsultaAplicados, camposFiltroConsulta);
    }, [camposFiltroConsulta, filtrosConsultaAplicados]);

    const filtrosVisualizacaoDisponiveis = useMemo(() => {
        return filtraFiltrosAtivosPorCamposDisponiveis(filtrosVisualizacao, camposFiltroVisualizacao);
    }, [camposFiltroVisualizacao, filtrosVisualizacao]);

    const resultadoFiltroConsulta = useNoraGraphQLFiltroConsulta({
        campos: camposFiltroConsulta,
        filtros: filtrosConsultaAplicadosDisponiveis,
    });

    const whereConsultaComEscopoFixo = useMemo<UseNoraGraphQLListagemWhereGraphql<TNome>>(() => {
        return combinaWhereListagem(params.whereFixo, resultadoFiltroConsulta.where) as UseNoraGraphQLListagemWhereGraphql<TNome>;
    }, [params.whereFixo, resultadoFiltroConsulta.where]);

    const parametrosConsultaRegistros = useMemo<UseNoraGraphQLListagemParametrosConsulta<TNome>>(() => {
        return params.montaParametrosConsulta({
            where: whereConsultaComEscopoFixo,
            limit: itensPorPaginaNormalizado,
            offset: offsetConsulta,
        });
    }, [itensPorPaginaNormalizado, offsetConsulta, params, whereConsultaComEscopoFixo]);

    const parametrosTotalDeRegistros = useMemo<UseNoraGraphQLListagemParametrosTotalDeRegistros<TNome>>(() => {
        if (params.montaParametrosTotalDeRegistros) return params.montaParametrosTotalDeRegistros(whereConsultaComEscopoFixo);

        return params.montaParametrosConsulta({
            where: whereConsultaComEscopoFixo,
            limit: null,
            offset: null,
        }) as UseNoraGraphQLListagemParametrosTotalDeRegistros<TNome>;
    }, [params, whereConsultaComEscopoFixo]);

    const parametrosOpcoesFiltrosConsulta = useMemo<UseNoraGraphQLListagemParametrosOpcoesFiltrosConsulta<TNome>>(() => {
        return {
            campos: camposOpcoesFiltrosConsulta.map(campo => campo.campo),
            where: whereConsultaComEscopoFixo,
            limitePorCampo: LIMITE_MAXIMO_REGISTROS_CONSULTA_GRAPHQL,
        };
    }, [camposOpcoesFiltrosConsulta, whereConsultaComEscopoFixo]);

    const consultaRegistros = useNoraGraphQLConsulta(() => graphql.eventos.varios({ parametros: parametrosConsultaRegistros, select: params.select }), {
        valorInicial: [] as readonly TRegistro[],
        extrair: resposta => extraiListaRespostaGraphQL<TRegistro>(resposta),
        carregando: params.carregando,
        mensagemErro: params.mensagemErro,
        carregamento,
    });

    const consultaTotalDeRegistros = useNoraGraphQLConsulta(() => graphql.eventos.totalDeRegistros({ parametros: parametrosTotalDeRegistros }), {
        valorInicial: null as number | null,
        extrair: resposta => extraiTotalDeRegistrosRespostaGraphQL(resposta),
        carregando: 'Calculando total de registros',
        mensagemErro: 'Houve um erro calculando o total de registros',
        carregamento,
    });

    const consultaOpcoesFiltrosConsulta = useNoraGraphQLConsulta(() => graphql.eventos.opcoesFiltrosConsulta({ parametros: parametrosOpcoesFiltrosConsulta }), {
        valorInicial: [] as readonly GraphqlOpcoesFiltroConsultaCampo[],
        extrair: resposta => extraiOpcoesFiltrosConsultaRespostaGraphQL(resposta),
        carregando: 'Buscando opções de filtros',
        mensagemErro: 'Houve um erro recuperando as opções de filtros',
        executarAoMontar: camposOpcoesFiltrosConsulta.length > 0,
        limparDataAoFalhar: false,
        carregamento,
    });

    const recarregarRegistrosRef = useRef(consultaRegistros.recarregar);
    const recarregarTotalDeRegistrosRef = useRef(consultaTotalDeRegistros.recarregar);
    const recarregarOpcoesFiltrosConsultaRef = useRef(consultaOpcoesFiltrosConsulta.recarregar);

    const resultadoFiltroVisualizacao = useNoraGraphQLFiltroVisualizacao({
        registros: registrosAcumulados,
        campos: camposFiltroVisualizacao,
        filtros: filtrosVisualizacaoDisponiveis,
    });

    const possuiFiltroConsultaAtivo = filtrosConsultaDisponiveis.length > 0;
    const possuiFiltroConsultaAplicado = filtrosConsultaAplicadosDisponiveis.length > 0;
    const possuiAlteracaoPendenteConsulta = !filtrosConsultaSaoIguais(filtrosConsultaDisponiveis, filtrosConsultaAplicadosDisponiveis);
    const possuiAcaoConsultaDisponivel = possuiFiltroConsultaAtivo || possuiAlteracaoPendenteConsulta;
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
        setFiltrosConsultaAplicados(filtrosConsultaDisponiveis);
        setVersaoAplicacaoConsulta(versaoAtual => versaoAtual + 1);
    }, [filtrosConsultaDisponiveis]);

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

    const recarregar = useCallback(() => {
        setOffsetConsulta(0);
        setRegistrosAcumulados([]);
        setQuantidadeUltimaPaginaRecebida(0);
        ultimaDataRegistrosProcessadaRef.current = null;
        setVersaoRequisicaoRegistros(versaoAtual => versaoAtual + 1);
        setVersaoRequisicaoTotalDeRegistros(versaoAtual => versaoAtual + 1);

        if (assinaturaCamposOpcoesFiltrosConsulta.length > 0) recarregarOpcoesFiltrosConsultaRef.current().catch(() => undefined);
    }, [assinaturaCamposOpcoesFiltrosConsulta]);

    const filtrosConsultaValor = useMemo<ContextoFiltrosConsultaValor<object>>(() => ({
        campos: camposFiltroConsulta,
        filtros: filtrosConsultaDisponiveis,
        filtrosAplicados: filtrosConsultaAplicadosDisponiveis,
        setFiltros: setFiltrosConsulta,
        where: resultadoFiltroConsulta.where,
        possuiFiltroAtivo: possuiFiltroConsultaAtivo,
        possuiFiltroAplicado: possuiFiltroConsultaAplicado,
        possuiAlteracaoPendente: possuiAcaoConsultaDisponivel,
        versaoAplicacao: versaoAplicacaoConsulta,
        aplicaFiltros: aplicaFiltrosConsulta,
        limpaFiltros: limpaFiltrosConsulta,
        opcoesPorCampo: consultaOpcoesFiltrosConsulta.data,
    }), [aplicaFiltrosConsulta, camposFiltroConsulta, consultaOpcoesFiltrosConsulta.data, filtrosConsultaAplicadosDisponiveis, filtrosConsultaDisponiveis, limpaFiltrosConsulta, possuiAcaoConsultaDisponivel, possuiFiltroConsultaAplicado, possuiFiltroConsultaAtivo, resultadoFiltroConsulta.where, versaoAplicacaoConsulta]);

    const filtrosVisualizacaoValor = useMemo<ContextoFiltrosVisualizacaoValor<TRegistro>>(() => ({
        registrosOriginais: resultadoFiltroVisualizacao.registrosOriginais,
        registrosFiltrados: resultadoFiltroVisualizacao.registrosFiltrados,
        campos: camposFiltroVisualizacao,
        filtros: filtrosVisualizacaoDisponiveis,
        setFiltros: setFiltrosVisualizacao,
        totalOriginal: resultadoFiltroVisualizacao.totalOriginal,
        totalFiltrado: resultadoFiltroVisualizacao.totalFiltrado,
        possuiFiltroAtivo: resultadoFiltroVisualizacao.possuiFiltroAtivo,
    }), [camposFiltroVisualizacao, filtrosVisualizacaoDisponiveis, resultadoFiltroVisualizacao.possuiFiltroAtivo, resultadoFiltroVisualizacao.registrosFiltrados, resultadoFiltroVisualizacao.registrosOriginais, resultadoFiltroVisualizacao.totalFiltrado, resultadoFiltroVisualizacao.totalOriginal]);

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
        recarregarOpcoesFiltrosConsultaRef.current = consultaOpcoesFiltrosConsulta.recarregar;
    }, [consultaOpcoesFiltrosConsulta.recarregar]);

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
        if (assinaturaCamposOpcoesFiltrosConsulta.length === 0) return;

        if (primeiraRequisicaoOpcoesFiltrosConsultaRef.current) {
            primeiraRequisicaoOpcoesFiltrosConsultaRef.current = false;
            return;
        }

        recarregarOpcoesFiltrosConsultaRef.current().catch(() => undefined);
    }, [assinaturaCamposOpcoesFiltrosConsulta, versaoAplicacaoConsulta]);

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
        recarregar,
    };
};

export function criaContextoNoraGraphQLListagem<const TNomeListagem extends string, const TNome extends GraphqlLeituraNome, const TSelect extends GraphqlSelect<UseNoraGraphQLListagemObjeto<TNome>>>(params: { readonly nomeLeitura: TNome; readonly nomeListagem: TNomeListagem; readonly mensagemErroContexto: string; readonly listagem: UseNoraGraphQLListagemParams<TNome, TSelect>; readonly useExtras?: (params: UseNoraGraphQLListagemExtrasParams<UseNoraGraphQLListagemRegistro<TNome, TSelect>>) => object; }) {
    type TRegistro = UseNoraGraphQLListagemRegistro<TNome, TSelect>;
    type TResultado = UseNoraGraphQLListagemResultado<TRegistro>;
    type TContextoBase = { readonly [TChave in TNomeListagem]: TResultado };
    type TContexto = TContextoBase & object;

    const Contexto = createContext<TContexto | undefined>(undefined);
    const useExtras = (params.useExtras ?? useNoraGraphQLListagemExtrasVazio) as (params: UseNoraGraphQLListagemExtrasParams<TRegistro>) => object;

    const useContexto = (): TContexto => {
        const context = useContext(Contexto);
        if (!context) throw new Error(params.mensagemErroContexto);

        return context;
    };

    const Provider = ({ children }: { readonly children: ReactNode; }) => {
        const listagem = useNoraGraphQLListagem(params.nomeLeitura, params.listagem);
        const extras = useExtras({ listagem });
        const value = useMemo<TContexto>(() => ({ [params.nomeListagem]: listagem, ...extras } as TContexto), [extras, listagem]);

        return createElement(Contexto.Provider, { value }, children);
    };

    return { Provider, useContexto } as const;
};