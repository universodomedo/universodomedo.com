'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerCatalogosMissaoExibicao = 'LISTAGEM' | 'EDITOR';
type RegistroCatalogoMissao = ReturnType<typeof useListagemCatalogosMissao>['registros'][number];
type RegistroCatalogoMissaoExibicao = ReturnType<typeof useListagemCatalogosMissaoExibicao>['registros'][number];

export interface Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props {
    estadoFluxo: FluxoPaginaGameDesignerCatalogosMissaoExibicao;
    catalogoSelecionado: RegistroCatalogoMissao | null;
    exibicaoSelecionada: RegistroCatalogoMissaoExibicao | null;
    listagemCatalogosMissao: ReturnType<typeof useListagemCatalogosMissao>;
    listagemCatalogosMissaoExibicao: ReturnType<typeof useListagemCatalogosMissaoExibicao>;
    iniciaConfiguracao: (catalogo: RegistroCatalogoMissao, exibicao: RegistroCatalogoMissaoExibicao | null) => void;
    voltarParaListagem: () => void;
    concluiSalvamento: () => void;
};

const Contexto__PaginaGameDesignerCatalogosMissaoExibicao = createContext<Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissaoExibicao = (): Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissaoExibicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissaoExibicao precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissaoExibicao');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemCatalogosMissao = useListagemCatalogosMissao();
    const listagemCatalogosMissaoExibicao = useListagemCatalogosMissaoExibicao();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerCatalogosMissaoExibicao>('LISTAGEM');
    const [catalogoSelecionado, setCatalogoSelecionado] = useState<RegistroCatalogoMissao | null>(null);
    const [exibicaoSelecionada, setExibicaoSelecionada] = useState<RegistroCatalogoMissaoExibicao | null>(null);
    const recarregarCatalogosMissao = listagemCatalogosMissao.recarregar;
    const recarregarCatalogosMissaoExibicao = listagemCatalogosMissaoExibicao.recarregar;

    const iniciaConfiguracao = useCallback((catalogo: RegistroCatalogoMissao, exibicao: RegistroCatalogoMissaoExibicao | null) => { setCatalogoSelecionado(catalogo); setExibicaoSelecionada(exibicao); setEstadoFluxo('EDITOR'); }, []);
    const voltarParaListagem = useCallback(() => { setCatalogoSelecionado(null); setExibicaoSelecionada(null); setEstadoFluxo('LISTAGEM'); }, []);
    const concluiSalvamento = useCallback(() => { recarregarCatalogosMissao(); recarregarCatalogosMissaoExibicao(); setCatalogoSelecionado(null); setExibicaoSelecionada(null); setEstadoFluxo('LISTAGEM'); }, [recarregarCatalogosMissao, recarregarCatalogosMissaoExibicao]);

    return (
        <Contexto__PaginaGameDesignerCatalogosMissaoExibicao.Provider value={{ estadoFluxo, catalogoSelecionado, exibicaoSelecionada, listagemCatalogosMissao, listagemCatalogosMissaoExibicao, iniciaConfiguracao, voltarParaListagem, concluiSalvamento }}>
            {children}
        </Contexto__PaginaGameDesignerCatalogosMissaoExibicao.Provider>
    );
};

function useListagemCatalogosMissao() {
    return useNoraGraphQLListagem('CatalogoMissao', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 20,
        carregando: 'Buscando Catálogos de Missão',
        mensagemErro: 'Houve um erro recuperando os Catálogos de Missão',
        mensagemListaVazia: 'Nenhum Catálogo de Missão cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Catálogo de Missão encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useListagemCatalogosMissaoExibicao() {
    return useNoraGraphQLListagem('CatalogoMissaoExibicao', {
        select: ['fkCatalogosMissaoId', 'ativo', 'ordem', 'dataAtualizacao'],
        itensPorPagina: 200,
        carregando: 'Buscando exibição de Catálogos de Missão',
        mensagemErro: 'Houve um erro recuperando a exibição de Catálogos de Missão',
        mensagemListaVazia: 'Nenhuma exibição de Catálogo de Missão cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma exibição de Catálogo de Missão encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
