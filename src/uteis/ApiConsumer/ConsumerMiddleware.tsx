export type EstruturaPaginaDefinicao = { titulo: string; subtitulo?: string; listaConteudo: { itens: ConteudoItem[]; }; listaItensDefinicoesConectadas?: { etiqueta: string; subPaginaDefinicao: string; }[]; };

export type ConteudoItem = { tipo: "Definicao"; paragrafos: string[]; } | { tipo: "Lista"; itensLista: { etiqueta: string; subPaginaDefinicao: string; }[]; };

import useApi, { ApiResponse } from "Uteis/ApiConsumer/Consumer.tsx";



export async function obtemDadosMinhaPagina(): Promise<ApiResponse<string>> {
    const resposta = await useApi<any>('/auth/me');

    return resposta.sucesso ? { sucesso: true, dados: resposta.dados } : { sucesso: false, erro: resposta.erro };
}

export async function obtemDadosPorPaginaDefinicao(identificadorPagina: string): Promise<ApiResponse<EstruturaPaginaDefinicao>> {
    const resposta = await useApi<EstruturaPaginaDefinicao>('/definicoes/obtemDadosPorPaginaDefinicao', { identificadorPagina });
    
    return resposta.sucesso && resposta.dados !== undefined ? { sucesso: true, dados: resposta.dados } : { sucesso: false, erro: resposta.erro };
}