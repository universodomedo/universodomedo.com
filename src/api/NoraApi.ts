'use client';

import { ApiOperacaoGraphqlGet, ApiRespostaGraphql } from 'types-nora-api';

import { toast } from 'Hooks/useToast';

type NoraApiGraphQLOpcoes = {
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
};

type ApiOperacaoErroLog = {
    readonly nome: string;
    readonly nomeOperacaoGraphql: string;
};

const PARAMETROS_GRAPHQL_SEM_CORPO: Record<string, never> = {};

function montaUrlApi(endpoint: string): string {
    const urlBaseApi = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    return `${urlBaseApi}${endpoint}`;
};

function montaMensagemErroGraphql<TResposta extends object>(operacao: ApiOperacaoErroLog, dados: ApiRespostaGraphql<TResposta>): string {
    if (!dados.errors?.length) return `Resposta GraphQL inválida para operação ${operacao.nome}`;

    return dados.errors.map(erroGraphql => `${erroGraphql.message}${erroGraphql.path?.length ? ` | path=${erroGraphql.path.join('.')}` : ''}${erroGraphql.extensions ? ` | extensions=${JSON.stringify(erroGraphql.extensions)}` : ''}`).join(' | ');
};

function deveExibirToastErro(opcoes?: NoraApiGraphQLOpcoes): boolean {
    return opcoes?.exibirToastErro ?? true;
};

function resolveMensagemToastErro(mensagemErro: string, opcoes?: NoraApiGraphQLOpcoes): string {
    return opcoes?.mensagemErro ?? mensagemErro;
};

async function obtemTextoRespostaErro(resposta: Response): Promise<string | null> {
    try {
        const texto = await resposta.text();

        return texto.trim().length > 0 ? texto : null;
    } catch {
        return null;
    }
};

async function executaGraphql<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>): Promise<TResposta> {
    const url = montaUrlApi(operacao.endpoint);
    const variables = operacao.montaVariaveis(PARAMETROS_GRAPHQL_SEM_CORPO);
    const resposta = await fetch(url, { method: operacao.metodoHttp, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operationName: operacao.nomeOperacaoGraphql, query: operacao.query, variables }) });

    if (!resposta.ok) {
        const textoErro = await obtemTextoRespostaErro(resposta);

        console.error('[NoraApi][GraphQL][HTTP_ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, status: resposta.status, variables, query: operacao.query, resposta: textoErro });

        throw new Error(`Falha HTTP ao chamar GraphQL: status=${resposta.status} endpoint=${url} operação=${operacao.nome}/${operacao.nomeOperacaoGraphql}${textoErro ? ` detalhe=${textoErro}` : ''}`);
    }

    const dados = await resposta.json() as ApiRespostaGraphql<TResposta>;

    if (dados.errors?.length) {
        console.error('[NoraApi][GraphQL][ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, variables, query: operacao.query, errors: dados.errors, data: dados.data ?? null });

        throw new Error(montaMensagemErroGraphql(operacao, dados));
    }

    if (!dados.data) {
        console.error('[NoraApi][GraphQL][SEM_DATA]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, variables, query: operacao.query, resposta: dados });

        throw new Error(`Resposta GraphQL não retornou data para operação ${operacao.nome}`);
    }

    return dados.data;
};

async function GraphQL<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>, opcoes?: NoraApiGraphQLOpcoes): Promise<TResposta> {
    try {
        return await executaGraphql(operacao);
    } catch (erroCapturado) {
        const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao chamar GraphQL';

        console.error('[NoraApi][GraphQL][ERRO_CAPTURADO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, erro: mensagemErro });

        if (deveExibirToastErro(opcoes)) toast.erro(resolveMensagemToastErro(mensagemErro, opcoes));

        throw new Error(mensagemErro);
    }
};

export const NoraApi = {
    GraphQL,
} as const;