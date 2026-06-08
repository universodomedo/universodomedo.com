'use client';

import type { ApiOperacaoGraphqlGet, ApiRespostaGraphql } from 'types-nora-api';
import type { ApiOperacaoRestGet, ApiOperacaoRestPost } from 'types-nora-api/api/rest';

import { toast } from 'Hooks/useToast';
import { NoraApiCarregamento, registraRequisicaoNoraApi } from 'Api/NoraApiRequisicoesStore';

type NoraApiRequisicaoOpcoes = {
    readonly mensagemErro?: string;
    readonly exibirToastErro?: boolean;
    readonly carregamento?: NoraApiCarregamento;
};

type NoraApiGraphQLOpcoes = NoraApiRequisicaoOpcoes;
type NoraApiRestOpcoes = NoraApiRequisicaoOpcoes;

type ApiOperacaoErroLog = {
    readonly nome: string;
    readonly nomeOperacaoGraphql: string;
};

type NoraApiErroParams = {
    readonly mensagem: string;
    readonly mensagemServidor?: string | null;
};

export class NoraApiErro extends Error {
    readonly mensagemServidor: string | null;

    constructor(params: NoraApiErroParams) {
        super(params.mensagem);

        this.name = 'NoraApiErro';
        this.mensagemServidor = params.mensagemServidor ?? null;
        Object.setPrototypeOf(this, NoraApiErro.prototype);
    };
};

const PARAMETROS_GRAPHQL_SEM_CORPO: Record<string, never> = {};

const NORA_API_DEBUG_GRAPHQL_DELAY_MS = 'NORA_API_DEBUG_GRAPHQL_DELAY_MS';

const NORA_API_DEBUG_GRAPHQL_ERRO_OPERACAO = 'NORA_API_DEBUG_GRAPHQL_ERRO_OPERACAO';

function registraAvisoControladoNoraApi(mensagem: string, dados: object): void {
    console.warn(mensagem, dados);
};

function montaUrlApi(endpoint: string): string {
    const urlBaseApi = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
    return `${urlBaseApi}${endpoint}`;
};

function montaMensagemErroGraphql<TResposta extends object>(operacao: ApiOperacaoErroLog, dados: ApiRespostaGraphql<TResposta>): string {
    if (!dados.errors?.length) return `Resposta GraphQL inválida para operação ${operacao.nome}`;

    return dados.errors.map(erroGraphql => `${erroGraphql.message}${erroGraphql.path?.length ? ` | path=${erroGraphql.path.join('.')}` : ''}${erroGraphql.extensions ? ` | extensions=${JSON.stringify(erroGraphql.extensions)}` : ''}`).join(' | ');
};

function deveExibirToastErro(opcoes?: NoraApiRequisicaoOpcoes): boolean {
    return opcoes?.exibirToastErro ?? true;
};

function resolveCarregamentoNoraApi(opcoes?: NoraApiRequisicaoOpcoes): NoraApiCarregamento {
    return opcoes?.carregamento ?? NoraApiCarregamento.BARRA;
};

function montaMensagemComDetalheServidor(mensagemPrincipal: string, mensagemServidor: string | null): string {
    if (!mensagemServidor) return mensagemPrincipal;
    if (mensagemPrincipal.includes(mensagemServidor)) return mensagemPrincipal;

    return `${mensagemPrincipal}\nDetalhe técnico: ${mensagemServidor}`;
};

export function montaMensagemErroNoraApiParaUsuario(erro: Error | null, mensagemErroPreferencial?: string): string {
    const mensagemPrincipal = mensagemErroPreferencial ?? erro?.message ?? 'Erro desconhecido ao chamar a NoraAPI';
    const mensagemServidor = erro instanceof NoraApiErro ? erro.mensagemServidor : null;

    return montaMensagemComDetalheServidor(mensagemPrincipal, mensagemServidor);
};

function normalizaErroNoraApi(erroCapturado: Error | null): NoraApiErro {
    if (erroCapturado instanceof NoraApiErro) return erroCapturado;

    return new NoraApiErro({ mensagem: erroCapturado?.message ?? 'Erro desconhecido ao chamar a NoraAPI' });
};

function estaEmAmbienteCliente(): boolean {
    return typeof window !== 'undefined';
};

function obtemItemLocalStorage(chave: string): string | null {
    if (!estaEmAmbienteCliente()) return null;

    try {
        return window.localStorage.getItem(chave);
    } catch {
        return null;
    }
};

function obtemDelayDebugGraphqlEmMs(): number {
    const valor = obtemItemLocalStorage(NORA_API_DEBUG_GRAPHQL_DELAY_MS);
    if (!valor) return 0;

    const numero = Number(valor);
    if (!Number.isFinite(numero)) return 0;
    if (numero <= 0) return 0;

    return numero;
};

function deveForcarErroDebugGraphql<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>): boolean {
    const valor = obtemItemLocalStorage(NORA_API_DEBUG_GRAPHQL_ERRO_OPERACAO);
    if (!valor) return false;

    const valorNormalizado = valor.trim();
    if (valorNormalizado.length === 0) return false;
    if (valorNormalizado === '*') return true;
    if (valorNormalizado === operacao.nome) return true;
    if (valorNormalizado === operacao.nomeOperacaoGraphql) return true;
    if (valorNormalizado === `${operacao.nome}/${operacao.nomeOperacaoGraphql}`) return true;

    return false;
};

function aguardaMs(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function aplicaDebugGraphql<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>): Promise<void> {
    const delayMs = obtemDelayDebugGraphqlEmMs();

    if (delayMs > 0) {
        registraAvisoControladoNoraApi('[NoraApi][GraphQL][DEBUG_DELAY]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, delayMs });
        await aguardaMs(delayMs);
    }

    if (deveForcarErroDebugGraphql(operacao)) {
        registraAvisoControladoNoraApi('[NoraApi][GraphQL][DEBUG_ERRO_FORCADO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql });
        throw new NoraApiErro({ mensagem: `Erro GraphQL forçado por debug na operação ${operacao.nome}/${operacao.nomeOperacaoGraphql}`, mensagemServidor: `Erro forçado via localStorage: ${NORA_API_DEBUG_GRAPHQL_ERRO_OPERACAO}` });
    }
};

async function obtemTextoRespostaErro(resposta: Response): Promise<string | null> {
    try {
        const texto = await resposta.text();

        return texto.trim().length > 0 ? texto : null;
    } catch {
        return null;
    }
};

function montaUrlRestGet<TParametros extends object, TResposta>(operacao: ApiOperacaoRestGet<TParametros, TResposta>, parametros: TParametros): string {
    const queryString = operacao.montaQueryString(parametros);
    const endpoint = queryString.length > 0 ? `${operacao.endpoint}?${queryString}` : operacao.endpoint;

    return montaUrlApi(endpoint);
};

async function executaRestGet<TParametros extends object, TResposta>(operacao: ApiOperacaoRestGet<TParametros, TResposta>, parametros: TParametros): Promise<TResposta> {
    const url = montaUrlRestGet(operacao, parametros);
    const resposta = await fetch(url, { method: operacao.metodoHttp, credentials: 'include', headers: { 'Content-Type': 'application/json' } });

    if (!resposta.ok) {
        const textoErro = await obtemTextoRespostaErro(resposta);
        const mensagemErro = `Falha HTTP ao chamar REST GET: status=${resposta.status} endpoint=${url} operacao=${operacao.nome}${textoErro ? ` detalhe=${textoErro}` : ''}`;

        registraAvisoControladoNoraApi('[NoraApi][REST][GET][HTTP_ERRO]', { operacao: operacao.nome, url, status: resposta.status, parametros, resposta: textoErro });

        throw new NoraApiErro({ mensagem: mensagemErro, mensagemServidor: textoErro });
    }

    return await resposta.json() as TResposta;
};

async function executaRestPost<TCorpo extends object, TResposta>(operacao: ApiOperacaoRestPost<TCorpo, TResposta>, corpo: TCorpo): Promise<TResposta> {
    const url = montaUrlApi(operacao.endpoint);
    const resposta = await fetch(url, { method: operacao.metodoHttp, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });

    if (!resposta.ok) {
        const textoErro = await obtemTextoRespostaErro(resposta);
        const mensagemErro = `Falha HTTP ao chamar REST POST: status=${resposta.status} endpoint=${url} operacao=${operacao.nome}${textoErro ? ` detalhe=${textoErro}` : ''}`;

        registraAvisoControladoNoraApi('[NoraApi][REST][POST][HTTP_ERRO]', { operacao: operacao.nome, url, status: resposta.status, corpo, resposta: textoErro });

        throw new NoraApiErro({ mensagem: mensagemErro, mensagemServidor: textoErro });
    }

    return await resposta.json() as TResposta;
};

async function executaGraphql<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>): Promise<TResposta> {
    const url = montaUrlApi(operacao.endpoint);
    const variables = operacao.montaVariaveis(PARAMETROS_GRAPHQL_SEM_CORPO);
    const resposta = await fetch(url, { method: operacao.metodoHttp, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operationName: operacao.nomeOperacaoGraphql, query: operacao.query, variables }) });

    if (!resposta.ok) {
        const textoErro = await obtemTextoRespostaErro(resposta);
        const mensagemErro = `Falha HTTP ao chamar GraphQL: status=${resposta.status} endpoint=${url} operação=${operacao.nome}/${operacao.nomeOperacaoGraphql}${textoErro ? ` detalhe=${textoErro}` : ''}`;

        registraAvisoControladoNoraApi('[NoraApi][GraphQL][HTTP_ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, status: resposta.status, variables, query: operacao.query, resposta: textoErro });

        throw new NoraApiErro({ mensagem: mensagemErro, mensagemServidor: textoErro });
    }

    const dados = await resposta.json() as ApiRespostaGraphql<TResposta>;

    if (dados.errors?.length) {
        const mensagemServidor = montaMensagemErroGraphql(operacao, dados);

        registraAvisoControladoNoraApi('[NoraApi][GraphQL][ERRO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, variables, query: operacao.query, errors: dados.errors, data: dados.data ?? null });

        throw new NoraApiErro({ mensagem: mensagemServidor, mensagemServidor });
    }

    if (!dados.data) {
        const mensagemErro = `Resposta GraphQL não retornou data para operação ${operacao.nome}`;

        registraAvisoControladoNoraApi('[NoraApi][GraphQL][SEM_DATA]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, url, variables, query: operacao.query, resposta: dados });

        throw new NoraApiErro({ mensagem: mensagemErro });
    }

    return dados.data;
};

async function GraphQL<TVariaveis extends object, TResposta extends object>(operacao: ApiOperacaoGraphqlGet<Record<string, never>, TVariaveis, TResposta>, opcoes?: NoraApiGraphQLOpcoes): Promise<TResposta> {
    const finalizaRequisicao = registraRequisicaoNoraApi(resolveCarregamentoNoraApi(opcoes));

    try {
        await aplicaDebugGraphql(operacao);
        return await executaGraphql(operacao);
    } catch (erroCapturado) {
        const erro = normalizaErroNoraApi(erroCapturado instanceof Error ? erroCapturado : null);
        const mensagemUsuario = montaMensagemErroNoraApiParaUsuario(erro, opcoes?.mensagemErro);

        registraAvisoControladoNoraApi('[NoraApi][GraphQL][ERRO_CONTROLADO]', { operacao: operacao.nome, operationName: operacao.nomeOperacaoGraphql, erro: erro.message, mensagemServidor: erro.mensagemServidor });

        if (deveExibirToastErro(opcoes)) toast.erro(mensagemUsuario);

        throw erro;
    } finally {
        finalizaRequisicao();
    }
};

async function RestGET<TParametros extends object, TResposta>(operacao: ApiOperacaoRestGet<TParametros, TResposta>, parametros: TParametros, opcoes?: NoraApiRestOpcoes): Promise<TResposta> {
    const finalizaRequisicao = registraRequisicaoNoraApi(resolveCarregamentoNoraApi(opcoes));

    try {
        return await executaRestGet(operacao, parametros);
    } catch (erroCapturado) {
        const erro = normalizaErroNoraApi(erroCapturado instanceof Error ? erroCapturado : null);
        const mensagemUsuario = montaMensagemErroNoraApiParaUsuario(erro, opcoes?.mensagemErro);

        registraAvisoControladoNoraApi('[NoraApi][REST][GET][ERRO_CONTROLADO]', { operacao: operacao.nome, erro: erro.message, mensagemServidor: erro.mensagemServidor });

        if (deveExibirToastErro(opcoes)) toast.erro(mensagemUsuario);

        throw erro;
    } finally {
        finalizaRequisicao();
    }
};

async function RestPOST<TCorpo extends object, TResposta>(operacao: ApiOperacaoRestPost<TCorpo, TResposta>, corpo: TCorpo, opcoes?: NoraApiRestOpcoes): Promise<TResposta> {
    const finalizaRequisicao = registraRequisicaoNoraApi(resolveCarregamentoNoraApi(opcoes));

    try {
        return await executaRestPost(operacao, corpo);
    } catch (erroCapturado) {
        const erro = normalizaErroNoraApi(erroCapturado instanceof Error ? erroCapturado : null);
        const mensagemUsuario = montaMensagemErroNoraApiParaUsuario(erro, opcoes?.mensagemErro);

        registraAvisoControladoNoraApi('[NoraApi][REST][POST][ERRO_CONTROLADO]', { operacao: operacao.nome, erro: erro.message, mensagemServidor: erro.mensagemServidor });

        if (deveExibirToastErro(opcoes)) toast.erro(mensagemUsuario);

        throw erro;
    } finally {
        finalizaRequisicao();
    }
};

export const NoraApi = {
    GraphQL,
    RestGET,
    RestPOST,
} as const;