'use client';

import { ComponentType, useMemo, useState } from 'react';
import { Eventos_Emite, SessaoDto } from 'types-nora-api';

import { criaConteiner } from 'Conteineres/_core/criaConteiner';
import { ContextoPaginaAoVivo__EmEsperaProvider } from 'Contextos/ContextoPaginaAoVivo__EmEspera/contexto';
import { ContextoPaginaAoVivo__SessaoEmAndamentoProvider } from 'Contextos/ContextoPaginaAoVivo__SessaoEmAndamento/contexto';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

export const Conteiner__PaginaAoVivo = criaConteiner<PropsConteiner__PaginaAoVivo>({ useEstado, resolveComponente });

type PropsConteiner__PaginaAoVivo = {
    sessaoEmAndamento: SessaoDto | null;
};

function resolveComponente(props: PropsConteiner__PaginaAoVivo): ComponentType {
    if (!props.sessaoEmAndamento) return ContextoPaginaAoVivo__EmEsperaProvider;

    const sessaoEmAndamento = props.sessaoEmAndamento;

    return function PaginaAoVivo__SessaoEmAndamentoParametrizada() { return <ContextoPaginaAoVivo__SessaoEmAndamentoProvider sessaoEmAndamento={sessaoEmAndamento} />; };
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

    return useMemo(() => ({ sessaoEmAndamento }), [sessaoEmAndamento]);
};