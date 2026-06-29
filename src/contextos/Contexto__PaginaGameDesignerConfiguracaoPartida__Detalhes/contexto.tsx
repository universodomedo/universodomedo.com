'use client';

import { createContext, useContext } from 'react';
import type { PartidaResumo } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes/SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props {
    partida: PartidaResumo;
};

type PropsProvider = {
    partida: PartidaResumo;
    fecharDetalhes: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['fecharDetalhes'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider = ({ partida, fecharDetalhes }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ titulo: 'Detalhes da Partida', subtitulo: partida.nome, fecharProps: { tipo: 'acao', executar: fecharDetalhes, tituloTooltip: 'Voltar para a Partida' } });

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes.Provider value={{ partida }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes.Provider>
    );
};
