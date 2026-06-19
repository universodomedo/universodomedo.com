'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaTesteMixer__Provider, type Contexto__PaginaTesteMixer__Props, useContexto__PaginaTesteMixer } from 'Contextos/Contexto__PaginaTesteMixer/contexto';
import SPA__PaginaTesteMixer__ReceptorAudio from './paginas/SPA__PaginaTesteMixer__ReceptorAudio/SPA__PaginaTesteMixer__ReceptorAudio';

export function Conteiner__PaginaTesteMixer() {
    return (
        <Contexto__PaginaTesteMixer__Provider>
            <Conteiner__PaginaTesteMixer__Interno />
        </Contexto__PaginaTesteMixer__Provider>
    );
};

const Conteiner__PaginaTesteMixer__Interno = criaConteiner<PropsConteiner__PaginaTesteMixer>({ useEstado, resolveSaida });

type PropsConteiner__PaginaTesteMixer = Contexto__PaginaTesteMixer__Props;

function resolveSaida(props: PropsConteiner__PaginaTesteMixer): SaidaConteiner { return criaSaidaConteiner(SPA__PaginaTesteMixer__ReceptorAudio, props); };

function useEstado(): PropsConteiner__PaginaTesteMixer { return useContexto__PaginaTesteMixer(); };