'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaModeradorLiberarPalco__Props } from '../Contexto__PaginaModeradorLiberarPalco/contexto';
import SPA__PaginaModeradorLiberarPalco__Listagem from 'Conteineres/PaginaModeradorLiberarPalco/paginas/SPA__PaginaModeradorLiberarPalco__Listagem/SPA__PaginaModeradorLiberarPalco__Listagem';

type Contexto__PaginaModeradorLiberarPalco__Listagem__Props = Contexto__PaginaModeradorLiberarPalco__Props;

const Contexto__PaginaModeradorLiberarPalco__Listagem = createContext<Contexto__PaginaModeradorLiberarPalco__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorLiberarPalco__Listagem = (): Contexto__PaginaModeradorLiberarPalco__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorLiberarPalco__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorLiberarPalco__Listagem precisa estar dentro de um Contexto__PaginaModeradorLiberarPalco__Listagem');
    return context;
};

export const Contexto__PaginaModeradorLiberarPalco__Listagem__Provider = (props: Contexto__PaginaModeradorLiberarPalco__Listagem__Props) => {
    return (
        <Contexto__PaginaModeradorLiberarPalco__Listagem.Provider value={props}>
            <SPA__PaginaModeradorLiberarPalco__Listagem />
        </Contexto__PaginaModeradorLiberarPalco__Listagem.Provider>
    );
};