'use client';

import { AventuraCompletaDto, AventuraParaAssistirDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { RegistroSessaoSelecionadaParaAssistir, useContextoPaginaAssistir } from 'Contextos/ContextoPaginaAssistir/contexto';
import { ContextoPaginaAssistir__SessaoSelecionadaProvider } from 'Contextos/ContextoPaginaAssistir__SessaoSelecionada/contexto';
import { ContextoPaginaAssistir__AventuraSelecionadaProvider } from 'Contextos/ContextoPaginaAssistir__AventuraSelecionada/contexto';
import { ContextoPaginaAssistir__PaginaInicialProvider } from 'Contextos/ContextoPaginaAssistir__PaginaInicial/contexto';

export const Conteiner__PaginaAssistir = criaConteiner<PropsConteiner__PaginaAssistir>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAssistir = {
    aventurasListadas: AventuraParaAssistirDto[];
    aventuraSelecionada: AventuraCompletaDto | null;
    registroSessaoSelecionada: RegistroSessaoSelecionadaParaAssistir | null;
};

function resolveSaida(props: PropsConteiner__PaginaAssistir): SaidaConteiner {
    if (props.registroSessaoSelecionada) return criaSaidaConteiner(ContextoPaginaAssistir__SessaoSelecionadaProvider, { registroSessaoSelecionada: props.registroSessaoSelecionada });

    if (props.aventuraSelecionada) return criaSaidaConteiner(ContextoPaginaAssistir__AventuraSelecionadaProvider, { aventura: props.aventuraSelecionada });

    return criaSaidaConteiner(ContextoPaginaAssistir__PaginaInicialProvider, {});
};

function useEstado(): PropsConteiner__PaginaAssistir {
    const { aventurasListadas, aventuraSelecionada, registroSessaoSelecionada } = useContextoPaginaAssistir();

    return { aventurasListadas, aventuraSelecionada, registroSessaoSelecionada };
};