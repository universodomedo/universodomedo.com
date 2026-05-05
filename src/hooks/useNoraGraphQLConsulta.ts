'use client';

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { ApiOperacaoGraphqlGet, EventosApiGraphqlV2, GraphqlObjetoDeSelectDef, GraphqlResultado, GraphqlSelect } from 'types-nora-api';

import { montaMensagemErroNoraApiParaUsuario, NoraApi } from 'Api/NoraApi';
import { NORA_API_CARREGAMENTO_VISUAL } from 'Api/NoraApiCarregamentoVisual.const';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';

type NoraGraphQLOperacoesLeitura = typeof EventosApiGraphqlV2.obtem;

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

type UseNoraGraphQLConsultaObjeto<TGraphql extends UseNoraGraphQLConsultaContratoBase> = GraphqlObjetoDeSelectDef<TGraphql['select']>;

type UseNoraGraphQLConsultaRegistro<TGraphql extends UseNoraGraphQLConsultaContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>> = GraphqlResultado<UseNoraGraphQLConsultaObjeto<TGraphql>, TSelect>;

type UseNoraGraphQLConsultaRegistroResultado<TGraphql extends UseNoraGraphQLConsultaContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>> = UseNoraGraphQLConsultaResultado<UseNoraGraphQLConsultaRegistro<TGraphql, TSelect> | null>;

export type UseNoraGraphQLConsultaRegistroParams<TGraphql extends UseNoraGraphQLConsultaContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>, TProviderProps extends object, TOperacao extends NoraGraphQLOperacaoBase> = {
    readonly graphql: TGraphql;
    readonly props: TProviderProps;
    readonly select: TSelect;
    readonly carregando: string;
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
    readonly executarAoMontar?: boolean;
    readonly limparDataAoFalhar?: boolean;
    readonly carregamento?: UseNoraGraphQLConsultaCarregamento;
    readonly aguardarFinalizacaoVisual?: boolean;
    readonly lancarErroAoFalhar?: boolean;
    readonly criaOperacao: (obtem: NoraGraphQLOperacoesLeitura, props: TProviderProps, select: TSelect) => TOperacao;
};

type UseNoraGraphQLConsultaRegistroDef<TGraphql extends UseNoraGraphQLConsultaContratoBase, TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>, TProviderProps extends object, TOperacao extends NoraGraphQLOperacaoBase> = Omit<UseNoraGraphQLConsultaRegistroParams<TGraphql, TSelect, TProviderProps, TOperacao>, 'props'>;

type UseNoraGraphQLConsultaExtrasParams<TResultado, TProviderProps extends object> = {
    readonly consulta: UseNoraGraphQLConsultaResultado<TResultado>;
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

function useNoraGraphQLConsultaExtrasVazio<TResultado, TProviderProps extends object>(_: UseNoraGraphQLConsultaExtrasParams<TResultado, TProviderProps>): Record<string, never> {
    return {};
};

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase>(selecionaOperacao: (obtem: NoraGraphQLOperacoesLeitura) => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoesSemExtrair): UseNoraGraphQLConsultaResultado<NoraGraphQLResultadoPadrao<TOperacao>>;

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase, TResultado>(selecionaOperacao: (obtem: NoraGraphQLOperacoesLeitura) => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoesComExtrair<NoraGraphQLRespostaBruta<TOperacao>, TResultado>): UseNoraGraphQLConsultaResultado<TResultado>;

export default function useNoraGraphQLConsulta<const TOperacao extends NoraGraphQLOperacaoBase, TResultado>(selecionaOperacao: (obtem: NoraGraphQLOperacoesLeitura) => TOperacao, opcoes: UseNoraGraphQLConsultaOpcoes<TOperacao, TResultado>): UseNoraGraphQLConsultaResultado<NoraGraphQLResultadoPadrao<TOperacao> | TResultado> {
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
            const operacao = selecionaOperacaoRef.current(EventosApiGraphqlV2.obtem);
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

export function useNoraGraphQLRegistro<const TGraphql extends UseNoraGraphQLConsultaContratoBase, const TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>, TProviderProps extends object, const TOperacao extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase>(params: UseNoraGraphQLConsultaRegistroParams<TGraphql, TSelect, TProviderProps, TOperacao>): UseNoraGraphQLConsultaRegistroResultado<TGraphql, TSelect> {
    type TResultado = UseNoraGraphQLConsultaRegistro<TGraphql, TSelect> | null;

    return useNoraGraphQLConsulta(obtem => params.criaOperacao(obtem, params.props, params.select), {
        valorInicial: null as TResultado,
        carregando: params.carregando,
        mensagemErro: params.mensagemErro,
        exibirToastErro: params.exibirToastErro,
        executarAoMontar: params.executarAoMontar,
        limparDataAoFalhar: params.limparDataAoFalhar,
        carregamento: obtemCarregamentoNoraApi(params.carregamento),
        aguardarFinalizacaoVisual: params.aguardarFinalizacaoVisual,
        lancarErroAoFalhar: params.lancarErroAoFalhar,
    }) as UseNoraGraphQLConsultaRegistroResultado<TGraphql, TSelect>;
};

export function criaContextoNoraGraphQLConsulta<const TNomeConsulta extends string, const TGraphql extends UseNoraGraphQLConsultaContratoBase, const TSelect extends GraphqlSelect<UseNoraGraphQLConsultaObjeto<TGraphql>>, TProviderProps extends object, const TOperacao extends NoraGraphQLOperacaoBase = NoraGraphQLOperacaoBase, TExtras extends object = Record<string, never>>(params: { readonly nomeConsulta: TNomeConsulta; readonly mensagemErroContexto: string; readonly renderiza: ComponentType; readonly mensagemRegistroNaoEncontrado?: string; readonly consulta: UseNoraGraphQLConsultaRegistroDef<TGraphql, TSelect, TProviderProps, TOperacao>; readonly useExtras?: (params: UseNoraGraphQLConsultaExtrasParams<UseNoraGraphQLConsultaRegistro<TGraphql, TSelect> | null, TProviderProps>) => TExtras; }) {
    type TResultado = UseNoraGraphQLConsultaRegistro<TGraphql, TSelect>;
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
        const consulta: TConsulta = useNoraGraphQLRegistro({ ...params.consulta, props });
        const extras = useExtras({ consulta, props });
        const value = useMemo<TContexto>(() => ({ [params.nomeConsulta]: consulta.data as TResultado, ...extras } as TContexto), [consulta.data, extras]);

        if (consulta.carregando) return createElement('div', null, consulta.carregando);
        if (consulta.erro) return createElement('div', null, consulta.erro);
        if (!consulta.data) return createElement('div', null, params.mensagemRegistroNaoEncontrado ?? 'Registro não encontrado.');

        return createElement(Contexto.Provider, { value }, createElement(params.renderiza));
    };

    return { Provider, useContexto } as const;
};