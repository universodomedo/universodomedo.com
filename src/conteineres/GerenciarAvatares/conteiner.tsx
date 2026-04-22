

'use client';

import { CaminhoArquivoAvatar, VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoGerenciarAvatares__Provider, useContextoGerenciarAvatares } from 'Contextos/ContextoGerenciarAvatares/contexto';
import { ContextoGerenciarAvatares__Personagem__Provider } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import { ContextoGerenciarAvatares__Listagem__Provider } from 'Contextos/ContextoGerenciarAvatares__Listagem/contexto';

export function Conteiner__GerenciarAvatares() {
    return (
        <ContextoGerenciarAvatares__Provider>
            <Conteiner__GerenciarAvatares__Interno />
        </ContextoGerenciarAvatares__Provider>
    );
};

export const Conteiner__GerenciarAvatares__Interno = criaConteiner<PropsConteiner__GerenciarAvatares>({ useEstado, resolveSaida });

type PropsConteiner__GerenciarAvatares = {
    personagens: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[];
    avataresDeComparacao: CaminhoArquivoAvatar[];
    setIdPersonagemSelecionado: (v: number) => void;
    deselecionaPersonagem: () => void;
    personagemSelecionado: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto | null;
};

function resolveSaida(props: PropsConteiner__GerenciarAvatares): SaidaConteiner {
    if (props.personagemSelecionado) return criaSaidaConteiner(ContextoGerenciarAvatares__Personagem__Provider, { personagem: props.personagemSelecionado, avataresDeComparacao: props.avataresDeComparacao, deselecionaPersonagem: props.deselecionaPersonagem });

    return criaSaidaConteiner(ContextoGerenciarAvatares__Listagem__Provider, { personagens: props.personagens, selecionaPersonagem: props.setIdPersonagemSelecionado });
};

function useEstado(): PropsConteiner__GerenciarAvatares {
    const { personagens, avataresDeComparacao, setIdPersonagemSelecionado, deselecionaPersonagem, personagemSelecionado } = useContextoGerenciarAvatares();

    return { personagens, avataresDeComparacao, setIdPersonagemSelecionado, deselecionaPersonagem, personagemSelecionado };
};