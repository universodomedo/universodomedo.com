'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerDesafios__Props } from '../Contexto__PaginaGameDesignerDesafios/contexto';
import SPA__PaginaGameDesignerDesafios__Tipos from 'Conteineres/PaginaGameDesignerDesafios/paginas/SPA__PaginaGameDesignerDesafios__Tipos/SPA__PaginaGameDesignerDesafios__Tipos';

interface Contexto__PaginaGameDesignerDesafios__Tipos__Props {
    listagemTipos: Contexto__PaginaGameDesignerDesafios__Props['listagemTipos'];
    selecionaTipo: Contexto__PaginaGameDesignerDesafios__Props['selecionaTipo'];
};

const Contexto__PaginaGameDesignerDesafios__Tipos = createContext<Contexto__PaginaGameDesignerDesafios__Tipos__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerDesafios__Tipos = (): Contexto__PaginaGameDesignerDesafios__Tipos__Props => {
    const context = useContext(Contexto__PaginaGameDesignerDesafios__Tipos);
    if (!context) throw new Error('useContexto__PaginaGameDesignerDesafios__Tipos precisa estar dentro de um Contexto__PaginaGameDesignerDesafios__Tipos');
    return context;
};

export const Contexto__PaginaGameDesignerDesafios__Tipos__Provider = ({ listagemTipos, selecionaTipo }: Contexto__PaginaGameDesignerDesafios__Tipos__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Desafios', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerDesafios__Tipos.Provider value={{ listagemTipos, selecionaTipo }}>
            <SPA__PaginaGameDesignerDesafios__Tipos />
        </Contexto__PaginaGameDesignerDesafios__Tipos.Provider>
    );
};