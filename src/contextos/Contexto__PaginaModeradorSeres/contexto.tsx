'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaModeradorSeres = 'LISTAGEM' | 'CADASTRO';

export interface Contexto__PaginaModeradorSeres__Props {
    estadoFluxo: FluxoPaginaModeradorSeres;
    listagemSeres: ReturnType<typeof useListagemSeres>;
    iniciaCadastro: () => void;
    cancelaCadastro: () => void;
    concluiCadastro: () => void;
};

const Contexto__PaginaModeradorSeres = createContext<Contexto__PaginaModeradorSeres__Props | undefined>(undefined);

export const useContexto__PaginaModeradorSeres = (): Contexto__PaginaModeradorSeres__Props => {
    const context = useContext(Contexto__PaginaModeradorSeres);
    if (!context) throw new Error('useContexto__PaginaModeradorSeres precisa estar dentro de um Contexto__PaginaModeradorSeres');
    return context;
};

export const Contexto__PaginaModeradorSeres__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemSeres = useListagemSeres();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaModeradorSeres>('LISTAGEM');
    const recarregarListagem = listagemSeres.recarregar;

    const iniciaCadastro = useCallback(() => { setEstadoFluxo('CADASTRO'); }, []);
    const cancelaCadastro = useCallback(() => { setEstadoFluxo('LISTAGEM'); }, []);
    const concluiCadastro = useCallback(() => {
        recarregarListagem();
        setEstadoFluxo('LISTAGEM');
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaModeradorSeres.Provider value={{ estadoFluxo, listagemSeres, iniciaCadastro, cancelaCadastro, concluiCadastro }}>
            {children}
        </Contexto__PaginaModeradorSeres.Provider>
    );
};

function useListagemSeres() {
    return useNoraGraphQLListagem('Ser', {
        select: ['id', 'nome', { membros: ['id', 'nome', { capacidades: ['id', 'nome'] }] }],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};