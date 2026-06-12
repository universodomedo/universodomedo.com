'use client';

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { ApiOperacaoGraphqlGet, GraphqlLeituraNome, GraphqlLeituraPorNome, GraphqlLeituras, GraphqlObjetoDeSelectDef, GraphqlObtemUmParametrosEntidadeRestrita, GraphqlResultado, GraphqlSelect } from 'types-nora-api';

import { montaMensagemErroNoraApiParaUsuario, NoraApi } from 'Api/NoraApi';
import { NORA_API_CARREGAMENTO_VISUAL } from 'Api/NoraApiCarregamentoVisual.const';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';

type NoraGraphQLOperacaoBase = ApiOperacaoGraphqlGet<Record<string, never>, object, object>;

type NoraGraphQLValorInicialPadrao = object | readonly object[] | null;

type NoraGraphQLRespostaBruta<TOperacao extends NoraGraphQLOperacaoBase> = TOperacao extends { readonly __noraApiTipoResposta?: infer TResposta } ? TResposta extends object ? TResposta : never : never;

type NoraGraphQLResultadoPadrao<TOperacao extends NoraGraphQLOperacaoBase> = NoraGraphQLRespostaBruta<TOperacao>[keyof NoraGraphQLRespostaBruta<TOperacao> & string];

type UseNoraGraphQLConsultaOpcoesBase = {
    readonly carregando: string;
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
    readonly executarAoMontar?: boolean;
    readonly limparDataAoFalhar?: boolean;
    readonly carregamento?: NoraApiCarregamento;
    readonly aguardarFinalizacaoVisual?: boolean;
    readonly lancarErroAoFalhar?: boolean;
};

type UseNoraGraphQLConsultaOpcoesSemExtrair = UseNoraGraphQLConsultaOpcoesBase & {
    readonly valorInicial: NoraGraphQLValorInicialPadrao;
    readonly extrair?: undefined;
};

type UseNoraGraphQLConsultaOpcoesComExtrair<TResposta extends object, TResultado> = UseNoraGraphQLConsultaOpcoesBase & {
    readonly valorInicial: TResultado;
    readonly extrair: (resposta: TResposta) => TResultado;
};

type UseNoraGraphQLConsultaOpcoes<TOperacao extends NoraGraphQLOperacaoBase, TResultado> = UseNoraGraphQLConsultaOpcoesSemExtrair | UseNoraGraphQLConsultaOpcoesComExtrair<NoraGraphQLRespostaBruta<TOperacao>, TResultado>;

export type UseNoraGraphQLConsultaResultado<TResultado> = {
    readonly data: TResultado;
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly recarregar: () => Promise<TResultado>;
};

export type UseNoraGraphQLConsultaCarregamento = keyof typeof NoraApiCarregamento;

export type UseNoraGraphQLConsultaContratoBase = {
    readonly select: { readonly __noraGraphqlObjeto?: object; };
};

type UseNoraGraphQLConsultaContrato<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> & UseNoraGraphQLConsultaContratoBase;

type UseNoraGraphQLConsultaObjeto<TNome extends GraphqlLeituraNome> = GraphqlObjetoDeSelectDef<UseNoraGraphQLConsultaContrato<TNome>['select']>;

type UseNoraGraphQLConsultaRegistro<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>> = GraphqlResultado<UseNoraGraphQLConsultaObjeto<TNome>, TSelect>;

type UseNoraGraphQLConsultaRegistroResultado<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>> = UseNoraGraphQLConsultaResultado<UseNoraGraphQLConsultaRegistro<TNome, TSelect> | null>;

type UseNoraGraphQLConsultaWhereTrie<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> extends { readonly CamposWhereTrie: infer TTrie } ? TTrie : never;

type UseNoraGraphQLConsultaOrderTrie<TNome extends GraphqlLeituraNome> = GraphqlLeituraPorNome<TNome> extends { readonly CamposOrderTrie: infer TTrie } ? TTrie : never;

type UseNoraGraphQLConsultaParametros<TNome extends GraphqlLeituraNome> = GraphqlObtemUmParametrosEntidadeRestrita<UseNoraGraphQLConsultaObjeto<TNome>, UseNoraGraphQLConsultaWhereTrie<TNome>, UseNoraGraphQLConsultaOrderTrie<TNome>>;

type UseNoraGraphQLConsultaEventoPorPK<TSelect extends object> = (definicao: { readonly id: number; readonly select: TSelect; }) => NoraGraphQLOperacaoBase;

type UseNoraGraphQLConsultaEventosPorPK<TSelect extends object> = {
    readonly porPK?: UseNoraGraphQLConsultaEventoPorPK<TSelect>;
    readonly obtemPorPK?: UseNoraGraphQLConsultaEventoPorPK<TSelect>;
};

type UseNoraGraphQLConsultaEventos<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>> = UseNoraGraphQLConsultaEventosPorPK<TSelect> & {
    readonly um: (definicao: { readonly parametros: UseNoraGraphQLConsultaParametros<TNome>; readonly select: TSelect; }) => NoraGraphQLOperacaoBase;
};

type UseNoraGraphQLConsultaContratoComEventos<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>> = UseNoraGraphQLConsultaContrato<TNome> & {
    readonly eventos: UseNoraGraphQLConsultaEventos<TNome, TSelect>;
};

type UseNoraGraphQLConsultaRegistroOpcoes<TSelect extends object> = {
    readonly select: TSelect;
    readonly carregando: string;
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
    readonly executarAoMontar?: boolean;
    readonly limparDataAoFalhar?: boolean;
    readonly carregamento?: UseNoraGraphQLConsultaCarregamento;
    readonly aguardarFinalizacaoVisual?: boolean;
    readonly lancarErroAoFalhar?: boolean;
};

type UseNoraGraphQLConsultaRegistroParamsPorPK<TSelect extends object, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroOpcoes<TSelect> & {
    readonly props: TProviderProps;
    readonly pk: number;
    readonly montaParametrosConsulta?: undefined;
};

type UseNoraGraphQLConsultaRegistroParamsPorConsulta<TNome extends GraphqlLeituraNome, TSelect extends object, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroOpcoes<TSelect> & {
    readonly props: TProviderProps;
    readonly pk?: undefined;
    readonly montaParametrosConsulta: (props: TProviderProps) => UseNoraGraphQLConsultaParametros<TNome>;
};

export type UseNoraGraphQLConsultaRegistroParams<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroParamsPorPK<TSelect, TProviderProps> | UseNoraGraphQLConsultaRegistroParamsPorConsulta<TNome, TSelect, TProviderProps>;

type UseNoraGraphQLConsultaRegistroDefPorPK<TSelect extends object, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroOpcoes<TSelect> & {
    readonly montaPK: (props: TProviderProps) => number;
    readonly montaParametrosConsulta?: undefined;
};

type UseNoraGraphQLConsultaRegistroDefPorConsulta<TNome extends GraphqlLeituraNome, TSelect extends object, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroOpcoes<TSelect> & {
    readonly montaPK?: undefined;
    readonly montaParametrosConsulta: (props: TProviderProps) => UseNoraGraphQLConsultaParametros<TNome>;
};

type UseNoraGraphQLConsultaRegistroDef<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object> = UseNoraGraphQLConsultaRegistroDefPorPK<TSelect, TProviderProps> | UseNoraGraphQLConsultaRegistroDefPorConsulta<TNome, TSelect, TProviderProps>;

type UseNoraGraphQLConsultaExtrasParams<TResult, TProviderProps extends object> = {
    readonly consulta: UseNoraGraphQLConsultaResultado<TResult>;
    readonly props: TProviderProps;
};

function registraAvisoControladoNoraGraphQLConsulta(mensagem: string, dados: object): void {
    console.warn(mensagem, dados);
};

function aguardaMs(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function deveAguardarFinalizacaoVisual(opcoes: UseNoraGraphQLConsultaOpcoesBase): boolean {
    if (opcoes.aguardarFinalizacaoVisual === false) return false;

    return opcoes.carregamento === NoraApiCarregamento.BLOQUEIA_INTERFACE;
};

async function aguardaFinalizacaoVisualSeNecessario(opcoes: UseNoraGraphQLConsultaOpcoesBase): Promise<void> {
    if (!deveAguardarFinalizacaoVisual(opcoes)) return;

    await aguardaMs(NORA_API_CARREGAMENTO_VISUAL.TEMPO_LIBERACAO_CONTEUDO_BLOQUEANTE_MS);
};

function deveLancarErroAoFalhar(opcoes: UseNoraGraphQLConsultaOpcoesBase): boolean {
    return opcoes.lancarErroAoFalhar === true;
};

function normalizaErroParaHook(erroCapturado: Error | null, mensagemErroPreferencial?: string): string {
    return montaMensagemErroNoraApiParaUsuario(erroCapturado, mensagemErroPreferencial);
};

function obtemAliasesRespostaGraphQL<TResposta extends object>(resposta: TResposta): (keyof TResposta & string)[] {
    return Object.keys(resposta) as (keyof TResposta & string)[];
};

function extraiResultadoPadraoGraphQL<TOperacao extends NoraGraphQLOperacaoBase>(operacao: TOperacao, resposta: NoraGraphQLRespostaBruta<TOperacao>): NoraGraphQLResultadoPadrao<TOperacao> {
    const aliases = obtemAliasesRespostaGraphQL(resposta);

    if (aliases.length === 0) throw new Error(`Resposta GraphQL da operação ${operacao.nome} não possui nenhum campo de data para extrair automaticamente`);
    if (aliases.length > 1) throw new Error(`Resposta GraphQL da operação ${operacao.nome} possui múltiplos campos (${aliases.join(', ')}). Informe extrair explicitamente no useNoraGraphQLConsulta`);

    const alias = aliases[0];
    if (!alias) throw new Error(`Resposta GraphQL da operação ${operacao.nome} retornou alias inválido`);

    const resultado = resposta[alias];

    if (resultado === undefined) throw new Error(`Resposta GraphQL da operação ${operacao.nome} não retornou valor para o alias ${alias}`);

    return resultado;
};

function resolveResultado<TOperacao extends NoraGraphQLOperacaoBase, TResultado>(operacao: TOperacao, resposta: NoraGraphQLRespostaBruta<TOperacao>, opcoes: UseNoraGraphQLConsultaOpcoes<TOperacao, TResultado>): NoraGraphQLResultadoPadrao<TOperacao> | TResultado {
    if (opcoes.extrair) return opcoes.extrair(resposta);

    return extraiResultadoPadraoGraphQL(operacao, resposta);
};

function converteValorInicialPadrao<TOperacao extends NoraGraphQLOperacaoBase, TResultado>(valorInicial: NoraGraphQLValorInicialPadrao | TResultado): NoraGraphQLResultadoPadrao<TOperacao> | TResultado {
    return valorInicial as NoraGraphQLResultadoPadrao<TOperacao> | TResultado;
};

function obtemCarregamentoNoraApi(carregamento: UseNoraGraphQLConsultaCarregamento | undefined): NoraApiCarregamento | undefined {
    if (!carregamento) return undefined;

    return NoraApiCarregamento[carregamento];
};

function useNoraGraphQLConsultaExtrasVazio<TResult, TProviderProps extends object>(_: UseNoraGraphQLConsultaExtrasParams<TResult, TProviderProps>): Record<string, never> {
    return {};
};

function obtemEventoPorPK<TSelect extends object>(eventos: UseNoraGraphQLConsultaEventosPorPK<TSelect>): UseNoraGraphQLConsultaEventoPorPK<TSelect> {
    if (eventos.porPK) return eventos.porPK;
    if (eventos.obtemPorPK) return eventos.obtemPorPK;

    throw new Error('Contrato GraphQL não expõe operação de seleção por PK. Gere novamente os contratos e confirme se a leitura possui operação por PK.');
};

function montaOperacaoRegistro<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object>(graphql: UseNoraGraphQLConsultaContratoComEventos<TNome, TSelect>, params: UseNoraGraphQLConsultaRegistroParams<TNome, TSelect, TProviderProps>): NoraGraphQLOperacaoBase {
    if (params.pk !== undefined) return obtemEventoPorPK(graphql.eventos)({ id: params.pk, select: params.select });

    return graphql.eventos.um({ parametros: params.montaParametrosConsulta(params.props), select: params.select });
};

function montaRegistroParamsPorDef<TNome extends GraphqlLeituraNome, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object>(definicao: UseNoraGraphQLConsultaRegistroDef<TNome, TSelect, TProviderProps>, props: TProviderProps): UseNoraGraphQLConsultaRegistroParams<TNome, TSelect, TProviderProps> {
    if (definicao.montaPK) {
        return {
            props,
            select: definicao.select,
            pk: definicao.montaPK(props),
            carregando: definicao.carregando,
            mensagemErro: definicao.mensagemErro,
            exibirToastErro: definicao.exibirToastErro,
            executarAoMontar: definicao.executarAoMontar,
            limparDataAoFalhar: definicao.limparDataAoFalhar,
            carregamento: definicao.carregamento,
            aguardarFinalizacaoVisual: definicao.aguardarFinalizacaoVisual,
            lancarErroAoFalhar: definicao.lancarErroAoFalhar,
        };
    }

    return {
        props,
        select: definicao.select,
        montaParametrosConsulta: definicao.montaParametrosConsulta,
        carregando: definicao.carregando,
        mensagemErro: definicao.mensagemErro,
        exibirToastErro: definicao.exibirToastErro,
        executarAoMontar: definicao.executarAoMontar,
        limparDataAoFalhar: definicao.limparDataAoFalhar,
        carregamento: definicao.carregamento,
        aguardarFinalizacaoVisual: definicao.aguardarFinalizacaoVisual,
        lancarErroAoFalhar: definicao.lancarErroAoFalhar,
    };
};

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase>(selecionaOperacao: () => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoesSemExtrair): UseNoraGraphQLConsultaResultado<NoraGraphQLResultadoPadrao<TOperacao>>;

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase, TResultado>(selecionaOperacao: () => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoesComExtrair<NoraGraphQLRespostaBruta<TOperacao>, TResultado>): UseNoraGraphQLConsultaResultado<TResultado>;

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase, TResultado>(selecionaOperacao: () => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoes<TOperacao, TResultado>): UseNoraGraphQLConsultaResultado<NoraGraphQLResultadoPadrao<TOperacao> | TResultado> {
    const [data, setData] = useState<NoraGraphQLResultadoPadrao<TOperacao> | TResultado>(converteValorInicialPadrao<TOperacao, TResultado>(opcoes.valorInicial));
    const [carregando, setCarregando] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const selecionaOperacaoRef = useRef(selecionaOperacao);
    const opcoesRef = useRef(opcoes);
    const execucaoAtualRef = useRef(0);

    selecionaOperacaoRef.current = selecionaOperacao;
    opcoesRef.current = opcoes;

    const recarregar = useCallback(async (): Promise<NoraGraphQLResultadoPadrao<TOperacao> | TResultado> => {
        const idExecucao = execucaoAtualRef.current + 1;
        execucaoAtualRef.current = idExecucao;

        setCarregando(opcoesRef.current.carregando);
        setErro(null);

        try {
            const operacao = selecionaOperacaoRef.current();
            const resposta = await NoraApi.GraphQL(operacao, { mensagemErro: opcoesRef.current.mensagemErro, exibirToastErro: opcoesRef.current.exibirToastErro, carregamento: opcoesRef.current.carregamento }) as NoraGraphQLRespostaBruta<TOperacao>;
            const resultado = resolveResultado(operacao, resposta, opcoesRef.current);

            await aguardaFinalizacaoVisualSeNecessario(opcoesRef.current);

            if (execucaoAtualRef.current !== idExecucao) return resultado;

            setData(resultado);

            return resultado;
        } catch (erroCapturado) {
            const erro = erroCapturado instanceof Error ? erroCapturado : null;
            const mensagemErro = normalizaErroParaHook(erro, opcoesRef.current.mensagemErro);
            const valorInicial = converteValorInicialPadrao<TOperacao, TResultado>(opcoesRef.current.valorInicial);

            registraAvisoControladoNoraGraphQLConsulta('[useNoraGraphQLConsulta][ERRO_CONTROLADO]', { erro: erro?.message ?? 'Erro desconhecido ao executar consulta GraphQL', mensagemExibida: mensagemErro });

            await aguardaFinalizacaoVisualSeNecessario(opcoesRef.current);

            if (execucaoAtualRef.current === idExecucao) {
                setErro(mensagemErro);
                if (opcoesRef.current.limparDataAoFalhar !== false) setData(valorInicial);
            }

            if (deveLancarErroAoFalhar(opcoesRef.current)) throw erro ?? new Error(mensagemErro);

            return valorInicial;
        } finally {
            if (execucaoAtualRef.current === idExecucao) setCarregando(null);
        }
    }, []);

    useEffect(() => {
        if (opcoesRef.current.executarAoMontar === false) return;

        recarregar().catch(erroCapturado => {
            const erro = erroCapturado instanceof Error ? erroCapturado : null;
            registraAvisoControladoNoraGraphQLConsulta('[useNoraGraphQLConsulta][ERRO_CONTROLADO_AO_MONTAR]', { erro: erro?.message ?? 'Erro desconhecido ao montar consulta GraphQL' });
        });
    }, [recarregar]);

    return { data, carregando, erro, recarregar };
};

export function useNoraGraphQLRegistro<const TNome extends GraphqlLeituraNome, const TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object>(nomeLeitura: TNome, params: UseNoraGraphQLConsultaRegistroParams<TNome, TSelect, TProviderProps>): UseNoraGraphQLConsultaRegistroResultado<TNome, TSelect> {
    type TResultado = UseNoraGraphQLConsultaRegistro<TNome, TSelect> | null;

    const graphql = GraphqlLeituras[nomeLeitura] as UseNoraGraphQLConsultaContratoComEventos<TNome, TSelect>;

    return useNoraGraphQLConsulta(() => montaOperacaoRegistro(graphql, params), {
        valorInicial: null as TResultado,
        carregando: params.carregando,
        mensagemErro: params.mensagemErro,
        exibirToastErro: params.exibirToastErro,
        executarAoMontar: params.executarAoMontar,
        limparDataAoFalhar: params.limparDataAoFalhar,
        carregamento: obtemCarregamentoNoraApi(params.carregamento),
        aguardarFinalizacaoVisual: params.aguardarFinalizacaoVisual,
        lancarErroAoFalhar: params.lancarErroAoFalhar,
    }) as UseNoraGraphQLConsultaRegistroResultado<TNome, TSelect>;
};

export function criaContextoNoraGraphQLConsulta<const TNomeConsulta extends string, const TNome extends GraphqlLeituraNome, const TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TNome>>, TProviderProps extends object, TExtras extends object = Record<string, never>>(params: { readonly nomeLeitura: TNome; readonly nomeConsulta: TNomeConsulta; readonly mensagemErroContexto: string; readonly renderiza: ComponentType; readonly mensagemRegistroNaoEncontrado?: string; readonly consulta: UseNoraGraphQLConsultaRegistroDef<TNome, TSelect, TProviderProps>; readonly useExtras?: (params: UseNoraGraphQLConsultaExtrasParams<UseNoraGraphQLConsultaRegistro<TNome, TSelect> | null, TProviderProps>) => TExtras; }) {
    type TResultado = UseNoraGraphQLConsultaRegistro<TNome, TSelect>;
    type TConsulta = UseNoraGraphQLConsultaResultado<TResultado | null>;
    type TContextoBase = { readonly [TChave in TNomeConsulta]: TResultado };
    type TContexto = TContextoBase & TExtras;

    const Contexto = createContext<TContexto | undefined>(undefined);
    const useExtras = (params.useExtras ?? useNoraGraphQLConsultaExtrasVazio) as (params: UseNoraGraphQLConsultaExtrasParams<TResultado | null, TProviderProps>) => TExtras;

    const useContexto = (): TContexto => {
        const context = useContext(Contexto);
        if (!context) throw new Error(params.mensagemErroContexto);

        return context;
    };

    const Provider = (props: TProviderProps) => {
        const consultaParams = montaRegistroParamsPorDef(params.consulta, props);
        const consulta: TConsulta = useNoraGraphQLRegistro(params.nomeLeitura, consultaParams);
        const extras = useExtras({ consulta, props });
        const value = useMemo<TContexto>(() => ({ [params.nomeConsulta]: consulta.data as TResultado, ...extras } as TContexto), [consulta.data, extras]);

        if (consulta.carregando) return createElement('div', null, consulta.carregando);
        if (consulta.erro) return createElement('div', null, consulta.erro);
        if (!consulta.data) return createElement('div', null, params.mensagemRegistroNaoEncontrado ?? 'Registro não encontrado.');

        return createElement(Contexto.Provider, { value }, createElement(params.renderiza));
    };

    return { Provider, useContexto } as const;
};