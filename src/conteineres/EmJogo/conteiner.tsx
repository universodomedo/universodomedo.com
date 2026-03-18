'use client';

import { LogicaJogoUsuario_ObjetoEmJogoDto, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoEMJOGOProvider, useContextoEMJOGO } from 'Contextos/ContextoEMJOGO/contexto';
import { ContextoSalaDeJogo__NarradorProvider } from 'Contextos/ContextoSalaDeJogo__Narrador/contexto';
import { ContextoSalaDeJogo__JogadorProvider } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';

export default function Conteiner__EmJogo() {
    return (
        <ContextoEMJOGOProvider>
            <Conteiner__EmJogo__Interno />
        </ContextoEMJOGOProvider>
    );
};

const Conteiner__EmJogo__Interno = criaConteiner<PropsConteiner__EmJogo>({ useEstado, resolveSaida });

type PropsConteiner__EmJogo = {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto;
};

function resolveSaida(props: PropsConteiner__EmJogo): SaidaConteiner {
    if (props.objetoEmJogo.objetoInicialSala.tipoParticipante === SalaDeJogo_TipoParticipante.NARRADOR) return criaSaidaConteiner(ContextoSalaDeJogo__NarradorProvider, { objetoEmJogo: props.objetoEmJogo });

    return criaSaidaConteiner(ContextoSalaDeJogo__JogadorProvider, { objetoEmJogo: props.objetoEmJogo, idFicha: props.objetoEmJogo.objetoInicialSala.idFicha, caminhoAvatar: props.objetoEmJogo.objetoInicialSala.caminhoAvatar });
};

function useEstado(): PropsConteiner__EmJogo {
    const { objetoEmJogo } = useContextoEMJOGO();

    return { objetoEmJogo };
};