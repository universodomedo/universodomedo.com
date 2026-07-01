'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Listagem from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Listagem/SPA__PaginaGameDesignerConfiguracaoPartida__Listagem';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Props {
    listagemPartidas: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['listagemPartidas'];
    iniciaCadastro: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['iniciaCadastro'];
    selecionaPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['selecionaPartida'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Provider = ({ listagemPartidas, iniciaCadastro, selecionaPartida }: Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: undefined, fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem.Provider value={{ listagemPartidas, iniciaCadastro, selecionaPartida }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Listagem />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem.Provider>
    );
};
