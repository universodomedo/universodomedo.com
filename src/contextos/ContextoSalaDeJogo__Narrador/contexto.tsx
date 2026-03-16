'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LogicaJogoUsuario_ObjetoEmJogoDto } from 'types-nora-api';

import SPA_SalaDeJogo__Narrador from 'Conteineres/EmJogo/paginas/SPA_SalaDeJogo__Narrador/SPA_SalaDeJogo__Narrador';

interface ContextoSalaDeJogo__NarradorProps {
    objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto;
};

const ContextoSalaDeJogo__Narrador = createContext<ContextoSalaDeJogo__NarradorProps | undefined>(undefined);

export const useContextoSalaDeJogo__Narrador = (): ContextoSalaDeJogo__NarradorProps => {
    const context = useContext(ContextoSalaDeJogo__Narrador);
    if (!context) throw new Error('useContextoSalaDeJogo__Narrador precisa estar dentro de um ContextoSalaDeJogo__Narrador');
    return context;
};

export const ContextoSalaDeJogo__NarradorProvider = ({ objetoEmJogo }: { objetoEmJogo: LogicaJogoUsuario_ObjetoEmJogoDto; }) => {

    return (
        <ContextoSalaDeJogo__Narrador.Provider value={{ objetoEmJogo }}>
            <SPA_SalaDeJogo__Narrador />
        </ContextoSalaDeJogo__Narrador.Provider>
    );
};