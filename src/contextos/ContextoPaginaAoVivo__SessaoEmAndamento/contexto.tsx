'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SalaDeJogo_SessaoDto } from 'types-nora-api';

import SPA__PaginaAoVivo__SessaoEmAndamento from 'Conteineres/PaginaAoVivo/paginas/SPA__PaginaAoVivo__SessaoEmAndamento/SPA__PaginaAoVivo__SessaoEmAndamento';

interface ContextoPaginaAoVivo__SessaoEmAndamentoProps {
    sessaoEmAndamento: SalaDeJogo_SessaoDto;
};

const ContextoPaginaAoVivo__SessaoEmAndamento = createContext<ContextoPaginaAoVivo__SessaoEmAndamentoProps | undefined>(undefined);

export const useContextoPaginaAoVivo__SessaoEmAndamento = (): ContextoPaginaAoVivo__SessaoEmAndamentoProps => {
    const context = useContext(ContextoPaginaAoVivo__SessaoEmAndamento);
    if (!context) throw new Error('useContextoPaginaAoVivo__SessaoEmAndamento precisa estar dentro de um ContextoPaginaAoVivo__SessaoEmAndamento');
    return context;
};

export const ContextoPaginaAoVivo__SessaoEmAndamentoProvider = ({ sessaoEmAndamento }: { sessaoEmAndamento: SalaDeJogo_SessaoDto }) => {

    return (
        <ContextoPaginaAoVivo__SessaoEmAndamento.Provider value={{ sessaoEmAndamento }}>
            <SPA__PaginaAoVivo__SessaoEmAndamento />
        </ContextoPaginaAoVivo__SessaoEmAndamento.Provider>
    );
};