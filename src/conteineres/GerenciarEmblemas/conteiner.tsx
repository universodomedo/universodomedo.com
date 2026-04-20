

'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoGerenciarEmblemas__Provider } from 'Contextos/ContextoGerenciarEmblemas/contexto';

export function Conteiner__GerenciarEmblemas() {
    return (
        <ContextoGerenciarEmblemas__Provider>
            <Conteiner__GerenciarEmblemas__Interno />
        </ContextoGerenciarEmblemas__Provider>
    );
};

export const Conteiner__GerenciarEmblemas__Interno = criaConteiner<PropsConteiner__GerenciarEmblemas>({ useEstado, resolveSaida });

type PropsConteiner__GerenciarEmblemas = {

};

function resolveSaida(props: PropsConteiner__GerenciarEmblemas): SaidaConteiner {
    return criaSaidaConteiner(nullable, { });
};

function useEstado(): PropsConteiner__GerenciarEmblemas {
    // const { } = useContextoGerenciarEmblemas();

    return { };
};

function nullable() { return <></>; };