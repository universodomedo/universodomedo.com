'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { Conteiner__PaginaFichaTemporaria } from 'Conteineres/PaginaFichaTemporaria/conteiner';

interface ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProps {
    fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto;
    acaoVoltar: () => void;
};

const ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada = createContext<ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProps | undefined>(undefined);

export const useContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada = (): ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProps => {
    const context = useContext(ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada);
    if (!context) throw new Error('useContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada precisa estar dentro de um ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada');
    return context;
};

export const ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionadaProvider = ({ fichaTemporaria, acaoVoltar }: { fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto; acaoVoltar: () => void; }) => {
    return (
        <ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada.Provider value={{ fichaTemporaria, acaoVoltar }}>
            <Conteiner__PaginaFichaTemporaria key={fichaTemporaria.id} />
        </ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada.Provider>
    );
};