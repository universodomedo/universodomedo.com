'use client';

import { createContext, useContext } from 'react';

import SPA__PaginaGerenciarEmblemas__Listagem from 'Conteineres/GerenciarEmblemas/paginas/SPA__PaginaGerenciarEmblemas__Listagem/SPA__PaginaGerenciarEmblemas__Listagem';
import { ListaEmblemasGerenciamento, useContexto__GerenciarEmblemas } from 'Contextos/Contexto__GerenciarEmblemas/contexto';

export interface Contexto__GerenciarEmblemas__Listagem__Props {
    emblemas: ListaEmblemasGerenciamento;
};

const Contexto__GerenciarEmblemas__Listagem = createContext<Contexto__GerenciarEmblemas__Listagem__Props | undefined>(undefined);

export const useContexto__GerenciarEmblemas__Listagem = (): Contexto__GerenciarEmblemas__Listagem__Props => {
    const context = useContext(Contexto__GerenciarEmblemas__Listagem);
    if (!context) throw new Error('useContexto__GerenciarEmblemas__Listagem precisa estar dentro de um Contexto__GerenciarEmblemas__Listagem');
    return context;
};

export const Contexto__GerenciarEmblemas__Listagem__Provider = () => {
    const { emblemas, carregandoEmblemas } = useContexto__GerenciarEmblemas();

    if (carregandoEmblemas) return <div>{carregandoEmblemas}</div>;

    return (
        <Contexto__GerenciarEmblemas__Listagem.Provider value={{ emblemas }}>
            <SPA__PaginaGerenciarEmblemas__Listagem />
        </Contexto__GerenciarEmblemas__Listagem.Provider>
    );
};