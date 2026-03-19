'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import SPA__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada from 'Conteineres/PaginaPreJogo_Jogador/paginas/SPA__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada/SPA__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada';

interface Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Props {
    sessoes: VIEW_SessaoDeJogadorDto[];
    selecionaSessao: (idSessao: number) => void;
};

const Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada = createContext<Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada = (): Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Props => {
    const context = useContext(Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada);
    if (!context) throw new Error('useContexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada precisa estar dentro de um Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada');
    return context;
};

export const Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Provider = ({ sessoes, selecionaSessao }: { sessoes: VIEW_SessaoDeJogadorDto[]; selecionaSessao: (idSessao: number) => void; }) => {

    return (
        <Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada.Provider value={{ sessoes, selecionaSessao }}>
            <SPA__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada />
        </Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada.Provider>
    );
};