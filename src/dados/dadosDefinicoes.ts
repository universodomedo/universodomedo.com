import dados from 'Dados/definicoes.json';

type EstruturaPaginaDefinicao = {
    titulo: string;
    subtitulo?: string;

    listaConteudo: {
        itens: ConteudoItem[];
    };

    listaItensDefinicoesConectadas?: { etiqueta: string, subPaginaDefinicao: string }[];
}

type ConteudoItem = { tipo: 'Definicao'; paragrafos: string[]; } | { tipo: 'Lista'; itensLista: { etiqueta: string; subPaginaDefinicao: string; }[]; };

export const obtemConteudoDefinicaoPorIdentificadorPagina = (chave: string): { sucesso: false } | { sucesso: true; conteudo: EstruturaPaginaDefinicao } => {
    const jsonString = dados[chave as keyof typeof dados];

    if (!jsonString) return { sucesso: false };

    return { sucesso: true, conteudo: jsonString as unknown as EstruturaPaginaDefinicao };
};