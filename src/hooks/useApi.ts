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

type ApiRespostaHttpFalha = {
    status: number;
    statusText: string;
    url: string;
    corpoTexto: string;
};

function montaUrlApi(endpoint: string): string {
    const urlBaseApi = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    return `${urlBaseApi}${endpoint}`;
};

function limitaTextoErro(texto: string): string {
    if (texto.length <= 3000) return texto;
    return `${texto.substring(0, 3000)}... [corpo truncado]`;
};

function stringifySeguro(valor: object): string {
    try {
        return JSON.stringify(valor);
    } catch {
        return '[valor não serializável]';
    }
};

function montaDetalheErroGraphql<TResposta extends object>(dados: ApiRespostaGraphql<TResposta>): string {
    if (!dados.errors?.length) return 'sem lista de errors no corpo GraphQL';

    return dados.errors.map(erroGraphql => {
        const path = erroGraphql.path?.length ? ` | path=${erroGraphql.path.join('.')}` : '';
        const extensions = erroGraphql.extensions ? ` | extensions=${stringifySeguro(erroGraphql.extensions)}` : '';

        return `${erroGraphql.message}${path}${extensions}`;
    }).join(' || ');
};

function tentaLerRespostaGraphql<TResposta extends object>(corpoTexto: string): ApiRespostaGraphql<TResposta> | null {
    if (!corpoTexto.trim()) return null;

    try {
        return JSON.parse(corpoTexto) as ApiRespostaGraphql<TResposta>;
    } catch {
        return null;
    }
};

async function leRespostaHttpFalha(resposta: Response, url: string): Promise<ApiRespostaHttpFalha> {
    const corpoTexto = await resposta.text().catch(() => '[falha ao ler corpo da resposta HTTP]');

    return {
        status: resposta.status,
        statusText: resposta.statusText,
        url,
        corpoTexto,
    };
};

function montaMensagemErroGraphql<TResposta extends object>(operacao: ApiOperacaoErroLog, dados: ApiRespostaGraphql<TResposta>): string {
    return `Erro GraphQL na operação ${operacao.nome}/${operacao.nomeOperacaoGraphql}: ${montaDetalheErroGraphql(dados)}`;
};

function montaMensagemErroHttpGraphql<TResposta extends object>(operacao: ApiOperacaoErroLog, falha: ApiRespostaHttpFalha, dados: ApiRespostaGraphql<TResposta> | null): string {
    const detalheGraphql = dados ? montaDetalheErroGraphql(dados) : null;
    const detalheCorpo = detalheGraphql ?? limitaTextoErro(falha.corpoTexto || '[resposta sem corpo]');

    return `Falha HTTP ao chamar GraphQL: status=${falha.status} ${falha.statusText || ''} endpoint=${falha.url} operação=${operacao.nome}/${operacao.nomeOperacaoGraphql} detalhe=${detalheCorpo}`;
};

function montaMensagemErroHttpRest(operacao: { nome: string }, falha: ApiRespostaHttpFalha): string {
    return `Falha HTTP ao chamar REST: status=${falha.status} ${falha.statusText || ''} endpoint=${falha.url} operação=${operacao.nome} detalhe=${limitaTextoErro(falha.corpoTexto || '[resposta sem corpo]')}`;
};

function ehApiOperacaoFactory<TDefinicao extends object, TParametros extends object, TVariaveis extends object, TResposta extends object>(entrada: ApiOperacaoSuportada<TParametros, TVariaveis, TResposta> | ApiOperacaoFactory<TDefinicao, TVariaveis, TResposta>): entrada is ApiOperacaoFactory<TDefinicao, TVariaveis, TResposta> {
    return typeof entrada === 'function';
};

async function executaGraphql<TParametros extends object, TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<TParametros, TVariaveis, TResposta>, parametros: TParametros): Promise<TResposta> {
    const url = montaUrlApi(operacao.endpoint);
    const variables = operacao.montaVariaveis(parametros);
    const body = JSON.stringify({ operationName: operacao.nomeOperacaoGraphql, query: operacao.query, variables });
    const resposta = await fetch(url, { method: operacao.metodoHttp, headers: { 'Content-Type': 'application/json' }, body });

    if (!resposta.ok) {
        const falha = await leRespostaHttpFalha(resposta, url);
        const dados = tentaLerRespostaGraphql<TResposta>(falha.corpoTexto);

        console.error('[useApi][GraphQL][HTTP_ERRO]', {
            operacao: operacao.nome,
            operationName: operacao.nomeOperacaoGraphql,
            url,
            status: falha.status,
            statusText: falha.statusText,
            parametros,
            variables,
            query: operacao.query,
            responseBody: falha.corpoTexto,
            graphqlErrors: dados?.errors ?? null,
            graphqlData: dados?.data ?? null,
        });

        throw new Error(montaMensagemErroHttpGraphql(operacao, falha, dados));
    }

    const corpoTexto = await resposta.text();
    const dados = tentaLerRespostaGraphql<TResposta>(corpoTexto);

    if (!dados) {
        console.error('[useApi][GraphQL][JSON_INVALIDO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, parametros, variables, query: operacao.query, responseBody: corpoTexto });
        throw new Error(`Resposta GraphQL não retornou JSON válido para operação ${operacao.nome}/${operacao.nomeOperacaoGraphql}: ${limitaTextoErro(corpoTexto || '[resposta sem corpo]')}`);
    }

    if (dados.errors?.length) {
        console.error('[useApi][GraphQL][ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, parametros, variables, query: operacao.query, errors: dados.errors, data: dados.data ?? null, responseBody: corpoTexto });
        throw new Error(montaMensagemErroGraphql(operacao, dados));
    }

    if (!dados.data) {
        console.error('[useApi][GraphQL][SEM_DATA]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, parametros, variables, query: operacao.query, resposta: dados, responseBody: corpoTexto });
        throw new Error(`Resposta GraphQL não retornou data para operação ${operacao.nome}/${operacao.nomeOperacaoGraphql}: ${limitaTextoErro(corpoTexto || '[resposta sem corpo]')}`);
    }

    return dados.data;
};

async function executaRest<TParametros extends object, TResposta extends object>(operacao: ApiOperacaoRestGet<TParametros, TResposta>, parametros: TParametros): Promise<TResposta> {
    const queryString = operacao.montaQueryString(parametros);
    const url = `${montaUrlApi(operacao.endpoint)}${queryString}`;
    const resposta = await fetch(url, { method: operacao.metodoHttp, headers: { 'Content-Type': 'application/json' } });

    if (!resposta.ok) {
        const falha = await leRespostaHttpFalha(resposta, url);

        console.error('[useApi][REST][HTTP_ERRO]', { operacao: operacao.nome, url, status: falha.status, statusText: falha.statusText, parametros, responseBody: falha.corpoTexto });

        throw new Error(montaMensagemErroHttpRest(operacao, falha));
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

            console.error('[useApi][ERRO_CAPTURADO]', { operacao: nomeOperacaoLog, transporte: transporteOperacaoLog, parametros, erro: mensagemErro, erroOriginal: erroCapturado });

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