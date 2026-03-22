'use client';

import { createContext, useContext, useEffect } from 'react';
import { CAPACIDADES, SalaDeJogo_SessaoDto } from 'types-nora-api';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto';
import { useContexto__Chat } from 'Contextos/ContextoChat/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import SPA__PaginaAoVivo__SessaoEmAndamento from 'Conteineres/PaginaAoVivo/paginas/SPA__PaginaAoVivo__SessaoEmAndamento/SPA__PaginaAoVivo__SessaoEmAndamento';

interface ContextoPaginaAoVivo__SessaoEmAndamentoProps {
    sessaoEmAndamento: SalaDeJogo_SessaoDto;
    souStreamer: boolean;
};

const ContextoPaginaAoVivo__SessaoEmAndamento = createContext<ContextoPaginaAoVivo__SessaoEmAndamentoProps | undefined>(undefined);

export const useContextoPaginaAoVivo__SessaoEmAndamento = (): ContextoPaginaAoVivo__SessaoEmAndamentoProps => {
    const context = useContext(ContextoPaginaAoVivo__SessaoEmAndamento);
    if (!context) throw new Error('useContextoPaginaAoVivo__SessaoEmAndamento precisa estar dentro de um ContextoPaginaAoVivo__SessaoEmAndamento');
    return context;
};

export const ContextoPaginaAoVivo__SessaoEmAndamentoProvider = ({ sessaoEmAndamento }: { sessaoEmAndamento: SalaDeJogo_SessaoDto }) => {
    const { funcEsconderMenu } = useContextoMenuSwiperEsquerda();
    const { tornaChatInivisivel } = useContexto__Chat();
    const { verificarCapacidade } = useContextoAutenticacao();

    const souStreamer = verificarCapacidade(CAPACIDADES.STREAMER);

    useEffect(() => {
        if (souStreamer) {
            funcEsconderMenu();
            tornaChatInivisivel();
        }
    }, [souStreamer]);
    
    return (
        <ContextoPaginaAoVivo__SessaoEmAndamento.Provider value={{ sessaoEmAndamento, souStreamer }}>
            <SPA__PaginaAoVivo__SessaoEmAndamento />
        </ContextoPaginaAoVivo__SessaoEmAndamento.Provider>
    );
};