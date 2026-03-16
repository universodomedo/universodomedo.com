'use client';

import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaPersonagens__ComPersonagemSelecionado } from 'Contextos/ContextoPaginaPersonagens__ComPersonagemSelecionado/contexto';
import { ContextoPaginaPersonagemProvider } from 'Contextos/ContextoPaginaPersonagem/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export const Conteiner__PaginaPersonagem = criaConteiner<PropsConteiner__PaginaPersonagem>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPersonagem = {
    personagem: PersonagemVisualizacaoDetalhadaDto;
};

function resolveSaida(props: PropsConteiner__PaginaPersonagem): SaidaConteiner {
    useConfigurarLayoutContextualizado({ titulo: null }, 'patch');

    return criaSaidaConteiner(ContextoPaginaPersonagemProvider, { personagem: props.personagem });
};

function useEstado(): PropsConteiner__PaginaPersonagem {
    const { personagem } = useContextoPaginaPersonagens__ComPersonagemSelecionado();

    return { personagem };
};