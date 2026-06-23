'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaConfigurarMusica__Provider, useContexto__PaginaConfigurarMusica } from 'Contextos/Contexto__PaginaConfigurarMusica/contexto';
import { Contexto__PaginaConfigurarMusica__Edicao__Provider } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';
import SPA__PaginaConfigurarMusica__Listagem from './paginas/SPA__PaginaConfigurarMusica__Listagem/SPA__PaginaConfigurarMusica__Listagem';

export function Conteiner__PaginaConfigurarMusica() {
    return (
        <Contexto__PaginaConfigurarMusica__Provider>
            <Conteiner__PaginaConfigurarMusica__Interno />
        </Contexto__PaginaConfigurarMusica__Provider>
    );
};

const Conteiner__PaginaConfigurarMusica__Interno = criaConteiner<PropsConteiner__PaginaConfigurarMusica>({ useEstado, resolveSaida });

type PropsConteiner__PaginaConfigurarMusica = ReturnType<typeof useContexto__PaginaConfigurarMusica>;

function resolveSaida(props: PropsConteiner__PaginaConfigurarMusica): SaidaConteiner {
    if (props.arquivoSelecionado) return criaSaidaConteiner(Contexto__PaginaConfigurarMusica__Edicao__Provider, { arquivo: props.arquivoSelecionado, deseleciona: props.deseleciona, recarregarListagem: props.recarregarListagem });

    return criaSaidaConteiner(SPA__PaginaConfigurarMusica__Listagem, { listagemMusicas: props.listagemMusicas, selecionar: props.selecionar });
};

function useEstado(): PropsConteiner__PaginaConfigurarMusica { return useContexto__PaginaConfigurarMusica(); };
