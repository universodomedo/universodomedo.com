'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAcessar__Props, Contexto__PaginaAcessar__Provider, useContexto__PaginaAcessar } from 'Contextos/Contexto__PaginaAcessar/contexto';
import { Contexto__PaginaAcessar__Login__Provider } from 'Contextos/Contexto__PaginaAcessar__Login/contexto';
import { Contexto__PaginaAcessar__Recuperar__Provider } from 'Contextos/Contexto__PaginaAcessar__Recuperar/contexto';
import { Contexto__PaginaAcessar__Redefinir__Provider } from 'Contextos/Contexto__PaginaAcessar__Redefinir/contexto';

export function Conteiner__PaginaAcessar() {
    return (
        <Contexto__PaginaAcessar__Provider>
            <Conteiner__PaginaAcessar__Interno />
        </Contexto__PaginaAcessar__Provider>
    );
};

export const Conteiner__PaginaAcessar__Interno = criaConteiner<PropsConteiner__PaginaAcessar>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAcessar = Contexto__PaginaAcessar__Props;

function resolveSaida(props: PropsConteiner__PaginaAcessar): SaidaConteiner {
    if (props.etapa === 'RECUPERAR') return criaSaidaConteiner(Contexto__PaginaAcessar__Recuperar__Provider, { voltarParaLogin: props.voltarParaLogin });
    if (props.etapa === 'REDEFINIR') return criaSaidaConteiner(Contexto__PaginaAcessar__Redefinir__Provider, { tokenRecuperacao: props.tokenRecuperacao ?? '', voltarParaLogin: props.voltarParaLogin });
    return criaSaidaConteiner(Contexto__PaginaAcessar__Login__Provider, { verificacaoEmail: props.verificacaoEmail, recusaDiscord: props.recusaDiscord, aoEntrar: props.aoEntrar, irParaRecuperar: props.irParaRecuperar });
};

function useEstado(): PropsConteiner__PaginaAcessar { return useContexto__PaginaAcessar(); };