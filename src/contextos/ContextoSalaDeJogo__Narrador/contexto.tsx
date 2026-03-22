'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Eventos_Envia, LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import SPA_SalaDeJogo__Narrador from 'Conteineres/EmJogo/paginas/SPA_SalaDeJogo__Narrador/SPA_SalaDeJogo__Narrador';

interface ContextoSalaDeJogo__NarradorProps {
    dadosSalaDeJogo__Narrador: LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador;
};

const ContextoSalaDeJogo__Narrador = createContext<ContextoSalaDeJogo__NarradorProps | undefined>(undefined);

export const useContextoSalaDeJogo__Narrador = (): ContextoSalaDeJogo__NarradorProps => {
    const context = useContext(ContextoSalaDeJogo__Narrador);
    if (!context) throw new Error('useContextoSalaDeJogo__Narrador precisa estar dentro de um ContextoSalaDeJogo__Narrador');
    return context;
};

export const ContextoSalaDeJogo__NarradorProvider = ({ dadosSalaDeJogo__Narrador }: { dadosSalaDeJogo__Narrador: LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador; }) => {
    function executaAcao() {
        // eventoWs(Eventos_Envia.Jogo.eventos.executaTestePericia_PROTOTIPO, { tipo: 'TESTE_JOGADOR', valorAtributo: valorAtributo, valorPericia: valorPericia, abrevPericia: abrevPericia });
    };

    return (
        <ContextoSalaDeJogo__Narrador.Provider value={{ dadosSalaDeJogo__Narrador }}>
            <SPA_SalaDeJogo__Narrador />
        </ContextoSalaDeJogo__Narrador.Provider>
    );
};