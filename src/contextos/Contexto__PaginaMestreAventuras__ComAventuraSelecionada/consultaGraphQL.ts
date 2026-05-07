'use client';

import { GraphqlTypesGrupoAventura } from 'types-nora-api';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';

type UseConsultaGrupoAventuraSelecionadaParams = {
    readonly idGrupoAventuraSelecionado: number;
};

const SELECT_GRUPO_AVENTURA_SELECIONADO = ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'] as const;

export function useConsultaGrupoAventuraSelecionada(params: UseConsultaGrupoAventuraSelecionadaParams) {
    return useNoraGraphQLRegistro({
        graphql: GraphqlTypesGrupoAventura,
        select: SELECT_GRUPO_AVENTURA_SELECIONADO,
        props: params,
        carregando: 'Buscando Aventura',
        mensagemErro: 'Houve um erro recuperando a Aventura selecionada',
        carregamento: 'BLOQUEIA_INTERFACE',
        criaOperacao: (obtem, props, select) => obtem.GrupoAventura.um({ parametros: { where: { id: { eq: props.idGrupoAventuraSelecionado } } }, select }),
    });
};

export type GrupoAventuraSelecionado = NonNullable<ReturnType<typeof useConsultaGrupoAventuraSelecionada>['data']>;