'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorSeres__Props } from '../Contexto__PaginaModeradorSeres/contexto';
import SPA__PaginaModeradorSeres__Listagem from 'Conteineres/PaginaModeradorSeres/paginas/SPA__PaginaModeradorSeres__Listagem/SPA__PaginaModeradorSeres__Listagem';

interface Contexto__PaginaModeradorSeres__Listagem__Props {
    listagemSeres: Contexto__PaginaModeradorSeres__Props['listagemSeres'];
    iniciaCadastro: Contexto__PaginaModeradorSeres__Props['iniciaCadastro'];
};

const Contexto__PaginaModeradorSeres__Listagem = createContext<Contexto__PaginaModeradorSeres__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorSeres__Listagem = (): Contexto__PaginaModeradorSeres__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorSeres__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorSeres__Listagem precisa estar dentro de um Contexto__PaginaModeradorSeres__Listagem');
    return context;
};

export const Contexto__PaginaModeradorSeres__Listagem__Provider = ({ listagemSeres, iniciaCadastro }: Contexto__PaginaModeradorSeres__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Cadastro de Seres', fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorSeres__Listagem.Provider value={{ listagemSeres, iniciaCadastro }}>
            <SPA__PaginaModeradorSeres__Listagem />
        </Contexto__PaginaModeradorSeres__Listagem.Provider>
    );
};