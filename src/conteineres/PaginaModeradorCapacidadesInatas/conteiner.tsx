'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorCapacidadesInatas__Provider, useContexto__PaginaModeradorCapacidadesInatas } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas/contexto';
import { Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Provider } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas__Cadastro/contexto';
import { Contexto__PaginaModeradorCapacidadesInatas__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas__Listagem/contexto';

export default function Conteiner__PaginaModeradorCapacidadesInatas() {
    return (
        <Contexto__PaginaModeradorCapacidadesInatas__Provider>
            <Conteiner__PaginaModeradorCapacidadesInatas__Interno />
        </Contexto__PaginaModeradorCapacidadesInatas__Provider>
    );
};

const Conteiner__PaginaModeradorCapacidadesInatas__Interno = criaConteiner<PropsConteiner__PaginaModeradorCapacidadesInatas>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorCapacidadesInatas = ReturnType<typeof useContexto__PaginaModeradorCapacidadesInatas>;

function resolveSaida(props: PropsConteiner__PaginaModeradorCapacidadesInatas): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Provider, { cancelaCadastro: props.cancelaCadastro, concluiCadastro: props.concluiCadastro });

    return criaSaidaConteiner(Contexto__PaginaModeradorCapacidadesInatas__Listagem__Provider, { listagemCapacidadesInatas: props.listagemCapacidadesInatas, iniciaCadastro: props.iniciaCadastro });
};

function useEstado(): PropsConteiner__PaginaModeradorCapacidadesInatas { return useContexto__PaginaModeradorCapacidadesInatas(); };