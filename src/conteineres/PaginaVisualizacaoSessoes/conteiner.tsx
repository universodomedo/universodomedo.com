'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoPaginasListagemSessoesProvider, useContextoPaginasListagemSessoes, type ContextoPaginasListagemSessoesProps } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { ContextoPaginaSessoes__ComSessaoSelecionadaProvider } from 'Contextos/ContextoPaginaSessoes__ComSessaoSelecionada/contexto';
import { ContextoPaginaSessoes__SemSessaoSelecionadaProvider } from 'Contextos/ContextoPaginaSessoes__SemSessaoSelecionada/contexto';

export default function Conteiner__PaginaVisualizacaoSessoes({ idSessaoInicial }: { idSessaoInicial: number | null; }) {
    return (
        <ContextoPaginasListagemSessoesProvider idSessaoInicial={idSessaoInicial}>
            <Conteiner__PaginaVisualizacaoSessoes__Interno />
        </ContextoPaginasListagemSessoesProvider>
    );
};

const Conteiner__PaginaVisualizacaoSessoes__Interno = criaConteiner<PropsConteiner__PaginaVisualizacaoSessoes>({ useEstado, resolveSaida });

type PropsConteiner__PaginaVisualizacaoSessoes = ContextoPaginasListagemSessoesProps;

function resolveSaida(props: PropsConteiner__PaginaVisualizacaoSessoes): SaidaConteiner {
    if (props.idSessaoSelecionada) return criaSaidaConteiner(ContextoPaginaSessoes__ComSessaoSelecionadaProvider, { idSessaoSelecionada: props.idSessaoSelecionada, deselecionaSessao: props.deselecionaSessao });

    return criaSaidaConteiner(ContextoPaginaSessoes__SemSessaoSelecionadaProvider, { sessoes: props.sessoes, selecionaSessao: props.setIdSessaoSelecionada });
};

function useEstado(): PropsConteiner__PaginaVisualizacaoSessoes { return useContextoPaginasListagemSessoes(); };