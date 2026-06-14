'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Listagem from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Listagem/SPA__PaginaGameDesignerSeres__Listagem';

interface Contexto__PaginaGameDesignerSeres__Listagem__Props {
    listagemSeres: Contexto__PaginaGameDesignerSeres__Props['listagemSeres'];
    iniciaCadastro: Contexto__PaginaGameDesignerSeres__Props['iniciaCadastro'];
    selecionaSer: Contexto__PaginaGameDesignerSeres__Props['selecionaSer'];
};

const Contexto__PaginaGameDesignerSeres__Listagem = createContext<Contexto__PaginaGameDesignerSeres__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Listagem = (): Contexto__PaginaGameDesignerSeres__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Listagem__Provider = ({ listagemSeres, iniciaCadastro, selecionaSer }: Contexto__PaginaGameDesignerSeres__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Seres', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerSeres__Listagem.Provider value={{ listagemSeres, iniciaCadastro, selecionaSer }}>
            <SPA__PaginaGameDesignerSeres__Listagem />
        </Contexto__PaginaGameDesignerSeres__Listagem.Provider>
    );
};
