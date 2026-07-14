'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminSalasChat__Props } from '../Contexto__PaginaAdminSalasChat/contexto';
import SPA__PaginaAdminSalasChat__Listagem from 'Conteineres/PaginaAdminSalasChat/paginas/SPA__PaginaAdminSalasChat__Listagem/SPA__PaginaAdminSalasChat__Listagem';

type Contexto__PaginaAdminSalasChat__Listagem__Props = Pick<Contexto__PaginaAdminSalasChat__Props, 'listagemSalas' | 'estaEmCriacaoSala' | 'iniciarCriacaoSala' | 'editarSala'>;

const Contexto__PaginaAdminSalasChat__Listagem = createContext<Contexto__PaginaAdminSalasChat__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminSalasChat__Listagem = (): Contexto__PaginaAdminSalasChat__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminSalasChat__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminSalasChat__Listagem precisa estar dentro de um Contexto__PaginaAdminSalasChat__Listagem');
    return context;
};

export const Contexto__PaginaAdminSalasChat__Listagem__Provider = (props: Contexto__PaginaAdminSalasChat__Listagem__Props) => {
    return (
        <Contexto__PaginaAdminSalasChat__Listagem.Provider value={props}>
            <SPA__PaginaAdminSalasChat__Listagem />
        </Contexto__PaginaAdminSalasChat__Listagem.Provider>
    );
};
