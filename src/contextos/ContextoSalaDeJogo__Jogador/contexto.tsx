'use client';

import { createContext, useContext, useState } from 'react';
import { CaminhoArquivoAvatar, EstadoTemporalSalaDeJogoRuntime, Eventos_Emite, J_DadosFichaEmJogo, LogicaJogoUsuario_ObjetoEmJogoDto, LogicaJogoUsuario_ObjetoInicialSalaDto__Jogador, ResultadoMissaoFuncionalSalaDeJogoRuntime } from 'types-nora-api';

import SPA_SalaDeJogo from 'Conteineres/EmJogo/paginas/SPA_SalaDeJogo__Jogador/SPA_SalaDeJogo__Jogador';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

interface ContextoSalaDeJogo__JogadorProps {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto__Jogador;
    J_fichaAtualizada: J_DadosFichaEmJogo;
    caminhoAvatar: CaminhoArquivoAvatar;
    resultadoMissaoFuncional: ResultadoMissaoFuncionalSalaDeJogoRuntime | null;
    estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime | null;
};

export type LogicaJogoUsuario_ObjetoEmJogoDto__Jogador = Omit<LogicaJogoUsuario_ObjetoEmJogoDto, 'objetoInicialSala'> & {
    objetoInicialSala: LogicaJogoUsuario_ObjetoInicialSalaDto__Jogador;
};

const ContextoSalaDeJogo__Jogador = createContext<ContextoSalaDeJogo__JogadorProps | undefined>(undefined);

export const useContextoSalaDeJogo__Jogador = (): ContextoSalaDeJogo__JogadorProps => {
    const context = useContext(ContextoSalaDeJogo__Jogador);
    if (!context) throw new Error('useContextoSalaDeJogo__Jogador precisa estar dentro de um ContextoSalaDeJogo__Jogador');
    return context;
};

export const ContextoSalaDeJogo__JogadorProvider = ({ objetoEmJogo, idFicha, caminhoAvatar }: { objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto__Jogador; idFicha: number; caminhoAvatar: CaminhoArquivoAvatar; }) => {
    const [J_fichaAtualizada, setJ_FichaAtualizada] = useState<J_DadosFichaEmJogo | null>(null);
    const [resultadoMissaoFuncional, setResultadoMissaoFuncional] = useState<ResultadoMissaoFuncionalSalaDeJogoRuntime | null>(null);
    const [estadoTemporalSalaJogo, setEstadoTemporalSalaJogo] = useState<EstadoTemporalSalaDeJogoRuntime | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirFichaEmJogo, {
        codigoSala: objetoEmJogo.objetoInicialSala.codigoSalaDeJogo,
        idFicha: idFicha,
    }, {
        onSuccess: data => {
            setJ_FichaAtualizada(data.fichaAtualizada)
        },
        onError: err => {
            setJ_FichaAtualizada(null);
            toast.erro(`Houve um erro ao carregar sua ficha: ${err.mensagem}`);
        },
    });

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirResultadoMissaoFuncionalSalaJogo, {
        codigoSala: objetoEmJogo.objetoInicialSala.codigoSalaDeJogo,
    }, {
        onSuccess: data => {
            setResultadoMissaoFuncional(data.resultadoMissaoFuncional);
        },
        onError: err => {
            setResultadoMissaoFuncional(null);
            toast.erro(`Houve um erro ao carregar o resultado da missão: ${err.mensagem}`);
        },
    });

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirEstadoTemporalSalaJogo, {
        codigoSala: objetoEmJogo.objetoInicialSala.codigoSalaDeJogo,
    }, {
        onSuccess: data => {
            setEstadoTemporalSalaJogo(data.estadoTemporalSalaJogo);
        },
        onError: err => {
            setEstadoTemporalSalaJogo(null);
            toast.erro(`Houve um erro ao carregar o tempo da sala: ${err.mensagem}`);
        },
    });

    if (J_fichaAtualizada === null) return <h2>Carregando Ficha...</h2>;

    return (
        <ContextoSalaDeJogo__Jogador.Provider value={{ objetoEmJogo, J_fichaAtualizada, caminhoAvatar, resultadoMissaoFuncional, estadoTemporalSalaJogo }}>
            <SPA_SalaDeJogo />
        </ContextoSalaDeJogo__Jogador.Provider>
    );
};
