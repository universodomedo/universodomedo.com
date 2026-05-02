'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiOperacaoGraphqlGet, EventosApiGraphqlV2 } from 'types-nora-api';

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

type UseNoraGraphQLConsultaResultado<TResultado> = {
    readonly data: TResultado;
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly recarregar: () => Promise<TResultado>;
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