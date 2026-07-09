'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerSeres = 'LISTAGEM' | 'CADASTRO' | 'ESTRUTURA';

export interface Contexto__PaginaGameDesignerSeres__Props {
    estadoFluxo: FluxoPaginaGameDesignerSeres;
    listagemSeres: ReturnType<typeof useListagemSeres>;
    idSerEstrutura: number | null;
    iniciaCadastro: () => void;
    abreEstrutura: (idSer: number) => void;
    voltaParaListagem: () => void;
    concluiCadastro: () => void;
};

const Contexto__PaginaGameDesignerSeres = createContext<Contexto__PaginaGameDesignerSeres__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres = (): Contexto__PaginaGameDesignerSeres__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres precisa estar dentro de um Contexto__PaginaGameDesignerSeres');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemSeres = useListagemSeres();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerSeres>('LISTAGEM');
    const [idSerEstrutura, setIdSerEstrutura] = useState<number | null>(null);
    const recarregarListagem = listagemSeres.recarregar;

    const iniciaCadastro = useCallback(() => { setEstadoFluxo('CADASTRO'); }, []);
    const abreEstrutura = useCallback((idSer: number) => { setIdSerEstrutura(idSer); setEstadoFluxo('ESTRUTURA'); }, []);
    const voltaParaListagem = useCallback(() => { setIdSerEstrutura(null); setEstadoFluxo('LISTAGEM'); }, []);
    const concluiCadastro = useCallback(() => {
        recarregarListagem();
        setEstadoFluxo('LISTAGEM');
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerSeres.Provider value={{ estadoFluxo, listagemSeres, idSerEstrutura, iniciaCadastro, abreEstrutura, voltaParaListagem, concluiCadastro }}>
            {children}
        </Contexto__PaginaGameDesignerSeres.Provider>
    );
};

function useListagemSeres() {
    return useNoraGraphQLListagem('Ser', {
        select: ['id', 'dataCriacao'],
        camposFiltroConsulta: ['id', 'dataCriacao'],
        camposFiltroVisualizacao: ['id', 'dataCriacao'],
        itensPorPagina: 24,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { dataCriacao: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
