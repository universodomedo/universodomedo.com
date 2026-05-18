'use client';

import { createContext, useContext } from 'react';

import { type ContextoGerenciarAvatares__Props } from 'Contextos/ContextoGerenciarAvatares/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaGerenciarAvatares__Listagem from 'Conteineres/GerenciarAvatares/paginas/SPA__PaginaGerenciarAvatares__Listagem/SPA__PaginaGerenciarAvatares__Listagem';

interface ContextoGerenciarAvatares__Listagem__Props {
    listagemPersonagens: ContextoGerenciarAvatares__Props['listagemPersonagens'];
    selecionaPersonagem: (idPersonagem: number) => void;
};

const ContextoGerenciarAvatares__Listagem = createContext<ContextoGerenciarAvatares__Listagem__Props | undefined>(undefined);

export const useContextoGerenciarAvatares__Listagem = (): ContextoGerenciarAvatares__Listagem__Props => {
    const context = useContext(ContextoGerenciarAvatares__Listagem);
    if (!context) throw new Error('useContextoGerenciarAvatares__Listagem precisa estar dentro de um ContextoGerenciarAvatares__Listagem');
    return context;
};

export const ContextoGerenciarAvatares__Listagem__Provider = ({ listagemPersonagens, selecionaPersonagem }: { listagemPersonagens: ContextoGerenciarAvatares__Props['listagemPersonagens']; selecionaPersonagem: (idPersonagem: number) => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: 'Gerenciar Avatares', fecharProps: undefined }, 'patch');
    
    return (
        <ContextoGerenciarAvatares__Listagem.Provider value={{ listagemPersonagens, selecionaPersonagem }}>
            <SPA__PaginaGerenciarAvatares__Listagem />
        </ContextoGerenciarAvatares__Listagem.Provider>
    );
};