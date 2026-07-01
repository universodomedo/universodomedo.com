'use client';

import { createContext, useContext } from 'react';
import type { ConfiguracaoPartida, PartidaResumo } from 'types-nora-api';

import SPA__PaginaGameDesignerConfiguracaoPartida__Editor from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/SPA__PaginaGameDesignerConfiguracaoPartida__Editor';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props {
    partida: PartidaResumo;
    configuracaoInicial: ConfiguracaoPartida | null;
    salvando: boolean;
    salvar: (configuracao: ConfiguracaoPartida) => Promise<void>;
};

type PropsProvider = {
    partida: PartidaResumo;
    configuracaoInicial: ConfiguracaoPartida | null;
    salvando: boolean;
    salvar: (configuracao: ConfiguracaoPartida) => Promise<void>;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Editor = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Editor precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Editor');
    return context;
};

// Conteudo da aba Runtime: recebe o configuracao ja carregado (GraphQL, remapeado pro nativo) e o salvar por props do tab host. Nao busca nem configura layout — a Edicao (host das abas) cuida disso.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider = ({ partida, configuracaoInicial, salvando, salvar }: PropsProvider) => {
    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider value={{ partida, configuracaoInicial, salvando, salvar }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Editor />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider>
    );
};
