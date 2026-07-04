'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerBasesSer__Props } from '../Contexto__PaginaGameDesignerBasesSer/contexto';
import SPA__PaginaGameDesignerBasesSer__Listagem from 'Conteineres/PaginaGameDesignerBasesSer/paginas/SPA__PaginaGameDesignerBasesSer__Listagem/SPA__PaginaGameDesignerBasesSer__Listagem';

interface Contexto__PaginaGameDesignerBasesSer__Listagem__Props {
    listagemBases: Contexto__PaginaGameDesignerBasesSer__Props['listagemBases'];
    iniciaCadastro: Contexto__PaginaGameDesignerBasesSer__Props['iniciaCadastro'];
    selecionaBase: Contexto__PaginaGameDesignerBasesSer__Props['selecionaBase'];
};

const Contexto__PaginaGameDesignerBasesSer__Listagem = createContext<Contexto__PaginaGameDesignerBasesSer__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerBasesSer__Listagem = (): Contexto__PaginaGameDesignerBasesSer__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerBasesSer__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerBasesSer__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerBasesSer__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerBasesSer__Listagem__Provider = ({ listagemBases, iniciaCadastro, selecionaBase }: Contexto__PaginaGameDesignerBasesSer__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Bases de Ser', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerBasesSer__Listagem.Provider value={{ listagemBases, iniciaCadastro, selecionaBase }}>
            <SPA__PaginaGameDesignerBasesSer__Listagem />
        </Contexto__PaginaGameDesignerBasesSer__Listagem.Provider>
    );
};
