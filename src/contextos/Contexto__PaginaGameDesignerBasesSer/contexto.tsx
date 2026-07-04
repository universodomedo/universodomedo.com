'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerBasesSer = 'LISTAGEM' | 'CADASTRO';

export interface Contexto__PaginaGameDesignerBasesSer__Props {
    estadoFluxo: FluxoPaginaGameDesignerBasesSer;
    idBaseEmEdicao: number | null;
    listagemBases: ReturnType<typeof useListagemBases>;
    iniciaCadastro: () => void;
    selecionaBase: (idBaseSer: number) => void;
    voltaParaListagem: () => void;
    concluiCadastro: (idBaseSer: number) => void;
};

const Contexto__PaginaGameDesignerBasesSer = createContext<Contexto__PaginaGameDesignerBasesSer__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerBasesSer = (): Contexto__PaginaGameDesignerBasesSer__Props => {
    const context = useContext(Contexto__PaginaGameDesignerBasesSer);
    if (!context) throw new Error('useContexto__PaginaGameDesignerBasesSer precisa estar dentro de um Contexto__PaginaGameDesignerBasesSer');
    return context;
};

export const Contexto__PaginaGameDesignerBasesSer__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemBases = useListagemBases();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerBasesSer>('LISTAGEM');
    const [idBaseEmEdicao, setIdBaseEmEdicao] = useState<number | null>(null);
    const recarregarListagem = listagemBases.recarregar;

    const iniciaCadastro = useCallback(() => { setEstadoFluxo('CADASTRO'); }, []);
    const selecionaBase = useCallback((idBaseSer: number) => { setIdBaseEmEdicao(idBaseSer); }, []);
    const voltaParaListagem = useCallback(() => {
        setIdBaseEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, []);
    const concluiCadastro = useCallback((idBaseSer: number) => {
        recarregarListagem();
        setEstadoFluxo('LISTAGEM');
        setIdBaseEmEdicao(idBaseSer);
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerBasesSer.Provider value={{ estadoFluxo, idBaseEmEdicao, listagemBases, iniciaCadastro, selecionaBase, voltaParaListagem, concluiCadastro }}>
            {children}
        </Contexto__PaginaGameDesignerBasesSer.Provider>
    );
};

function useListagemBases() {
    return useNoraGraphQLListagem('BaseSer', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 20,
        carregando: 'Buscando Bases de Ser',
        mensagemErro: 'Houve um erro recuperando as Bases de Ser',
        mensagemListaVazia: 'Nenhuma Base de Ser cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma Base de Ser encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
