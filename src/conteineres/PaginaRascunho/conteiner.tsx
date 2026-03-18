

'use client';

import { RascunhoCompletaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaRascunhosMestre__ComRascunhoSelecionado } from 'Contextos/ContextoPaginaRascunhosMestre__ComRascunhoSelecionado/contexto';
import { ContextoRascunhoProvider } from 'Contextos/ContextoRascunho/contexto';

export const Conteiner__PaginaRascunho = criaConteiner<PropsConteiner__PaginaRascunho>({ useEstado, resolveSaida });

type PropsConteiner__PaginaRascunho = {
    rascunho: RascunhoCompletaDto;
};

function resolveSaida(props: PropsConteiner__PaginaRascunho): SaidaConteiner {
    return criaSaidaConteiner(ContextoRascunhoProvider, { rascunho: props.rascunho });
};

function useEstado(): PropsConteiner__PaginaRascunho {
    const { rascunho } = useContextoPaginaRascunhosMestre__ComRascunhoSelecionado();

    return { rascunho };
};