'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGerenciarDimensoes__Provider, useContexto__PaginaGerenciarDimensoes } from 'Contextos/Contexto__PaginaGerenciarDimensoes/contexto';
import SPA__PaginaGerenciarDimensoes__Gestao from './paginas/SPA__PaginaGerenciarDimensoes__Gestao/SPA__PaginaGerenciarDimensoes__Gestao';

export function Conteiner__PaginaGerenciarDimensoes() {
    return (
        <Contexto__PaginaGerenciarDimensoes__Provider>
            <Conteiner__PaginaGerenciarDimensoes__Interno />
        </Contexto__PaginaGerenciarDimensoes__Provider>
    );
};

const Conteiner__PaginaGerenciarDimensoes__Interno = criaConteiner<PropsConteiner__PaginaGerenciarDimensoes>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGerenciarDimensoes = ReturnType<typeof useContexto__PaginaGerenciarDimensoes>;

function resolveSaida(props: PropsConteiner__PaginaGerenciarDimensoes): SaidaConteiner { return criaSaidaConteiner(SPA__PaginaGerenciarDimensoes__Gestao, props); };

function useEstado(): PropsConteiner__PaginaGerenciarDimensoes { return useContexto__PaginaGerenciarDimensoes(); };
