'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerNovoSer = 'LISTAGEM' | 'CADASTRO' | 'ESTRUTURA';

export interface Contexto__PaginaGameDesignerNovoSer__Props {
    estadoFluxo: FluxoPaginaGameDesignerNovoSer;
    listagemSeres: ReturnType<typeof useListagemSeres>;
    idSerEstrutura: number | null;
    iniciaCadastro: () => void;
    abreEstrutura: (idSer: number) => void;
    voltaParaListagem: () => void;
    concluiCadastro: () => void;
};

const Contexto__PaginaGameDesignerNovoSer = createContext<Contexto__PaginaGameDesignerNovoSer__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerNovoSer = (): Contexto__PaginaGameDesignerNovoSer__Props => {
    const context = useContext(Contexto__PaginaGameDesignerNovoSer);
    if (!context) throw new Error('useContexto__PaginaGameDesignerNovoSer precisa estar dentro de um Contexto__PaginaGameDesignerNovoSer');
    return context;
};

export const Contexto__PaginaGameDesignerNovoSer__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemSeres = useListagemSeres();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerNovoSer>('LISTAGEM');
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
        <Contexto__PaginaGameDesignerNovoSer.Provider value={{ estadoFluxo, listagemSeres, idSerEstrutura, iniciaCadastro, abreEstrutura, voltaParaListagem, concluiCadastro }}>
            {children}
        </Contexto__PaginaGameDesignerNovoSer.Provider>
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
