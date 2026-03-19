'use client';

import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaFichasTemporarias } from 'Contextos/ContextoPaginaFichasTemporarias/contexto';
import { ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProvider } from 'Contextos/ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada/contexto';
import { ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProvider } from 'Contextos/ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada/contexto';

export const Conteiner__PaginaFichasTemporarias = criaConteiner<PropsConteiner__PaginaFichasTemporarias>({ useEstado, resolveSaida });

type PropsConteiner__PaginaFichasTemporarias = {
    fichasTemporarias: FichaTemporariaVisualizacaoDetalhadaDto[];
    fichaTemporariaSelecionada: FichaTemporariaVisualizacaoDetalhadaDto | null;
    deselecionaFicha: () => void;
};

function resolveSaida(props: PropsConteiner__PaginaFichasTemporarias): SaidaConteiner {
    if (props.fichaTemporariaSelecionada) return criaSaidaConteiner(ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProvider, { fichaTemporaria: props.fichaTemporariaSelecionada, acaoVoltar: props.deselecionaFicha });

    return criaSaidaConteiner(ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProvider, { fichasTemporarias: props.fichasTemporarias });
};

function useEstado(): PropsConteiner__PaginaFichasTemporarias {
    const { fichasTemporarias, fichaTemporariaSelecionada, deselecionaFicha } = useContextoPaginaFichasTemporarias();

    return { fichasTemporarias, fichaTemporariaSelecionada, deselecionaFicha };
};