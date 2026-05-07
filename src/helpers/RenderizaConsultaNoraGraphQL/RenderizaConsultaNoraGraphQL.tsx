'use client';

import { type ReactNode } from 'react';

import { UseNoraGraphQLConsultaResultado } from 'Hooks/useNoraGraphQLConsulta';

type RenderizaConsultaNoraGraphQLProps<TData extends object> = {
    readonly consulta: UseNoraGraphQLConsultaResultado<TData | null>;
    readonly mensagemRegistroNaoEncontrado?: string;
    readonly children: (data: TData) => ReactNode;
};

export default function RenderizaConsultaNoraGraphQL<TData extends object>({ consulta, mensagemRegistroNaoEncontrado = 'Registro não encontrado.', children }: RenderizaConsultaNoraGraphQLProps<TData>) {
    if (consulta.carregando) return <div>{consulta.carregando}</div>;
    if (consulta.erro) return <div>{consulta.erro}</div>;
    if (!consulta.data) return <div>{mensagemRegistroNaoEncontrado}</div>;

    return <>{children(consulta.data)}</>;
};