'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModoSolo__Props, Contexto__PaginaModoSolo__Provider, useContexto__PaginaModoSolo } from 'Contextos/Contexto__PaginaModoSolo/contexto';
import SPA__PaginaModoSolo from './paginas/SPA__PaginaModoSolo/SPA__PaginaModoSolo';

export default function Conteiner__PaginaModoSolo() {
    return (
        <Contexto__PaginaModoSolo__Provider>
            <Conteiner__PaginaModoSolo__Interno />
        </Contexto__PaginaModoSolo__Provider>
    );
};

const Conteiner__PaginaModoSolo__Interno = criaConteiner<PropsConteiner__PaginaModoSolo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModoSolo = Contexto__PaginaModoSolo__Props;

function resolveSaida(props: PropsConteiner__PaginaModoSolo): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaModoSolo, props);
};

function useEstado(): PropsConteiner__PaginaModoSolo { return useContexto__PaginaModoSolo(); };
