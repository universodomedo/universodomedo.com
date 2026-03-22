'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto, PAGINAS } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada from 'Conteineres/PaginaFichasTemporarias/paginas/SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada/SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada';

interface ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps {
    fichasTemporarias: FichaTemporariaVisualizacaoDetalhadaDto[];
};

const ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada = createContext<ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps | undefined>(undefined);

export const useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada = (): ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps => {
    const context = useContext(ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada);
    if (!context) throw new Error('useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada precisa estar dentro de um ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada');
    return context;
};

export const ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProvider = ({ fichasTemporarias }: { fichasTemporarias: FichaTemporariaVisualizacaoDetalhadaDto[]; }) => {
    useConfigurarLayoutContextualizado({ titulo: 'Minhas Fichas', fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.jogador, tituloTooltip: 'Voltar para Página de Jogador' } }, 'patch');

    return (
        <ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada.Provider value={{ fichasTemporarias }}>
            <SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada />
        </ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada.Provider>
    );
};