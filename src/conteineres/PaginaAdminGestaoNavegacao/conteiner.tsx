'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminGestaoNavegacao__Props, Contexto__PaginaAdminGestaoNavegacao__Provider, useContexto__PaginaAdminGestaoNavegacao } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';
import { Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Provider } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__NovoMenu/contexto';
import { Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__Listagem/contexto';

export function Conteiner__PaginaAdminGestaoNavegacao() {
    return (
        <Contexto__PaginaAdminGestaoNavegacao__Provider>
            <Conteiner__PaginaAdminGestaoNavegacao__Interno />
        </Contexto__PaginaAdminGestaoNavegacao__Provider>
    );
};

export const Conteiner__PaginaAdminGestaoNavegacao__Interno = criaConteiner<PropsConteiner__PaginaAdminGestaoNavegacao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminGestaoNavegacao = Contexto__PaginaAdminGestaoNavegacao__Props;

function resolveSaida(props: PropsConteiner__PaginaAdminGestaoNavegacao): SaidaConteiner {
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Provider, { setEstaEmProcessoCriacao: props.setEstaEmProcessoCriacao, recarregarListagem: props.listagemMenus.recarregar });

    return criaSaidaConteiner(Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider, { listagemMenus: props.listagemMenus, estaEmProcessoCriacao: props.estaEmProcessoCriacao, setEstaEmProcessoCriacao: props.setEstaEmProcessoCriacao });
};

function useEstado(): PropsConteiner__PaginaAdminGestaoNavegacao { return useContexto__PaginaAdminGestaoNavegacao(); };
