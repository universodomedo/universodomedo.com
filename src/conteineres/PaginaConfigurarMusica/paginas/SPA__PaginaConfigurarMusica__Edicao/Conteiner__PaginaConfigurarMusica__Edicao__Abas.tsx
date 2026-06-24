'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContexto__PaginaConfigurarMusica__Edicao__Abas } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao__Abas/contexto';
import AbaMontagem from './abas/AbaMontagem';
import AbaClima from './abas/AbaClima';

type PropsConteiner__PaginaConfigurarMusica__Edicao__Abas = ReturnType<typeof useContexto__PaginaConfigurarMusica__Edicao__Abas>;

function resolveSaida(props: PropsConteiner__PaginaConfigurarMusica__Edicao__Abas): SaidaConteiner {
    if (props.abaAtual === 'CLIMA') return criaSaidaConteiner(AbaClima, {});
    return criaSaidaConteiner(AbaMontagem, {});
};

function useEstado(): PropsConteiner__PaginaConfigurarMusica__Edicao__Abas { return useContexto__PaginaConfigurarMusica__Edicao__Abas(); };

export const Conteiner__PaginaConfigurarMusica__Edicao__Abas = criaConteiner<PropsConteiner__PaginaConfigurarMusica__Edicao__Abas>({ useEstado, resolveSaida });
