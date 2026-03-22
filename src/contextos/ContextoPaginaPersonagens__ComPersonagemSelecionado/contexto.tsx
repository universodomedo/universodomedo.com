'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { Conteiner__PaginaPersonagem } from 'Conteineres/PaginaPersonagem/conteiner';

interface ContextoPaginaPersonagens__ComPersonagemSelecionadoProps {
    personagem: PersonagemVisualizacaoDetalhadaDto;
};

const ContextoPaginaPersonagens__ComPersonagemSelecionado = createContext<ContextoPaginaPersonagens__ComPersonagemSelecionadoProps | undefined>(undefined);

export const useContextoPaginaPersonagens__ComPersonagemSelecionado = (): ContextoPaginaPersonagens__ComPersonagemSelecionadoProps => {
    const context = useContext(ContextoPaginaPersonagens__ComPersonagemSelecionado);
    if (!context) throw new Error('useContextoPaginaPersonagens__ComPersonagemSelecionado precisa estar dentro de um ContextoPaginaPersonagens__ComPersonagemSelecionado');
    return context;
};

export const ContextoPaginaPersonagens__ComPersonagemSelecionadoProvider = ({ personagem }: { personagem: PersonagemVisualizacaoDetalhadaDto; }) => {

    return (
        <ContextoPaginaPersonagens__ComPersonagemSelecionado.Provider value={{ personagem }}>
            <Conteiner__PaginaPersonagem />
        </ContextoPaginaPersonagens__ComPersonagemSelecionado.Provider>
    );
};