'use client';

import { createContext, useContext } from 'react';

import { useContextoAutenticacao } from '../ContextoAutenticacao/contexto';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

interface ContextoPaginaArtistaMinhasImagensProps {
    listagemArquivos: ReturnType<typeof obtemListagemArquivos>;
};

const ContextoPaginaArtistaMinhasImagens = createContext<ContextoPaginaArtistaMinhasImagensProps | undefined>(undefined);

export const useContextoPaginaArtistaMinhasImagens = (): ContextoPaginaArtistaMinhasImagensProps => {
    const context = useContext(ContextoPaginaArtistaMinhasImagens);
    if (!context) throw new Error('useContextoPaginaArtistaMinhasImagens precisa estar dentro de um ContextoPaginaArtistaMinhasImagens');
    return context;
};

export const ContextoPaginaArtistaMinhasImagensProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();

    const listagemArquivos = obtemListagemArquivos(usuarioLogado?.id ?? null);

    return (
        <ContextoPaginaArtistaMinhasImagens.Provider value={{ listagemArquivos }}>
            {children}
        </ContextoPaginaArtistaMinhasImagens.Provider>
    );
};

//

export function obtemListagemArquivos(idUsuario: number | null) {
    return useNoraGraphQLListagem('Arquivo', {
        select: ['id', 'tipoArquivo', 'usuario', 'caminhoArquivo'],
        camposFiltroConsulta: ['tipoArquivo.nome'],
        camposFiltroVisualizacao: ['tipoArquivo.nome'],
        whereFixo: idUsuario === null ? { usuario: { id: -1 } } : { usuario: { id: idUsuario } },
        itensPorPagina: 40,
        carregando: 'Buscando Arquivos',
        mensagemErro: 'Houve um erro recuperando os Arquivos existentes',
        mensagemListaVazia: 'Nenhum arquivo encontrado.',
        mensagemListaVaziaComFiltro: 'Nenhuma arquivo encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};