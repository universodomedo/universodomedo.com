'use client';

import { useState } from 'react';
import { Eventos_Emite, SessaoDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

import { ContextoPaginaAoVivo__EmEsperaProvider } from 'Contextos/ContextoPaginaAoVivo__EmEspera/contexto';
import { ContextoPaginaAoVivo__SessaoEmAndamentoProvider } from 'Contextos/ContextoPaginaAoVivo__SessaoEmAndamento/contexto';

export const Conteiner__PaginaAoVivo = criaConteiner<PropsConteiner__PaginaAoVivo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAoVivo = {
    sessaoEmAndamento: SessaoDto | null;
};

function resolveSaida(props: PropsConteiner__PaginaAoVivo): SaidaConteiner {
    if (!props.sessaoEmAndamento) return criaSaidaConteiner(ContextoPaginaAoVivo__EmEsperaProvider, {});

    return criaSaidaConteiner(ContextoPaginaAoVivo__SessaoEmAndamentoProvider, { sessaoEmAndamento: props.sessaoEmAndamento });
};

function useEstado(): PropsConteiner__PaginaAoVivo {
    const [sessaoEmAndamento, setSessaoEmAndamento] = useState<SessaoDto | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirSessaoEmAndamento, {
        onSuccess: data => {
            setSessaoEmAndamento(data.sessaoEmAndamento);
        },
        onError: () => {
            setSessaoEmAndamento(null);
        }
    });

    return { sessaoEmAndamento };
};