'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaGerenciarAvatares__Personagem from 'Conteineres/GerenciarAvatares/paginas/SPA__PaginaGerenciarAvatares__Personagem/SPA__PaginaGerenciarAvatares__Personagem';

interface ContextoGerenciarAvatares__Personagem__Props {
    personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto;
};

const ContextoGerenciarAvatares__Personagem = createContext<ContextoGerenciarAvatares__Personagem__Props | undefined>(undefined);

export const useContextoGerenciarAvatares__Personagem = (): ContextoGerenciarAvatares__Personagem__Props => {
    const context = useContext(ContextoGerenciarAvatares__Personagem);
    if (!context) throw new Error('useContextoGerenciarAvatares__Personagem precisa estar dentro de um ContextoGerenciarAvatares__Personagem');
    return context;
};

export const ContextoGerenciarAvatares__Personagem__Provider = ({ personagem, deselecionaPersonagem }: { personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto; deselecionaPersonagem: () => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: personagem.nome, fecharProps: { tipo: 'acao', executar: deselecionaPersonagem, tituloTooltip: 'Voltar para Lista de Personagens' } }, 'patch');

    return (
        <ContextoGerenciarAvatares__Personagem.Provider value={{ personagem }}>
            <SPA__PaginaGerenciarAvatares__Personagem />
        </ContextoGerenciarAvatares__Personagem.Provider>
    );
};