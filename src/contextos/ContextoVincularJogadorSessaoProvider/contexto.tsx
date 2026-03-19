'use client';

import { createContext, useContext } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaJogador__SelecionandoFichaParaSessao from 'Conteineres/PaginaJogador/paginas/SPA__PaginaJogador__SelecionandoFichaParaSessao/SPA__PaginaJogador__SelecionandoFichaParaSessao';

interface ContextoVincularJogadorSessaoProps {
    sessao: VIEW_SessaoDeJogadorDto;
    fichasUsuario: FichaTemporariaVisualizacaoDetalhadaDto[];
};

const ContextoVincularJogadorSessao = createContext<ContextoVincularJogadorSessaoProps | undefined>(undefined);

export const useContextoVincularJogadorSessao = (): ContextoVincularJogadorSessaoProps => {
    const context = useContext(ContextoVincularJogadorSessao);
    if (!context) throw new Error('useContextoVincularJogadorSessao precisa estar dentro de um ContextoVincularJogadorSessao');
    return context;
};

export const ContextoVincularJogadorSessaoProvider = ({ sessao, fichasUsuario, acaoParaVoltarPagina }: { sessao: VIEW_SessaoDeJogadorDto; fichasUsuario: FichaTemporariaVisualizacaoDetalhadaDto[]; acaoParaVoltarPagina: () => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: `Sua Sessão: ${sessao.tituloInteligente.tituloCompleto}`, fecharProps: { tipo: 'acao', executar: acaoParaVoltarPagina, tituloTooltip: 'Voltar' } }, 'patch');

    return (
        <ContextoVincularJogadorSessao.Provider value={{ sessao, fichasUsuario }}>
            <SPA__PaginaJogador__SelecionandoFichaParaSessao />
        </ContextoVincularJogadorSessao.Provider>
    );
};