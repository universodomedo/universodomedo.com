'use client';

import { SalaDeJogo_TipoParticipante } from 'types-nora-api';
import type { LogicaJogoUsuario_ObjetoEmJogoDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoEMJOGOProvider, useContextoEMJOGO } from 'Contextos/ContextoEMJOGO/contexto';
import { ContextoSalaDeJogo__NarradorProvider } from 'Contextos/ContextoSalaDeJogo__Narrador/contexto';
import { ContextoSalaDeJogo__JogadorProvider, LogicaJogoUsuario_ObjetoEmJogoDto__Jogador } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';
import { BloqueioDeSilencio } from 'Componentes/Elementos/CentralAudio/BloqueioDeSilencio';

export default function Conteiner__EmJogo() {
    return (
        <ContextoEMJOGOProvider>
            <BloqueioDeSilencio />
            <Conteiner__EmJogo__Interno />
        </ContextoEMJOGOProvider>
    );
};

const Conteiner__EmJogo__Interno = criaConteiner<PropsConteiner__EmJogo>({ useEstado, resolveSaida });

type PropsConteiner__EmJogo = {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto;
};

function resolveSaida(props: PropsConteiner__EmJogo): SaidaConteiner {
    const objetoInicialSala = props.objetoEmJogo.objetoInicialSala;

    if (objetoInicialSala.tipoParticipante === SalaDeJogo_TipoParticipante.NARRADOR) return criaSaidaConteiner(ContextoSalaDeJogo__NarradorProvider, { dadosSalaDeJogo__Narrador: objetoInicialSala });

    const objetoEmJogoJogador: LogicaJogoUsuario_ObjetoEmJogoDto__Jogador = { ...props.objetoEmJogo, objetoInicialSala };

    return criaSaidaConteiner(ContextoSalaDeJogo__JogadorProvider, { objetoEmJogo: objetoEmJogoJogador, idFicha: objetoInicialSala.idFicha, caminhoAvatar: objetoInicialSala.avatarAtual });
};

function useEstado(): PropsConteiner__EmJogo {
    const { objetoEmJogo } = useContextoEMJOGO();

    return { objetoEmJogo };
};