'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaSimuladorTestePericiaUdm__Provider, type Contexto__PaginaSimuladorTestePericiaUdm__Props, useContexto__PaginaSimuladorTestePericiaUdm } from 'Contextos/Contexto__PaginaSimuladorTestePericiaUdm/contexto';
import { Contexto__PaginaSimuladorTestePericiaUdm__Comparacao__Provider } from 'Contextos/Contexto__PaginaSimuladorTestePericiaUdm__Comparacao/contexto';

export function Conteiner__PaginaSimuladorTestePericiaUdm() {
    return (
        <Contexto__PaginaSimuladorTestePericiaUdm__Provider>
            <Conteiner__PaginaSimuladorTestePericiaUdm__Interno />
        </Contexto__PaginaSimuladorTestePericiaUdm__Provider>
    );
};

export const Conteiner__PaginaSimuladorTestePericiaUdm__Interno = criaConteiner<Contexto__PaginaSimuladorTestePericiaUdm__Props>({ useEstado, resolveSaida });

function resolveSaida(props: Contexto__PaginaSimuladorTestePericiaUdm__Props): SaidaConteiner { return criaSaidaConteiner(Contexto__PaginaSimuladorTestePericiaUdm__Comparacao__Provider, { estado: props }); };

function useEstado(): Contexto__PaginaSimuladorTestePericiaUdm__Props { return useContexto__PaginaSimuladorTestePericiaUdm(); };