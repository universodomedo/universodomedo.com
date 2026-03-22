'use client';

import { createContext, useContext } from 'react';
import { SessaoCompletaDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from "Redux/hooks/useLayoutContextualizado";
import SPA__PaginaVisualizacaoSessao from 'Conteineres/PaginaVisualizacaoSessao/paginas/SPA__PaginaVisualizacaoSessao/SPA__PaginaVisualizacaoSessao';

interface ContextoPaginaVisualizacaoSessaoProps {
    sessao: SessaoCompletaDto;
    deselecionaSessao: () => void;
};

const ContextoPaginaVisualizacaoSessao = createContext<ContextoPaginaVisualizacaoSessaoProps | undefined>(undefined);

export const useContextoPaginaVisualizacaoSessao = (): ContextoPaginaVisualizacaoSessaoProps => {
    const context = useContext(ContextoPaginaVisualizacaoSessao);
    if (!context) throw new Error('useContextoPaginaVisualizacaoSessao precisa estar dentro de um ContextoPaginaVisualizacaoSessao');
    return context;
};

export const ContextoPaginaVisualizacaoSessaoProvider = ({ sessao, deselecionaSessao }: { sessao: SessaoCompletaDto; deselecionaSessao: () => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: `Sessão - ${sessao.tituloInteligente.tituloCompleto} [#${sessao.id}]`, fecharProps: { tipo: 'acao', executar: deselecionaSessao, tituloTooltip: 'Voltar para Listagem' } }, 'patch');

    return (
        <ContextoPaginaVisualizacaoSessao.Provider value={{ sessao, deselecionaSessao }}>
            <SPA__PaginaVisualizacaoSessao />
        </ContextoPaginaVisualizacaoSessao.Provider>
    );
};