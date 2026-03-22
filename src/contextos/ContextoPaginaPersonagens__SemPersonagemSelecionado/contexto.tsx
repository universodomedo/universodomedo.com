'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import SPA__PaginaPersonagens__SemPersonagemSelecionado from 'Conteineres/PaginaPersonagens/paginas/SPA__PaginaPersonagens__SemPersonagemSelecionado/SPA__PaginaPersonagens__SemPersonagemSelecionado';

interface ContextoPaginaPersonagens__SemPersonagemSelecionadoProps {

};

const ContextoPaginaPersonagens__SemPersonagemSelecionado = createContext<ContextoPaginaPersonagens__SemPersonagemSelecionadoProps | undefined>(undefined);

export const useContextoPaginaPersonagens__SemPersonagemSelecionado = (): ContextoPaginaPersonagens__SemPersonagemSelecionadoProps => {
    const context = useContext(ContextoPaginaPersonagens__SemPersonagemSelecionado);
    if (!context) throw new Error('useContextoPaginaPersonagens__SemPersonagemSelecionado precisa estar dentro de um ContextoPaginaPersonagens__SemPersonagemSelecionado');
    return context;
};

export const ContextoPaginaPersonagens__SemPersonagemSelecionadoProvider = ({ }) => {

    return (
        <ContextoPaginaPersonagens__SemPersonagemSelecionado.Provider value={{ }}>
            <SPA__PaginaPersonagens__SemPersonagemSelecionado />
        </ContextoPaginaPersonagens__SemPersonagemSelecionado.Provider>
    );
};