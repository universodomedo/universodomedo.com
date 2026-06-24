'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGerenciarDimensoes__Props } from '../Contexto__PaginaGerenciarDimensoes/contexto';
import SPA__PaginaGerenciarDimensoes__Listagem from 'Conteineres/PaginaGerenciarDimensoes/paginas/SPA__PaginaGerenciarDimensoes__Listagem/SPA__PaginaGerenciarDimensoes__Listagem';

interface Contexto__PaginaGerenciarDimensoes__Listagem__Props {
    listagemDimensoes: Contexto__PaginaGerenciarDimensoes__Props['listagemDimensoes'];
    iniciaCriacao: Contexto__PaginaGerenciarDimensoes__Props['iniciaCriacao'];
};

const Contexto__PaginaGerenciarDimensoes__Listagem = createContext<Contexto__PaginaGerenciarDimensoes__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGerenciarDimensoes__Listagem = (): Contexto__PaginaGerenciarDimensoes__Listagem__Props => {
    const context = useContext(Contexto__PaginaGerenciarDimensoes__Listagem);
    if (!context) throw new Error('useContexto__PaginaGerenciarDimensoes__Listagem precisa estar dentro de um Contexto__PaginaGerenciarDimensoes__Listagem');
    return context;
};

export const Contexto__PaginaGerenciarDimensoes__Listagem__Provider = ({ listagemDimensoes, iniciaCriacao }: Contexto__PaginaGerenciarDimensoes__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ fecharProps: undefined });

    return (
        <Contexto__PaginaGerenciarDimensoes__Listagem.Provider value={{ listagemDimensoes, iniciaCriacao }}>
            <SPA__PaginaGerenciarDimensoes__Listagem />
        </Contexto__PaginaGerenciarDimensoes__Listagem.Provider>
    );
};
