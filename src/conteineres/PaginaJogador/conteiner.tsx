'use client';

import { SessaoDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { ContextoPaginaJogadorProvider, useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';

import { ContextoPaginaJogador__PaginaInicialProvider } from 'Contextos/ContextoPaginaJogador__PaginaInicial/contexto';
import { ContextoPaginaJogador__SelecionandoFichaParaSessaoProvider } from 'Contextos/ContextoPaginaJogador__SelecionandoFichaParaSessao/contexto';

export function Conteiner__PaginaJogador() {
    return (
        <ContextoPaginaJogadorProvider idTipoPersonagem={1}>
            <Conteiner__PaginaJogador__Interno />
        </ContextoPaginaJogadorProvider>
    );
};

const Conteiner__PaginaJogador__Interno = criaConteiner<PropsConteiner__PaginaJogador>({ useEstado, resolveSaida });

type PropsConteiner__PaginaJogador = {
    sessaoEmFoco: SessaoDto | null;
    setIdSessaoEmFoco: (v: number | null) => void;
};

function resolveSaida(props: PropsConteiner__PaginaJogador): SaidaConteiner {
    if (!props.sessaoEmFoco) return criaSaidaConteiner(ContextoPaginaJogador__PaginaInicialProvider, {});

    return criaSaidaConteiner(ContextoPaginaJogador__SelecionandoFichaParaSessaoProvider, { sessao: props.sessaoEmFoco, voltarParaPaginaInicialJogador: () => { props.setIdSessaoEmFoco(null) } });
};

function useEstado(): PropsConteiner__PaginaJogador {
    const { sessaoEmFoco, setIdSessaoEmFoco } = useContextoPaginaJogador();

    return { sessaoEmFoco, setIdSessaoEmFoco };
};