'use client';

import { createContext, useContext } from 'react';
import { VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaJogador__SelecionandoFichaParaSessao from 'Conteineres/PaginaJogador/paginas/SPA__PaginaJogador__SelecionandoFichaParaSessao/SPA__PaginaJogador__SelecionandoFichaParaSessao';

interface ContextoPaginaJogador__SelecionandoFichaParaSessaoProps {
    sessao: VIEW_SessaoDeJogadorDto;
};

const ContextoPaginaJogador__SelecionandoFichaParaSessao = createContext<ContextoPaginaJogador__SelecionandoFichaParaSessaoProps | undefined>(undefined);

export const useContextoPaginaJogador__SelecionandoFichaParaSessao = (): ContextoPaginaJogador__SelecionandoFichaParaSessaoProps => {
    const context = useContext(ContextoPaginaJogador__SelecionandoFichaParaSessao);
    if (!context) throw new Error('useContextoPaginaJogador__SelecionandoFichaParaSessao precisa estar dentro de um ContextoPaginaJogador__SelecionandoFichaParaSessao');
    return context;
};

export const ContextoPaginaJogador__SelecionandoFichaParaSessaoProvider = ({ sessao, voltarParaPaginaInicialJogador }: { sessao: VIEW_SessaoDeJogadorDto; voltarParaPaginaInicialJogador: () => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: `Sua Sessão: ${sessao.tituloInteligente.tituloCompleto}`, fecharProps: { tipo: 'acao', executar: voltarParaPaginaInicialJogador, tituloTooltip: 'Voltar' } }, 'patch');

    return (
        <ContextoPaginaJogador__SelecionandoFichaParaSessao.Provider value={{ sessao }}>
            <SPA__PaginaJogador__SelecionandoFichaParaSessao />
        </ContextoPaginaJogador__SelecionandoFichaParaSessao.Provider>
    );
};