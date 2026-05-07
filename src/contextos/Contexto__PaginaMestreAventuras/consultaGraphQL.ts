'use client';

import { GraphqlOrderDirecao, GraphqlTypesGrupoAventura } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

const SELECT_LISTAGEM_GRUPOS_AVENTURAS = ['id', 'dadosArteCapa'] as const;

export function useListagemGruposAventuras() {
    return useNoraGraphQLListagem({
        graphql: GraphqlTypesGrupoAventura,
        select: SELECT_LISTAGEM_GRUPOS_AVENTURAS,
        itensPorPagina: 12,
        carregando: 'Buscando Aventuras',
        mensagemErro: 'Houve um erro recuperando suas Aventuras',
        mensagemListaVazia: 'Nenhuma aventura encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma aventura encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where as GraphqlTypesGrupoAventura.ObtemVariosParametros['where'],
            order: { id: GraphqlOrderDirecao.DESC },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({
            where: where as GraphqlTypesGrupoAventura.ObtemVariosParametros['where'],
        }),
        criaOperacao: (obtem, parametros, select) => obtem.GrupoAventura.varios({ parametros, select }),
        criaOperacaoTotalDeRegistros: (obtem, parametros) => obtem.GrupoAventura.totalDeRegistros({ parametros }),
    });
};

export type ListagemGruposAventuras = ReturnType<typeof useListagemGruposAventuras>;