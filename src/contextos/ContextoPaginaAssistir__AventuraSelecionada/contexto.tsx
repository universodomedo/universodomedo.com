'use client';

import { createContext, useContext } from 'react';
import { AventuraCompletaDto } from 'types-nora-api';

import SPA__PaginaAssistir__AventuraSelecionada from 'Conteineres/PaginaAssistir/paginas/SPA__PaginaAssistir__AventuraSelecionada/SPA__PaginaAssistir__AventuraSelecionada';
import { useSincronizarQueryParamSPA } from 'Hooks/useSincronizarQueryParamSPA';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

interface ContextoPaginaAssistir__AventuraSelecionadaProps {
    aventura: AventuraCompletaDto;
};

const ContextoPaginaAssistir__AventuraSelecionada = createContext<ContextoPaginaAssistir__AventuraSelecionadaProps | undefined>(undefined);

export const useContextoPaginaAssistir__AventuraSelecionada = (): ContextoPaginaAssistir__AventuraSelecionadaProps => {
    const context = useContext(ContextoPaginaAssistir__AventuraSelecionada);
    if (!context) throw new Error('useContextoPaginaAssistir__AventuraSelecionada precisa estar dentro de um ContextoPaginaAssistir__AventuraSelecionada');
    return context;
};

export const ContextoPaginaAssistir__AventuraSelecionadaProvider = ({ aventura }: { aventura: AventuraCompletaDto; }) => {
    useSincronizarQueryParamSPA(QUERY_PARAMS.AVENTURA, aventura.id);

    return (
        <ContextoPaginaAssistir__AventuraSelecionada.Provider value={{ aventura }}>
            <SPA__PaginaAssistir__AventuraSelecionada />
        </ContextoPaginaAssistir__AventuraSelecionada.Provider>
    );
};