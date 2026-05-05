'use client';

import { useCallback, useMemo, useState } from 'react';
import { GraphqlOrderDirecao, GraphqlTypesGrupoAventura } from 'types-nora-api';

import { criaContextoNoraGraphQLListagem } from 'Hooks/useNoraGraphQLListagem';

export const { Provider: Contexto__PaginaMestreAventuras__Provider, useContexto: useContexto__PaginaMestreAventuras } = criaContextoNoraGraphQLListagem({
    nomeListagem: 'listagemGruposAventuras',
    mensagemErroContexto: 'useContexto__PaginaMestreAventuras precisa estar dentro de um Contexto__PaginaMestreAventuras',
    listagem: {
        graphql: GraphqlTypesGrupoAventura,
        select: ['id', 'dadosArteCapa'],
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
    },
    useExtras: () => {
        const [idGrupoAventuraSelecionada, setIdGrupoAventuraSelecionada] = useState<number | null>(null);

        const deselecionaGrupoAventura = useCallback(() => { setIdGrupoAventuraSelecionada(null); }, []);

        return useMemo(() => ({ idGrupoAventuraSelecionada, setIdGrupoAventuraSelecionada, deselecionaGrupoAventura }), [deselecionaGrupoAventura, idGrupoAventuraSelecionada]);
    },
});