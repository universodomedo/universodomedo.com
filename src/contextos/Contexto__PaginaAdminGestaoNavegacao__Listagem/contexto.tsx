'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminGestaoNavegacao__Props } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import SPA__PaginaAdminGestaoNavegacao__Listagem from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__Listagem/SPA__PaginaAdminGestaoNavegacao__Listagem';

interface Contexto__PaginaAdminGestaoNavegacao__Listagem__Props {
    listagemMenus: Contexto__PaginaAdminGestaoNavegacao__Props['listagemMenus'];
    estaEmProcessoCriacao: Contexto__PaginaAdminGestaoNavegacao__Props['estaEmProcessoCriacao'];
    setEstaEmProcessoCriacao: Contexto__PaginaAdminGestaoNavegacao__Props['setEstaEmProcessoCriacao'];
};

const Contexto__PaginaAdminGestaoNavegacao__Listagem = createContext<Contexto__PaginaAdminGestaoNavegacao__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__Listagem = (): Contexto__PaginaAdminGestaoNavegacao__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__Listagem precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__Listagem');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider = ({ listagemMenus, estaEmProcessoCriacao, setEstaEmProcessoCriacao }: { listagemMenus: Contexto__PaginaAdminGestaoNavegacao__Props['listagemMenus']; estaEmProcessoCriacao: Contexto__PaginaAdminGestaoNavegacao__Props['estaEmProcessoCriacao']; setEstaEmProcessoCriacao: Contexto__PaginaAdminGestaoNavegacao__Props['setEstaEmProcessoCriacao']; }) => {
    return (
        <Contexto__PaginaAdminGestaoNavegacao__Listagem.Provider value={{ listagemMenus, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            <SPA__PaginaAdminGestaoNavegacao__Listagem />
        </Contexto__PaginaAdminGestaoNavegacao__Listagem.Provider>
    );
};
