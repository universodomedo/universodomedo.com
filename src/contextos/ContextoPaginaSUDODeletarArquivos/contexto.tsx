'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArquivoCompletaDto } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { toast } from 'Hooks/useToast';
import { deleteArquivo_SUDO } from 'Uteis/ApiConsumer/ConsumerMiddleware';


interface ContextoPaginaSUDODeletarArquivosProps {
    listagemArquivos: ReturnType<typeof obtemListagemArquivos>;
    enviaDelete: (arquivo: ReturnType<typeof useContextoPaginaSUDODeletarArquivos>['listagemArquivos']['registros'][number]) => void;
};

const ContextoPaginaSUDODeletarArquivos = createContext<ContextoPaginaSUDODeletarArquivosProps | undefined>(undefined);

export const useContextoPaginaSUDODeletarArquivos = (): ContextoPaginaSUDODeletarArquivosProps => {
    const context = useContext(ContextoPaginaSUDODeletarArquivos);
    if (!context) throw new Error('useContextoPaginaSUDODeletarArquivos precisa estar dentro de um ContextoPaginaSUDODeletarArquivos');
    return context;
};

export const ContextoPaginaSUDODeletarArquivosProvider = ({ children }: { children: React.ReactNode }) => {
    const listagemArquivos = obtemListagemArquivos();

    async function enviaDelete(arquivo: ReturnType<typeof useContextoPaginaSUDODeletarArquivos>['listagemArquivos']['registros'][number]) {
        const confirmou = window.confirm(`Deseja realmente deletar o arquivo ${arquivo.detalheArquivoInterno?.nomeInterno ? `${arquivo.detalheArquivoInterno.nomeInterno}` : `ID [#${arquivo.id}]`}?`);

        if (!confirmou) return;

        try {
            await deleteArquivo_SUDO(arquivo.id);
            await toast.sucesso('Arquivo deletado', `Arquivo ${arquivo.detalheArquivoInterno ? arquivo.detalheArquivoInterno.nomeInterno : ''} foi deletado com sucesso.`, { recarregaPagina: true });
        } catch (e) { await toast.erro('Falha ao deletar arquivo', e instanceof Error ? e.message : 'Falha ao deletar arquivo'); }
    };

    return (
        <ContextoPaginaSUDODeletarArquivos.Provider value={{ listagemArquivos, enviaDelete }}>
            {children}
        </ContextoPaginaSUDODeletarArquivos.Provider>
    );
};

//

export function obtemListagemArquivos() {
    return useNoraGraphQLListagem('Arquivo', {
        select: ['id', 'tipoArquivo', 'caminhoArquivo', 'nomeGeralArquivo', 'detalheArquivoInterno', 'dataCriacao', 'tipoArquivo', 'usuarioAdicionou'],
        camposFiltroConsulta: ['dataCriacao'],
        camposFiltroVisualizacao: ['dataCriacao', 'nomeGeralArquivo', 'tipoArquivo.nome', 'usuarioAdicionou.username'],
        itensPorPagina: 12,
        carregando: 'Buscando Capas',
        mensagemErro: 'Houve um erro recuperando as Capas existentes',
        mensagemListaVazia: 'Nenhuma capa encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capa encontrada com os filtros atuais.',
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