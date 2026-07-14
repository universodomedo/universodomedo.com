'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorLiberarPalco__Props, Contexto__PaginaModeradorLiberarPalco__Provider, useContexto__PaginaModeradorLiberarPalco } from 'Contextos/Contexto__PaginaModeradorLiberarPalco/contexto';
import { Contexto__PaginaModeradorLiberarPalco__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorLiberarPalco__Listagem/contexto';

export function Conteiner__PaginaModeradorLiberarPalco() {
    return (
        <Contexto__PaginaModeradorLiberarPalco__Provider>
            <Conteiner__PaginaModeradorLiberarPalco__Interno />
        </Contexto__PaginaModeradorLiberarPalco__Provider>
    );
};

export const Conteiner__PaginaModeradorLiberarPalco__Interno = criaConteiner<PropsConteiner__PaginaModeradorLiberarPalco>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorLiberarPalco = Contexto__PaginaModeradorLiberarPalco__Props;

// Página de subfluxo único: a listagem de palcos ativos com a criação.
function resolveSaida(props: PropsConteiner__PaginaModeradorLiberarPalco): SaidaConteiner {
    return criaSaidaConteiner(Contexto__PaginaModeradorLiberarPalco__Listagem__Provider, props);
};

function useEstado(): PropsConteiner__PaginaModeradorLiberarPalco { return useContexto__PaginaModeradorLiberarPalco(); };