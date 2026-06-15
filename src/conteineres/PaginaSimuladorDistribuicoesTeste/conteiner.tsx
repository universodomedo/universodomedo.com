'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaSimuladorDistribuicoesTeste__Provider, type Contexto__PaginaSimuladorDistribuicoesTeste__Props, useContexto__PaginaSimuladorDistribuicoesTeste } from 'Contextos/Contexto__PaginaSimuladorDistribuicoesTeste/contexto';
import { Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao__Provider } from 'Contextos/Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao/contexto';

export function Conteiner__PaginaSimuladorDistribuicoesTeste() {
    return (
        <Contexto__PaginaSimuladorDistribuicoesTeste__Provider>
            <Conteiner__PaginaSimuladorDistribuicoesTeste__Interno />
        </Contexto__PaginaSimuladorDistribuicoesTeste__Provider>
    );
};

export const Conteiner__PaginaSimuladorDistribuicoesTeste__Interno = criaConteiner<Contexto__PaginaSimuladorDistribuicoesTeste__Props>({ useEstado, resolveSaida });

function resolveSaida(props: Contexto__PaginaSimuladorDistribuicoesTeste__Props): SaidaConteiner { return criaSaidaConteiner(Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao__Provider, { estado: props }); };

function useEstado(): Contexto__PaginaSimuladorDistribuicoesTeste__Props { return useContexto__PaginaSimuladorDistribuicoesTeste(); };