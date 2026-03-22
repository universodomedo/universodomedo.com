'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EstiloSessaoMestradaDto, RascunhoCompletaDto } from 'types-nora-api';

import SPA__PaginaRascunhosMestre__SemRascunhoSelecionado from 'Conteineres/PaginaRascunhos/paginas/SPA__PaginaRascunhosMestre__SemRascunhoSelecionado/SPA__PaginaRascunhosMestre__SemRascunhoSelecionado';

interface ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProps {
    estilosSessaoMestrada: EstiloSessaoMestradaDto[];
    rascunhos: RascunhoCompletaDto[];
    selecionaRascunho: (idRascunho: number) => void;
};

const ContextoPaginaRascunhosMestre__SemRascunhoSelecionado = createContext<ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProps | undefined>(undefined);

export const useContextoPaginaRascunhosMestre__SemRascunhoSelecionado = (): ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProps => {
    const context = useContext(ContextoPaginaRascunhosMestre__SemRascunhoSelecionado);
    if (!context) throw new Error('useContextoPaginaRascunhosMestre__SemRascunhoSelecionado precisa estar dentro de um ContextoPaginaRascunhosMestre__SemRascunhoSelecionado');
    return context;
};

export const ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProvider = ({ estilosSessaoMestrada, rascunhos, selecionaRascunho }: { estilosSessaoMestrada: EstiloSessaoMestradaDto[]; rascunhos: RascunhoCompletaDto[]; selecionaRascunho: (idRascunho: number) => void; }) => {

    return (
        <ContextoPaginaRascunhosMestre__SemRascunhoSelecionado.Provider value={{ estilosSessaoMestrada, rascunhos, selecionaRascunho }}>
            <SPA__PaginaRascunhosMestre__SemRascunhoSelecionado />
        </ContextoPaginaRascunhosMestre__SemRascunhoSelecionado.Provider>
    );
};