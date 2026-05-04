'use client';

import { createContext, useContext } from 'react';
import { GraphqlOrderDirecao, GraphqlTypesGrupoAventura } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import type { ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import useNoraGraphQLListagem, { UseNoraGraphQLListagemConsultaParams } from 'Hooks/useNoraGraphQLListagem';

const SELECT_AVENTURAS = GraphqlTypesGrupoAventura.select('id', 'dadosArteCapa');

export type GrupoAventuraRegistro = GraphqlTypesGrupoAventura.Item<typeof SELECT_AVENTURAS>;

export type ListagemGruposAventurasGerenciamento = ListagemCompostaListagem<GrupoAventuraRegistro>;

export interface Contexto__PaginaMestreAventuras__Props {
    listagemGruposAventuras: ListagemGruposAventurasGerenciamento;
};

const Contexto__PaginaMestreAventuras = createContext<Contexto__PaginaMestreAventuras__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras = (): Contexto__PaginaMestreAventuras__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras precisa estar dentro de um Contexto__PaginaMestreAventuras');
    return context;
};

function montaParametrosConsultaGruposAventuras(params: UseNoraGraphQLListagemConsultaParams): GraphqlTypesGrupoAventura.ObtemVariosParametros {
    return {
        where: params.where as GraphqlTypesGrupoAventura.ObtemVariosParametros['where'],
        order: { id: GraphqlOrderDirecao.DESC },
        limit: params.limit,
        offset: params.offset,
    };
};

function montaParametrosTotalDeRegistrosGruposAventuras(where: UseNoraGraphQLListagemConsultaParams['where']): GraphqlTypesGrupoAventura.ObtemVariosParametros {
    return {
        where: where as GraphqlTypesGrupoAventura.ObtemVariosParametros['where'],
    };
};

export const Contexto__PaginaMestreAventuras__Provider = ({ children }: { children: React.ReactNode; }) => {
    const listagemGruposAventuras = useNoraGraphQLListagem<GrupoAventuraRegistro, GraphqlTypesGrupoAventura.ObtemVariosParametros>({
        select: SELECT_AVENTURAS,
        camposFiltroConsulta: GraphqlTypesGrupoAventura.CamposFiltroConsulta,
        camposFiltroVisualizacao: GraphqlTypesGrupoAventura.CamposFiltroVisualizacao,
        itensPorPagina: 12,
        carregando: 'Buscando Aventuras',
        mensagemErro: 'Houve um erro recuperando suas Aventuras',
        mensagemListaVazia: 'Nenhuma aventura encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma aventura encontrada com os filtros atuais.',
        carregamento: NoraApiCarregamento.BLOQUEIA_INTERFACE,
        montaParametrosConsulta: montaParametrosConsultaGruposAventuras,
        montaParametrosTotalDeRegistros: montaParametrosTotalDeRegistrosGruposAventuras,
        criaOperacao: (obtem, parametros) => obtem.GrupoAventura.varios({ parametros, select: SELECT_AVENTURAS }),
        criaOperacaoTotalDeRegistros: (obtem, parametros) => obtem.GrupoAventura.totalDeRegistros({ parametros }),
    });

    return (
        <Contexto__PaginaMestreAventuras.Provider value={{ listagemGruposAventuras }}>
            {children}
        </Contexto__PaginaMestreAventuras.Provider>
    );
};