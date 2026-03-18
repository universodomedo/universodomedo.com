'use client';

import { SessaoCompletaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaSessoes__ComSessaoSelecionada } from 'Contextos/ContextoPaginaSessoes__ComSessaoSelecionada/contexto';
import { ContextoPaginaVisualizacaoSessaoProvider } from 'Contextos/ContextoPaginaVisualizacaoSessao/contexto';

export const Conteiner__PaginaVisualizacaoSessao = criaConteiner<PropsConteiner__PaginaVisualizacaoSessao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaVisualizacaoSessao = {
    sessaoSelecionada: SessaoCompletaDto;
    deselecionaSessao: () => void;
};

function resolveSaida(props: PropsConteiner__PaginaVisualizacaoSessao): SaidaConteiner {
    return criaSaidaConteiner(ContextoPaginaVisualizacaoSessaoProvider, { sessao: props.sessaoSelecionada, deselecionaSessao: props.deselecionaSessao });
};

function useEstado(): PropsConteiner__PaginaVisualizacaoSessao {
    const { sessaoSelecionada, deselecionaSessao } = useContextoPaginaSessoes__ComSessaoSelecionada();

    return { sessaoSelecionada, deselecionaSessao };
};