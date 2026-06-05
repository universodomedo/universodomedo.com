'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaModeradorCapacidadesInatas = 'LISTAGEM' | 'CADASTRO';

export interface Contexto__PaginaModeradorCapacidadesInatas__Props {
    estadoFluxo: FluxoPaginaModeradorCapacidadesInatas;
    listagemCapacidadesInatas: ReturnType<typeof useListagemCapacidadesInatas>;
    iniciaCadastro: () => void;
    cancelaCadastro: () => void;
    concluiCadastro: () => void;
};

const Contexto__PaginaModeradorCapacidadesInatas = createContext<Contexto__PaginaModeradorCapacidadesInatas__Props | undefined>(undefined);

export const useContexto__PaginaModeradorCapacidadesInatas = (): Contexto__PaginaModeradorCapacidadesInatas__Props => {
    const context = useContext(Contexto__PaginaModeradorCapacidadesInatas);
    if (!context) throw new Error('useContexto__PaginaModeradorCapacidadesInatas precisa estar dentro de um Contexto__PaginaModeradorCapacidadesInatas');
    return context;
};

export const Contexto__PaginaModeradorCapacidadesInatas__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemCapacidadesInatas = useListagemCapacidadesInatas();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaModeradorCapacidadesInatas>('LISTAGEM');
    const recarregarListagem = listagemCapacidadesInatas.recarregar;

    const iniciaCadastro = useCallback(() => { setEstadoFluxo('CADASTRO'); }, []);
    const cancelaCadastro = useCallback(() => { setEstadoFluxo('LISTAGEM'); }, []);
    const concluiCadastro = useCallback(() => {
        recarregarListagem();
        setEstadoFluxo('LISTAGEM');
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaModeradorCapacidadesInatas.Provider value={{ estadoFluxo, listagemCapacidadesInatas, iniciaCadastro, cancelaCadastro, concluiCadastro }}>
            {children}
        </Contexto__PaginaModeradorCapacidadesInatas.Provider>
    );
};

function useListagemCapacidadesInatas() {
    return useNoraGraphQLListagem('CapacidadeInata', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Capacidades Inatas',
        mensagemErro: 'Houve um erro recuperando as Capacidades Inatas',
        mensagemListaVazia: 'Nenhuma capacidade inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade inata encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};