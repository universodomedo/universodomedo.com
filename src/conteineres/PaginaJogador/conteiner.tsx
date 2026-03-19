'use client';

import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { ContextoPaginaJogadorProvider, useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';

import { ContextoPaginaJogador__PaginaInicialProvider } from 'Contextos/ContextoPaginaJogador__PaginaInicial/contexto';
import { ContextoVincularJogadorSessaoProvider } from 'Contextos/ContextoVincularJogadorSessaoProvider/contexto';

export function Conteiner__PaginaJogador() {
    return (
        <ContextoPaginaJogadorProvider idTipoPersonagem={1}>
            <Conteiner__PaginaJogador__Interno />
        </ContextoPaginaJogadorProvider>
    );
};

const Conteiner__PaginaJogador__Interno = criaConteiner<PropsConteiner__PaginaJogador>({ useEstado, resolveSaida });

type PropsConteiner__PaginaJogador = {
    sessaoEmFoco: VIEW_SessaoDeJogadorDto | null;
    setIdSessaoEmFoco: (v: number | null) => void;
    fichas: FichaTemporariaVisualizacaoDetalhadaDto[];
};

function resolveSaida(props: PropsConteiner__PaginaJogador): SaidaConteiner {
    if (!props.sessaoEmFoco) return criaSaidaConteiner(ContextoPaginaJogador__PaginaInicialProvider, {});

    return criaSaidaConteiner(ContextoVincularJogadorSessaoProvider, { sessao: props.sessaoEmFoco, fichasUsuario: props.fichas, acaoParaVoltarPagina: () => { props.setIdSessaoEmFoco(null) } });
};

function useEstado(): PropsConteiner__PaginaJogador {
    const { sessaoEmFoco, setIdSessaoEmFoco, fichas } = useContextoPaginaJogador();

    return { sessaoEmFoco, setIdSessaoEmFoco, fichas };
};