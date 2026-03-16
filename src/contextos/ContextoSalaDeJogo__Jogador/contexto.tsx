'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, J_DadosFichaEmJogo, LogicaJogoUsuario_ObjetoEmJogoDto, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import SPA_SalaDeJogo from 'Conteineres/EmJogo/paginas/SPA_SalaDeJogo__Jogador/SPA_SalaDeJogo__Jogador';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

interface ContextoSalaDeJogo__JogadorProps {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto;
    J_fichaAtualizada: J_DadosFichaEmJogo;
    caminhoAvatar: string;
};

const ContextoSalaDeJogo__Jogador = createContext<ContextoSalaDeJogo__JogadorProps | undefined>(undefined);

export const useContextoSalaDeJogo__Jogador = (): ContextoSalaDeJogo__JogadorProps => {
    const context = useContext(ContextoSalaDeJogo__Jogador);
    if (!context) throw new Error('useContextoSalaDeJogo__Jogador precisa estar dentro de um ContextoSalaDeJogo__Jogador');
    return context;
};

export const ContextoSalaDeJogo__JogadorProvider = ({ objetoEmJogo, idFicha, caminhoAvatar }: { objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto; idFicha: number; caminhoAvatar: string; }) => {
    const [J_fichaAtualizada, setJ_FichaAtualizada] = useState<J_DadosFichaEmJogo | null>(null);

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

    if (J_fichaAtualizada === null) return <h2>Carregando Ficha...</h2>;

    return (
        <ContextoSalaDeJogo__Jogador.Provider value={{ objetoEmJogo, J_fichaAtualizada, caminhoAvatar }}>
            <SPA_SalaDeJogo />
        </ContextoSalaDeJogo__Jogador.Provider>
    );
};