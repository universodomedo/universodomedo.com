'use client';

import { createContext, useContext } from 'react';
import type { PartidaResumo } from 'types-nora-api';

import SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes/SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props {
    partida: PartidaResumo;
};

type PropsProvider = {
    partida: PartidaResumo;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes');
    return context;
};

// Conteudo da aba Detalhes: arteCapa e idMusicaConfigurada ja vem no PartidaResumo (estrutura) — a SPA inicializa a partir deles, sem busca propria. Nao configura layout — a Edicao (host das abas) cuida disso.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider = ({ partida }: PropsProvider) => {
    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes.Provider value={{ partida }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes.Provider>
    );
};
