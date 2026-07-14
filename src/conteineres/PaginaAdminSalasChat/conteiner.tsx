'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminSalasChat__Props, Contexto__PaginaAdminSalasChat__Provider, useContexto__PaginaAdminSalasChat } from 'Contextos/Contexto__PaginaAdminSalasChat/contexto';
import { Contexto__PaginaAdminSalasChat__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminSalasChat__Listagem/contexto';
import { Contexto__PaginaAdminSalasChat__FormularioSala__Provider } from 'Contextos/Contexto__PaginaAdminSalasChat__FormularioSala/contexto';

export function Conteiner__PaginaAdminSalasChat() {
    return (
        <Contexto__PaginaAdminSalasChat__Provider>
            <Conteiner__PaginaAdminSalasChat__Interno />
        </Contexto__PaginaAdminSalasChat__Provider>
    );
};

export const Conteiner__PaginaAdminSalasChat__Interno = criaConteiner<PropsConteiner__PaginaAdminSalasChat>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminSalasChat = Contexto__PaginaAdminSalasChat__Props;

// Fluxo controlado aqui: formulário de criação/edição ativo → FormularioSala; senão → Listagem.
function resolveSaida(props: PropsConteiner__PaginaAdminSalasChat): SaidaConteiner {
    if (props.estaEmCriacaoSala || props.salaEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminSalasChat__FormularioSala__Provider, { salaEmEdicao: props.salaEmEdicao, salvarNovaSala: props.salvarNovaSala, salvarEdicaoSala: props.salvarEdicaoSala, definirEstadoSala: props.definirEstadoSala, cancelar: props.cancelarFormulario });
    return criaSaidaConteiner(Contexto__PaginaAdminSalasChat__Listagem__Provider, { listagemSalas: props.listagemSalas, estaEmCriacaoSala: props.estaEmCriacaoSala, iniciarCriacaoSala: props.iniciarCriacaoSala, editarSala: props.editarSala });
};

function useEstado(): PropsConteiner__PaginaAdminSalasChat { return useContexto__PaginaAdminSalasChat(); };
