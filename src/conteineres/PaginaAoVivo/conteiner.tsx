'use client';

import { useState } from 'react';
import { Eventos_Emite, SalaDeJogo_SessaoDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoPaginaAoVivo__Provider, useContextoPaginaAoVivo } from 'Contextos/ContextoPaginaAoVivo/contexto';
import { ContextoPaginaAoVivo__EmEsperaProvider } from 'Contextos/ContextoPaginaAoVivo__EmEspera/contexto';
import { ContextoPaginaAoVivo__SessaoEmAndamentoProvider } from 'Contextos/ContextoPaginaAoVivo__SessaoEmAndamento/contexto';

export function Conteiner__PaginaAoVivo() {
    return (
        <ContextoPaginaAoVivo__Provider>
            <Conteiner__PaginaAoVivo__Interno />
        </ContextoPaginaAoVivo__Provider>
    );
};

const Conteiner__PaginaAoVivo__Interno = criaConteiner<PropsConteiner__PaginaAoVivo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAoVivo = {
    sessaoEmAndamento: SalaDeJogo_SessaoDto | null;
};

function resolveSaida(props: PropsConteiner__PaginaAoVivo): SaidaConteiner {
    if (!props.sessaoEmAndamento) return criaSaidaConteiner(ContextoPaginaAoVivo__EmEsperaProvider, {});

    return criaSaidaConteiner(ContextoPaginaAoVivo__SessaoEmAndamentoProvider, { sessaoEmAndamento: props.sessaoEmAndamento });
};

function useEstado(): PropsConteiner__PaginaAoVivo {
    const { sessaoEmAndamento } = useContextoPaginaAoVivo();

    return { sessaoEmAndamento };
};