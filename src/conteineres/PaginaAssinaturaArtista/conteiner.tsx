'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAssinaturaArtista__Props, Contexto__PaginaAssinaturaArtista__Provider, useContexto__PaginaAssinaturaArtista } from 'Contextos/Contexto__PaginaAssinaturaArtista/contexto';
import { Contexto__PaginaAssinaturaArtista__Edicao__Provider } from 'Contextos/Contexto__PaginaAssinaturaArtista__Edicao/contexto';

export function Conteiner__PaginaAssinaturaArtista() {
    return (
        <Contexto__PaginaAssinaturaArtista__Provider>
            <Conteiner__PaginaAssinaturaArtista__Interno />
        </Contexto__PaginaAssinaturaArtista__Provider>
    );
};

export const Conteiner__PaginaAssinaturaArtista__Interno = criaConteiner<PropsConteiner__PaginaAssinaturaArtista>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAssinaturaArtista = Contexto__PaginaAssinaturaArtista__Props;

function resolveSaida(props: PropsConteiner__PaginaAssinaturaArtista): SaidaConteiner {
    // Registro único por usuário: sempre o subfluxo de edição (sem listagem).
    return criaSaidaConteiner(Contexto__PaginaAssinaturaArtista__Edicao__Provider, { assinaturaAtual: props.assinaturaAtual, carregando: props.carregando, aoSalvar: props.aoSalvar });
};

function useEstado(): PropsConteiner__PaginaAssinaturaArtista { return useContexto__PaginaAssinaturaArtista(); };
