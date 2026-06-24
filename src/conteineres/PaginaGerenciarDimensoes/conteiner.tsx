'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGerenciarDimensoes__Provider, useContexto__PaginaGerenciarDimensoes } from 'Contextos/Contexto__PaginaGerenciarDimensoes/contexto';
import { Contexto__PaginaGerenciarDimensoes__Listagem__Provider } from 'Contextos/Contexto__PaginaGerenciarDimensoes__Listagem/contexto';
import { Contexto__PaginaGerenciarDimensoes__NovaDimensao__Provider } from 'Contextos/Contexto__PaginaGerenciarDimensoes__NovaDimensao/contexto';

export function Conteiner__PaginaGerenciarDimensoes() {
    return (
        <Contexto__PaginaGerenciarDimensoes__Provider>
            <Conteiner__PaginaGerenciarDimensoes__Interno />
        </Contexto__PaginaGerenciarDimensoes__Provider>
    );
};

const Conteiner__PaginaGerenciarDimensoes__Interno = criaConteiner<PropsConteiner__PaginaGerenciarDimensoes>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGerenciarDimensoes = ReturnType<typeof useContexto__PaginaGerenciarDimensoes>;

function resolveSaida(props: PropsConteiner__PaginaGerenciarDimensoes): SaidaConteiner {
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaGerenciarDimensoes__NovaDimensao__Provider, { cancelaCriacao: props.cancelaCriacao, concluiCriacao: props.concluiCriacao });

    return criaSaidaConteiner(Contexto__PaginaGerenciarDimensoes__Listagem__Provider, { listagemDimensoes: props.listagemDimensoes, iniciaCriacao: props.iniciaCriacao });
};

function useEstado(): PropsConteiner__PaginaGerenciarDimensoes { return useContexto__PaginaGerenciarDimensoes(); };
