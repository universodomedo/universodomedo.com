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

type ApiOperacaoFactory<TDefinicao extends object, TVariaveis extends object, TResposta extends object> = (definicao: TDefinicao) => ApiOperacaoSuportada<Record<string, never>, TVariaveis, TResposta>;

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

function ehApiOperacaoFactory<TDefinicao extends object, TParametros extends object, TVariaveis extends object, TResposta extends object>(entrada: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta> | ApiOperacaoFactory<TDefinicao, TVariaveis, TResposta>): entrada is ApiOperacaoFactory<TDefinicao, TVariaveis, TResposta> {
    return typeof entrada === 'function';
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

async function executaOperacao<TParametros extends object, TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta>, parametros: TParametros): Promise<TResposta> {
    return operacao.transporte === ApiTransporte.GRAPHQL ? await executaGraphql(operacao, parametros) : await executaRest(operacao, parametros);
};

export default function useApi<const TDefinicao extends object, TVariaveis extends object, TResposta extends object>(entrada: ApiOperacaoFactory<TDefinicao, TVariaveis, TResposta>, opcoes?: UseApiOpcoes<TDefinicao, TResposta>): UseApiResultado<TDefinicao, TResposta>;

export default function useApi<TParametros extends object, TVariaveis extends object, TResposta extends object>(entrada: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta>, opcoes?: UseApiOpcoes<TParametros, TResposta>): UseApiResultado<TParametros, TResposta>;

export default function useApi<const TEntrada extends object, TParametros extends object, TVariaveis extends object, TResposta extends object>(entrada: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta> | ApiOperacaoFactory<TEntrada, TVariaveis, TResposta>, opcoes?: UseApiOpcoes<TEntrada | TParametros, TResposta>): UseApiResultado<TEntrada | TParametros, TResposta> {
    const [data, setData] = useState<TResposta | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const opcoesRef = useRef<UseApiOpcoes<TEntrada | TParametros, TResposta> | null>(null);
    const disparoInicialExecutadoRef = useRef(false);

    opcoesRef.current = opcoes ?? null;

    const executar = useCallback(async (parametros: TEntrada | TParametros, opcoesExecucao?: UseApiOpcoesExecucao<TResposta>): Promise<TResposta> => {
        setCarregando(true);
        setErro(null);

        let nomeOperacaoLog = typeof entrada === 'function' ? 'factory' : entrada.nome;
        let transporteOperacaoLog: ApiTransporte | 'FACTORY' = typeof entrada === 'function' ? 'FACTORY' : entrada.transporte;

        try {
            const resposta = ehApiOperacaoFactory<TEntrada, TParametros, TVariaveis, TResposta>(entrada)
                ? await (() => {
                    const operacao = entrada(parametros as TEntrada);
                    nomeOperacaoLog = operacao.nome;
                    transporteOperacaoLog = operacao.transporte;
                    return executaOperacao(operacao, {});
                })()
                : await (() => {
                    nomeOperacaoLog = entrada.nome;
                    transporteOperacaoLog = entrada.transporte;
                    return executaOperacao(entrada, parametros as TParametros);
                })();

            setData(resposta);
            opcoesRef.current?.onSuccess?.(resposta);
            opcoesExecucao?.onSuccess?.(resposta);

            return resposta;
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao chamar API';

            console.error('[useApi][ERRO_CAPTURADO]', { operacao: nomeOperacaoLog, transporte: transporteOperacaoLog, parametros, erro: mensagemErro });

            setData(null);
            setErro(mensagemErro);
            opcoesRef.current?.onError?.(mensagemErro);
            opcoesExecucao?.onError?.(mensagemErro);

            throw new Error(mensagemErro);
        } finally {
            setCarregando(false);
        }
    }, [entrada]);

    useEffect(() => {
        if (!opcoes?.disparoInicial) return;
        if (disparoInicialExecutadoRef.current) return;

        disparoInicialExecutadoRef.current = true;
        executar(opcoes.disparoInicial).catch(() => undefined);
    }, [executar, opcoes?.disparoInicial]);

    return { data, carregando, erro, executar };
};