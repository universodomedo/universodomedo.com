'use client';

import { GraphqlTypesGrupoAventura } from 'types-nora-api';

import { criaContextoNoraGraphQLConsulta } from 'Hooks/useNoraGraphQLConsulta';
import { useContexto__PaginaMestreAventuras } from '../Contexto__PaginaMestreAventuras/contexto';
import SPA__PaginaMestreAventuras__ComAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__ComAventuraSelecionada/SPA__PaginaMestreAventuras__ComAventuraSelecionada';

type Contexto__PaginaMestreAventuras__Props = ReturnType<typeof useContexto__PaginaMestreAventuras>;

export const { Provider: Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Provider, useContexto: useContexto__PaginaMestreAventuras__ComAventuraSelecionada } = criaContextoNoraGraphQLConsulta({
    nomeConsulta: 'grupoAventuraSelecionado',
    mensagemErroContexto: 'useContexto__PaginaMestreAventuras__ComAventuraSelecionada precisa estar dentro de um Contexto__PaginaMestreAventuras__ComAventuraSelecionada',
    renderiza: SPA__PaginaMestreAventuras__ComAventuraSelecionada,
    consulta: {
        graphql: GraphqlTypesGrupoAventura,
        select: ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'],
        carregando: 'Buscando Aventura',
        mensagemErro: 'Houve um erro recuperando a Aventura selecionada',
        carregamento: 'BLOQUEIA_INTERFACE',
        criaOperacao: (obtem, props: { readonly idGrupoAventuraSelecionado: number; readonly deselecionaGrupoAventura: Contexto__PaginaMestreAventuras__Props['deselecionaGrupoAventura']; }, select) => obtem.GrupoAventura.um({
            parametros: { where: { id: { eq: props.idGrupoAventuraSelecionado, }, }, }, select,
        }),
    },
    useExtras: ({ props }) => ({
        deselecionaGrupoAventura: props.deselecionaGrupoAventura,
    }),
});