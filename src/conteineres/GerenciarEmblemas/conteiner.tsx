

'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__GerenciarEmblemas__Props, Contexto__GerenciarEmblemas__Provider, useContexto__GerenciarEmblemas } from '@/contextos/Contexto__GerenciarEmblemas/contexto';
import { Contexto__GerenciarEmblemas__Listagem__Provider } from 'Contextos/Contexto__GerenciarEmblemas__Listagem/contexto';

export function Conteiner__GerenciarEmblemas() {
    return (
        <Contexto__GerenciarEmblemas__Provider>
            <Conteiner__GerenciarEmblemas__Interno />
        </Contexto__GerenciarEmblemas__Provider>
    );
};

export const Conteiner__GerenciarEmblemas__Interno = criaConteiner<PropsConteiner__GerenciarEmblemas>({ useEstado, resolveSaida });

type PropsConteiner__GerenciarEmblemas = Contexto__GerenciarEmblemas__Props;

function resolveSaida(props: PropsConteiner__GerenciarEmblemas): SaidaConteiner {
    return criaSaidaConteiner(Contexto__GerenciarEmblemas__Listagem__Provider, { });
    // return criaSaidaConteiner(Contexto__GerenciarEmblemas__Listagem__Provider, { emblemas: props.emblemas, selecionaEmblema: props.setIdEmblemaSelecionado });
};

function useEstado(): PropsConteiner__GerenciarEmblemas { return useContexto__GerenciarEmblemas(); };