'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoPaginaRascunhosMestreProvider, useContextoPaginaRascunhosMestre } from 'Contextos/ContextoPaginaRascunhosMestreProvider/contexto';

export default function Conteiner_PaginaRascunhos() {
    return (
        <ContextoPaginaRascunhosMestreProvider>
            <Container_PaginaRascunhos__Interno />
        </ContextoPaginaRascunhosMestreProvider>
    );
};

const Container_PaginaRascunhos__Interno = criaConteiner<PropsContainer_PaginaRascunhos>({ useEstado, resolveSaida });

type PropsContainer_PaginaRascunhos = {

};

function resolveSaida(props: PropsContainer_PaginaRascunhos): SaidaConteiner {

};

function useEstado(): PropsContainer_PaginaRascunhos {
    const {  } = useContextoPaginaRascunhosMestre();

    return {  };
};