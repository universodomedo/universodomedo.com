'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorSeres__Provider, useContexto__PaginaModeradorSeres } from 'Contextos/Contexto__PaginaModeradorSeres/contexto';
import { Contexto__PaginaModeradorSeres__Cadastro__Provider } from 'Contextos/Contexto__PaginaModeradorSeres__Cadastro/contexto';
import { Contexto__PaginaModeradorSeres__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorSeres__Listagem/contexto';

export default function Conteiner__PaginaModeradorSeres() {
    return (
        <Contexto__PaginaModeradorSeres__Provider>
            <Conteiner__PaginaModeradorSeres__Interno />
        </Contexto__PaginaModeradorSeres__Provider>
    );
};

const Conteiner__PaginaModeradorSeres__Interno = criaConteiner<PropsConteiner__PaginaModeradorSeres>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorSeres = ReturnType<typeof useContexto__PaginaModeradorSeres>;

function resolveSaida(props: PropsConteiner__PaginaModeradorSeres): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaModeradorSeres__Cadastro__Provider, { cancelaCadastro: props.cancelaCadastro, concluiCadastro: props.concluiCadastro });

    return criaSaidaConteiner(Contexto__PaginaModeradorSeres__Listagem__Provider, { listagemSeres: props.listagemSeres, iniciaCadastro: props.iniciaCadastro });
};

function useEstado(): PropsConteiner__PaginaModeradorSeres { return useContexto__PaginaModeradorSeres(); };