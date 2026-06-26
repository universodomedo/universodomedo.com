'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaPartidas__Props, Contexto__PaginaPartidas__Provider, useContexto__PaginaPartidas } from 'Contextos/Contexto__PaginaPartidas/contexto';
import SPA__PaginaPartidas from './paginas/SPA__PaginaPartidas/SPA__PaginaPartidas';

export default function Conteiner__PaginaPartidas() {
    return (
        <Contexto__PaginaPartidas__Provider>
            <Conteiner__PaginaPartidas__Interno />
        </Contexto__PaginaPartidas__Provider>
    );
};

const Conteiner__PaginaPartidas__Interno = criaConteiner<PropsConteiner__PaginaPartidas>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPartidas = Contexto__PaginaPartidas__Props;

function resolveSaida(props: PropsConteiner__PaginaPartidas): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaPartidas, props);
};

function useEstado(): PropsConteiner__PaginaPartidas { return useContexto__PaginaPartidas(); };
