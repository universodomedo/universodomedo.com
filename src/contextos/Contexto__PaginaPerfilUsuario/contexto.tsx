'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Contexto__PaginaPerfilUsuario__Props {
    urlImagem: string;
};

const Contexto__PaginaPerfilUsuario = createContext<Contexto__PaginaPerfilUsuario__Props | undefined>(undefined);

export const useContexto__PaginaPerfilUsuario = (): Contexto__PaginaPerfilUsuario__Props => {
    const context = useContext(Contexto__PaginaPerfilUsuario);
    if (!context) throw new Error('useContexto__PaginaPerfilUsuario precisa estar dentro de um Contexto__PaginaPerfilUsuario');
    return context;
};

export const Contexto__PaginaPerfilUsuario__Provider = ({ children }: { children: React.ReactNode }) => {

    const urlImagem = 'https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/7b1822c9-a109-4eea-a28d-382fa8f28f59.webp'

    return (
        <Contexto__PaginaPerfilUsuario.Provider value={{urlImagem}}>
            {children}
        </Contexto__PaginaPerfilUsuario.Provider>
    );
};