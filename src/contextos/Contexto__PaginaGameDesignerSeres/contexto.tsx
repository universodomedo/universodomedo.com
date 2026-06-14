'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerSeres = 'LISTAGEM' | 'CADASTRO' | 'DETALHE';

export interface Contexto__PaginaGameDesignerSeres__Props {
    estadoFluxo: FluxoPaginaGameDesignerSeres;
    idSerSelecionado: number | null;
    listagemSeres: ReturnType<typeof useListagemSeres>;
    iniciaCadastro: () => void;
    selecionaSer: (idSer: number) => void;
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
    const [idSerSelecionado, setIdSerSelecionado] = useState<number | null>(null);
    const recarregarListagem = listagemSeres.recarregar;

    const iniciaCadastro = useCallback(() => { setEstadoFluxo('CADASTRO'); }, []);
    const selecionaSer = useCallback((idSer: number) => {
        setIdSerSelecionado(idSer);
        setEstadoFluxo('DETALHE');
    }, []);
    const voltaParaListagem = useCallback(() => {
        setIdSerSelecionado(null);
        setEstadoFluxo('LISTAGEM');
    }, []);
    const concluiCadastro = useCallback(() => {
        recarregarListagem();
        setIdSerSelecionado(null);
        setEstadoFluxo('LISTAGEM');
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerSeres.Provider value={{ estadoFluxo, idSerSelecionado, listagemSeres, iniciaCadastro, selecionaSer, voltaParaListagem, concluiCadastro }}>
            {children}
        </Contexto__PaginaGameDesignerSeres.Provider>
    );
};

function useListagemSeres() {
    return useNoraGraphQLListagem('SerRegistro', {
        select: ['id', 'fkTiposSerId', 'dataCriacao', { tipoSer: ['id', 'nome'] }],
        camposFiltroConsulta: ['fkTiposSerId'],
        camposFiltroVisualizacao: ['fkTiposSerId', 'dataCriacao'],
        itensPorPagina: 20,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
