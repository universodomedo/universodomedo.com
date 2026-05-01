'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiOperacaoGraphqlGet, EventosApiGraphqlV2 } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';

type NoraGraphQLOperacoesLeitura = typeof EventosApiGraphqlV2.obtem;

type NoraGraphQLSelecionadorOperacao<TVariaveis extends object, TResposta extends object> = (obtem: NoraGraphQLOperacoesLeitura) => ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>;

type UseNoraGraphQLConsultaOpcoesBase<TResultado> = {
    readonly valorInicial: TResultado;
    readonly carregando: string;
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
    readonly executarAoMontar?: boolean;
    readonly limparDataAoFalhar?: boolean;
};

type UseNoraGraphQLConsultaOpcoesSemExtrair<TResposta extends object> = UseNoraGraphQLConsultaOpcoesBase<TResposta> & {
    readonly extrair?: undefined;
};

type UseNoraGraphQLConsultaOpcoesComExtrair<TResposta extends object, TResultado> = UseNoraGraphQLConsultaOpcoesBase<TResultado> & {
    readonly extrair: (resposta: TResposta) => TResultado;
};

type UseNoraGraphQLConsultaOpcoes<TResposta extends object, TResultado> = UseNoraGraphQLConsultaOpcoesSemExtrair<TResposta> | UseNoraGraphQLConsultaOpcoesComExtrair<TResposta, TResultado>;

type UseNoraGraphQLConsultaResultado<TResultado> = {
    readonly data: TResultado;
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly recarregar: () => Promise<TResultado>;
};

function resolveMensagemErroFallback(mensagemErro?: string): string {
    return mensagemErro ?? 'Erro desconhecido ao executar consulta GraphQL';
};

function resolveResultado<TResposta extends object, TResultado>(resposta: TResposta, opcoes: UseNoraGraphQLConsultaOpcoes<TResposta, TResultado>): TResposta | TResultado {
    if (opcoes.extrair) return opcoes.extrair(resposta);
    return resposta;
};

export default function useNoraGraphQLConsulta<TVariaveis extends object, TResposta extends object>(selecionaOperacao: NoraGraphQLSelecionadorOperacao<TVariaveis, TResposta>, opcoes: UseNoraGraphQLConsultaOpcoesSemExtrair<TResposta>): UseNoraGraphQLConsultaResultado<TResposta>;

export default function useNoraGraphQLConsulta<TVariaveis extends object, TResposta extends object, TResultado>(selecionaOperacao: NoraGraphQLSelecionadorOperacao<TVariaveis, TResposta>, opcoes: UseNoraGraphQLConsultaOpcoesComExtrair<TResposta, TResultado>): UseNoraGraphQLConsultaResultado<TResultado>;

export default function useNoraGraphQLConsulta<TVariaveis extends object, TResposta extends object, TResultado>(selecionaOperacao: NoraGraphQLSelecionadorOperacao<TVariaveis, TResposta>, opcoes: UseNoraGraphQLConsultaOpcoes<TResposta, TResultado>): UseNoraGraphQLConsultaResultado<TResposta | TResultado> {
    const [data, setData] = useState<TResposta | TResultado>(opcoes.valorInicial);
    const [carregando, setCarregando] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const selecionaOperacaoRef = useRef(selecionaOperacao);
    const opcoesRef = useRef(opcoes);
    const execucaoAtualRef = useRef(0);

    selecionaOperacaoRef.current = selecionaOperacao;
    opcoesRef.current = opcoes;

    const recarregar = useCallback(async (): Promise<TResposta | TResultado> => {
        const idExecucao = execucaoAtualRef.current + 1;
        execucaoAtualRef.current = idExecucao;

        setCarregando(opcoesRef.current.carregando);
        setErro(null);

        try {
            const operacao = selecionaOperacaoRef.current(EventosApiGraphqlV2.obtem);
            const resposta = await NoraApi.GraphQL(operacao, { mensagemErro: opcoesRef.current.mensagemErro, exibirToastErro: opcoesRef.current.exibirToastErro });
            const resultado = resolveResultado(resposta, opcoesRef.current);

            if (execucaoAtualRef.current !== idExecucao) return resultado;

            setData(resultado);

            return resultado;
        } catch {
            const mensagemErro = resolveMensagemErroFallback(opcoesRef.current.mensagemErro);

            if (execucaoAtualRef.current === idExecucao) {
                setErro(mensagemErro);
                if (opcoesRef.current.limparDataAoFalhar !== false) setData(opcoesRef.current.valorInicial);
            }

            throw new Error(mensagemErro);
        } finally {
            if (execucaoAtualRef.current === idExecucao) setCarregando(null);
        }
    }, []);

    useEffect(() => {
        if (opcoesRef.current.executarAoMontar === false) return;

        recarregar().catch(() => undefined);
    }, [recarregar]);

    return { data, carregando, erro, recarregar };
};