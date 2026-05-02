'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaSessoes__SemSessaoSelecionada from 'Conteineres/PaginaVisualizacaoSessoes/paginas/SPA__PaginaSessoes__SemSessaoSelecionada/SPA__PaginaSessoes__SemSessaoSelecionada';
import type { ListaSessoesListagemContexto } from 'Contextos/ContextoPaginasListagemSessoes/contexto';

interface ContextoPaginaSessoes__SemSessaoSelecionadaProps {
    sessoes: ListaSessoesListagemContexto;
    selecionaSessao: (idSessao: number) => void;
};

const ContextoPaginaSessoes__SemSessaoSelecionada = createContext<ContextoPaginaSessoes__SemSessaoSelecionadaProps | undefined>(undefined);

export const useContextoPaginaSessoes__SemSessaoSelecionada = (): ContextoPaginaSessoes__SemSessaoSelecionadaProps => {
    const context = useContext(ContextoPaginaSessoes__SemSessaoSelecionada);
    if (!context) throw new Error('useContextoPaginaSessoes__SemSessaoSelecionada precisa estar dentro de um ContextoPaginaSessoes__SemSessaoSelecionada');
    return context;
};

export const ContextoPaginaSessoes__SemSessaoSelecionadaProvider = ({ sessoes, selecionaSessao }: { sessoes: ListaSessoesListagemContexto; selecionaSessao: (idSessao: number) => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: 'Lista de Sessões', fecharProps: undefined }, 'patch');

    return (
        <ContextoPaginaSessoes__SemSessaoSelecionada.Provider value={{ sessoes, selecionaSessao }}>
            <SPA__PaginaSessoes__SemSessaoSelecionada />
        </ContextoPaginaSessoes__SemSessaoSelecionada.Provider>
    );
};