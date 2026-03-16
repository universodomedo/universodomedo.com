'use client';

import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { ContextoPaginaPersonagens__ComPersonagemSelecionadoProvider } from 'Contextos/ContextoPaginaPersonagens__ComPersonagemSelecionado/contexto';
import { ContextoPaginaPersonagens__SemPersonagemSelecionadoProvider } from 'Contextos/ContextoPaginaPersonagens__SemPersonagemSelecionado/contexto';

export const Conteiner__PaginaPersonagens = criaConteiner<PropsConteiner__PaginaPersonagens>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPersonagens = {
    personagemSelecionado: PersonagemVisualizacaoDetalhadaDto | null;
};

function resolveSaida(props: PropsConteiner__PaginaPersonagens): SaidaConteiner {
    if (props.personagemSelecionado) return criaSaidaConteiner(ContextoPaginaPersonagens__ComPersonagemSelecionadoProvider, { personagem: props.personagemSelecionado });

    return criaSaidaConteiner(ContextoPaginaPersonagens__SemPersonagemSelecionadoProvider, { });
};

function useEstado(): PropsConteiner__PaginaPersonagens {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return { personagemSelecionado };
};