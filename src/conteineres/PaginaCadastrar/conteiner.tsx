'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaCadastrar__Props, Contexto__PaginaCadastrar__Provider, useContexto__PaginaCadastrar } from 'Contextos/Contexto__PaginaCadastrar/contexto';
import { Contexto__PaginaCadastrar__Formulario__Provider } from 'Contextos/Contexto__PaginaCadastrar__Formulario/contexto';
import { Contexto__PaginaCadastrar__EmailEnviado__Provider } from 'Contextos/Contexto__PaginaCadastrar__EmailEnviado/contexto';

export function Conteiner__PaginaCadastrar() {
    return (
        <Contexto__PaginaCadastrar__Provider>
            <Conteiner__PaginaCadastrar__Interno />
        </Contexto__PaginaCadastrar__Provider>
    );
};

export const Conteiner__PaginaCadastrar__Interno = criaConteiner<PropsConteiner__PaginaCadastrar>({ useEstado, resolveSaida });

type PropsConteiner__PaginaCadastrar = Contexto__PaginaCadastrar__Props;

function resolveSaida(props: PropsConteiner__PaginaCadastrar): SaidaConteiner {
    if (props.etapa === 'EMAIL_ENVIADO') return criaSaidaConteiner(Contexto__PaginaCadastrar__EmailEnviado__Provider, { email: props.emailEnviadoPara ?? '' });
    return criaSaidaConteiner(Contexto__PaginaCadastrar__Formulario__Provider, { aoCadastrar: props.aoCadastrar });
};

function useEstado(): PropsConteiner__PaginaCadastrar { return useContexto__PaginaCadastrar(); };