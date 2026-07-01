'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminGestaoNavegacao__Props } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import SPA__PaginaAdminGestaoNavegacao__Listagem from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__Listagem/SPA__PaginaAdminGestaoNavegacao__Listagem';

type Contexto__PaginaAdminGestaoNavegacao__Listagem__Props = Pick<Contexto__PaginaAdminGestaoNavegacao__Props, 'listagemPaginas' | 'selecionarPagina'>;

const Contexto__PaginaAdminGestaoNavegacao__Listagem = createContext<Contexto__PaginaAdminGestaoNavegacao__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__Listagem = (): Contexto__PaginaAdminGestaoNavegacao__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__Listagem precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__Listagem');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider = (props: Contexto__PaginaAdminGestaoNavegacao__Listagem__Props) => {
    return (
        <Contexto__PaginaAdminGestaoNavegacao__Listagem.Provider value={props}>
            <SPA__PaginaAdminGestaoNavegacao__Listagem />
        </Contexto__PaginaAdminGestaoNavegacao__Listagem.Provider>
    );
};