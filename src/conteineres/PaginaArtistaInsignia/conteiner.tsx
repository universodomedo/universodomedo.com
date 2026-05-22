'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaArtistaInsignia__Props, Contexto__PaginaArtistaInsignia__Provider, useContexto__PaginaArtistaInsignia } from 'Contextos/Contexto__PaginaArtistaInsignia/contexto';
import { Contexto__PaginaArtistaInsignia__NovaInsignia__Provider } from 'Contextos/Contexto__PaginaArtistaInsignia__NovaInsignia/contexto';
import { Contexto__PaginaArtistaInsignia__Listagem__Provider } from 'Contextos/Contexto__PaginaArtistaInsignia__Listagem/contexto';

export function Conteiner__PaginaArtistaInsignia() {
    return (
        <Contexto__PaginaArtistaInsignia__Provider>
            <Conteiner__PaginaArtistaInsignia__Interno />
        </Contexto__PaginaArtistaInsignia__Provider>
    );
};

export const Conteiner__PaginaArtistaInsignia__Interno = criaConteiner<PropsConteiner__PaginaArtistaInsignia>({ useEstado, resolveSaida });

type PropsConteiner__PaginaArtistaInsignia = Contexto__PaginaArtistaInsignia__Props;

function resolveSaida(props: PropsConteiner__PaginaArtistaInsignia): SaidaConteiner {
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaArtistaInsignia__NovaInsignia__Provider, { });
    
    return criaSaidaConteiner(Contexto__PaginaArtistaInsignia__Listagem__Provider, { listagemInsignias: props.listagemInsignias, estaEmProcessoCriacao: props.estaEmProcessoCriacao, setEstaEmProcessoCriacao: props.setEstaEmProcessoCriacao });
};

function useEstado(): PropsConteiner__PaginaArtistaInsignia { return useContexto__PaginaArtistaInsignia(); };