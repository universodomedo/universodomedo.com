'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiOperacaoGraphqlGet, ApiOperacaoRestGet, ApiRespostaGraphql, ApiTransporte } from 'types-nora-api';

type UseApiResultado<TParametros extends object, TResposta extends object> = {
    data: TResposta | null;
    carregando: boolean;
    erro: string | null;
    executar: (parametros: TParametros, opcoesExecucao?: UseApiOpcoesExecucao<TResposta>) => Promise<TResposta>;
};

type UseApiOpcoes<TParametros extends object, TResposta extends object> = {
    disparoInicial?: TParametros;
    onSuccess?: (data: TResposta) => void;
    onError?: (erro: string) => void;
};

type UseApiOpcoesExecucao<TResposta extends object> = {
    onSuccess?: (data: TResposta) => void;
    onError?: (erro: string) => void;
};

type ApiOperacaoSuportada<TParametros extends object, TVariaveis extends object, TResposta extends object> = ApiOperacaoGraphqlGet<TParametros, TVariaveis, TResposta> | ApiOperacaoRestGet<TParametros, TResposta>;

type ApiOperacaoErroLog = {
    nome: string;
    nomeOperacaoGraphql: string;
};

function montaUrlApi(endpoint: string): string {
    const urlBaseApi = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    return `${urlBaseApi}${endpoint}`;
};

function montaMensagemErroGraphql<TResposta extends object>(operacao: ApiOperacaoErroLog, dados: ApiRespostaGraphql<TResposta>): string {
    if (!dados.errors?.length) return `Resposta GraphQL inválida para operação ${operacao.nome}`;
    return dados.errors.map(erroGraphql => `${erroGraphql.message}${erroGraphql.path?.length ? ` | path=${erroGraphql.path.join('.')}` : ''}`).join(' | ');
};

async function executaGraphql<TParametros extends object, TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<TParametros, TVariaveis, TResposta>, parametros: TParametros): Promise<TResposta> {
    const url = montaUrlApi(operacao.endpoint);
    const variables = operacao.montaVariaveis(parametros);
    const resposta = await fetch(url, { method: operacao.metodoHttp, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operationName: operacao.nomeOperacaoGraphql, query: operacao.query, variables }) });

    if (!resposta.ok) {
        console.error('[useApi][GraphQL][HTTP_ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, status: resposta.status, parametros, variables });
        throw new Error(`Falha HTTP ao chamar GraphQL: ${resposta.status} em ${url}`);
    }

    const dados = await resposta.json() as ApiRespostaGraphql<TResposta>;

    if (dados.errors?.length) {
        console.error('[useApi][GraphQL][ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, parametros, variables, errors: dados.errors, data: dados.data ?? null });
        throw new Error(montaMensagemErroGraphql(operacao, dados));
    }

    if (!dados.data) {
        console.error('[useApi][GraphQL][SEM_DATA]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, parametros, variables, resposta: dados });
        throw new Error(`Resposta GraphQL não retornou data para operação ${operacao.nome}`);
    }

    return dados.data;
};

async function executaRest<TParametros extends object, TResposta extends object>(operacao: ApiOperacaoRestGet<TParametros, TResposta>, parametros: TParametros): Promise<TResposta> {
    const queryString = operacao.montaQueryString(parametros);
    const url = `${montaUrlApi(operacao.endpoint)}${queryString}`;
    const resposta = await fetch(url, { method: operacao.metodoHttp, headers: { 'Content-Type': 'application/json' } });

    if (!resposta.ok) {
        console.error('[useApi][REST][HTTP_ERRO]', { operacao: operacao.nome, url, status: resposta.status, parametros });
        throw new Error(`Falha HTTP ao chamar REST: ${resposta.status} em ${url}`);
    }

    return await resposta.json() as TResposta;
};

export default function useApi<TParametros extends object, TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta>, opcoes?: UseApiOpcoes<TParametros, TResposta>): UseApiResultado<TParametros, TResposta> {
    const [data, setData] = useState<TResposta | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const opcoesRef = useRef<UseApiOpcoes<TParametros, TResposta> | null>(null);
    const disparoInicialExecutadoRef = useRef(false);

    opcoesRef.current = opcoes ?? null;

    const executar = useCallback(async (parametros: TParametros, opcoesExecucao?: UseApiOpcoesExecucao<TResposta>): Promise<TResposta> => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = operacao.transporte === ApiTransporte.GRAPHQL ? await executaGraphql(operacao, parametros) : await executaRest(operacao, parametros);

            setData(resposta);
            opcoesRef.current?.onSuccess?.(resposta);
            opcoesExecucao?.onSuccess?.(resposta);

            return resposta;
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao chamar API';

            console.error('[useApi][ERRO_CAPTURADO]', { operacao: operacao.nome, transporte: operacao.transporte, parametros, erro: mensagemErro });

            setData(null);
            setErro(mensagemErro);
            opcoesRef.current?.onError?.(mensagemErro);
            opcoesExecucao?.onError?.(mensagemErro);

            throw new Error(mensagemErro);
        } finally {
            setCarregando(false);
        }
    }, [operacao]);

    useEffect(() => {
        if (!opcoes?.disparoInicial) return;
        if (disparoInicialExecutadoRef.current) return;

        disparoInicialExecutadoRef.current = true;
        executar(opcoes.disparoInicial).catch(() => undefined);
    }, [executar, opcoes?.disparoInicial]);

    return { data, carregando, erro, executar };
};