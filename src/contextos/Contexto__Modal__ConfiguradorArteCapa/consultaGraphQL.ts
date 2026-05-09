'use client';

import { GraphqlOrderDirecao, GraphqlTypesArquivoTipadoArte } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

const SELECT_LISTAGEM_ARTES_CAPAS = ['id', 'dadosArteCapa'] as const;

export function useListagemArtesCapas() {
    return useNoraGraphQLListagem({
        graphql: GraphqlTypesArquivoTipadoArte,
        select: SELECT_LISTAGEM_ARTES_CAPAS,
        itensPorPagina: 12,
        carregando: 'Buscando Capas',
        mensagemErro: 'Houve um erro recuperando as Capas existentes',
        mensagemListaVazia: 'Nenhuma capa encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capa encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where as GraphqlTypesArquivoTipadoArte.ObtemVariosParametros['where'],
            order: { id: GraphqlOrderDirecao.DESC },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({
            where: where as GraphqlTypesArquivoTipadoArte.ObtemVariosParametros['where'],
        }),
        criaOperacao: (obtem, parametros, select) => obtem.ArquivoTipadoArte.varios({ parametros, select }),
        criaOperacaoTotalDeRegistros: (obtem, parametros) => obtem.ArquivoTipadoArte.totalDeRegistros({ parametros }),
    });
};