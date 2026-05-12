

'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoGerenciarAvatares__Provider, useContextoGerenciarAvatares, type ContextoGerenciarAvatares__Props } from 'Contextos/ContextoGerenciarAvatares/contexto';
import { ContextoGerenciarAvatares__Personagem__Provider } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import { ContextoGerenciarAvatares__Listagem__Provider } from 'Contextos/ContextoGerenciarAvatares__Listagem/contexto';

export function Conteiner__GerenciarAvatares() {
    return (
        <ContextoGerenciarAvatares__Provider>
            <Conteiner__GerenciarAvatares__Interno />
        </ContextoGerenciarAvatares__Provider>
    );
};

export const Conteiner__GerenciarAvatares__Interno = criaConteiner<ContextoGerenciarAvatares__Props>({ useEstado, resolveSaida });

function resolveSaida(props: ContextoGerenciarAvatares__Props): SaidaConteiner {
    if (props.personagemSelecionado) return criaSaidaConteiner(ContextoGerenciarAvatares__Personagem__Provider, { personagem: props.personagemSelecionado, avataresDeComparacao: props.avataresDeComparacao, deselecionaPersonagem: props.deselecionaPersonagem });

    return criaSaidaConteiner(ContextoGerenciarAvatares__Listagem__Provider, { listagemPersonagens: props.listagemPersonagens, selecionaPersonagem: props.setIdPersonagemSelecionado });
};

function useEstado(): ContextoGerenciarAvatares__Props { return useContextoGerenciarAvatares(); };