'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerCatalogosMissao = 'LISTAGEM' | 'EDITOR';
type RegistroCatalogoMissao = ReturnType<typeof useListagemCatalogosMissao>['registros'][number];

export interface Contexto__PaginaGameDesignerCatalogosMissao__Props {
    estadoFluxo: FluxoPaginaGameDesignerCatalogosMissao;
    catalogoEmEdicao: RegistroCatalogoMissao | null;
    listagemCatalogosMissao: ReturnType<typeof useListagemCatalogosMissao>;
    iniciaCriacao: () => void;
    iniciaEdicao: (catalogo: RegistroCatalogoMissao) => void;
    removerCatalogo: (catalogo: RegistroCatalogoMissao) => Promise<void>;
    voltarParaListagem: () => void;
    concluiSalvamento: () => void;
};

const Contexto__PaginaGameDesignerCatalogosMissao = createContext<Contexto__PaginaGameDesignerCatalogosMissao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissao = (): Contexto__PaginaGameDesignerCatalogosMissao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissao precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissao');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissao__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemCatalogosMissao = useListagemCatalogosMissao();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerCatalogosMissao>('LISTAGEM');
    const [catalogoEmEdicao, setCatalogoEmEdicao] = useState<RegistroCatalogoMissao | null>(null);
    const recarregarListagem = listagemCatalogosMissao.recarregar;

    const iniciaCriacao = useCallback(() => { setCatalogoEmEdicao(null); setEstadoFluxo('EDITOR'); }, []);
    const iniciaEdicao = useCallback((catalogo: RegistroCatalogoMissao) => { setCatalogoEmEdicao(catalogo); setEstadoFluxo('EDITOR'); }, []);
    const voltarParaListagem = useCallback(() => { setCatalogoEmEdicao(null); setEstadoFluxo('LISTAGEM'); }, []);
    const concluiSalvamento = useCallback(() => { recarregarListagem(); setCatalogoEmEdicao(null); setEstadoFluxo('LISTAGEM'); }, [recarregarListagem]);
    const removerCatalogo = useCallback(async (catalogo: RegistroCatalogoMissao) => {
        const confirmou = window.confirm(`Remover o catálogo "${catalogo.nome}"?`);
        if (!confirmou) return;

        await NoraApi.RestPOST(EventosApiRest.POST.CatalogosMissao.remover, { id: catalogo.id }, { mensagemErro: 'Não foi possível remover o Catálogo de Missão.' });
        recarregarListagem();
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerCatalogosMissao.Provider value={{ estadoFluxo, catalogoEmEdicao, listagemCatalogosMissao, iniciaCriacao, iniciaEdicao, removerCatalogo, voltarParaListagem, concluiSalvamento }}>
            {children}
        </Contexto__PaginaGameDesignerCatalogosMissao.Provider>
    );
};

function useListagemCatalogosMissao() {
    return useNoraGraphQLListagem('CatalogoMissao', {
        select: ['id', 'nome', 'dataCriacao', 'dataAtualizacao'],
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