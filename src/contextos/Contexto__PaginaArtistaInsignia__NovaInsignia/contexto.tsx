'use client';

import { createContext, useContext } from 'react';

import SPA__PaginaArtistaInsignia__NovaInsignia from 'Conteineres/PaginaArtistaInsignia/paginas/SPA__PaginaArtistaInsignia__NovaInsignia/SPA__PaginaArtistaInsignia__NovaInsignia';

interface Contexto__PaginaArtistaInsignia__NovaInsignia__Props {
    
};

const Contexto__PaginaArtistaInsignia__NovaInsignia = createContext<Contexto__PaginaArtistaInsignia__NovaInsignia__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia__NovaInsignia = (): Contexto__PaginaArtistaInsignia__NovaInsignia__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia__NovaInsignia);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia__NovaInsignia precisa estar dentro de um Contexto__PaginaArtistaInsignia__NovaInsignia');
    return context;
};

export const Contexto__PaginaArtistaInsignia__NovaInsignia__Provider = () => {

    return (
        <Contexto__PaginaArtistaInsignia__NovaInsignia.Provider value={{  }}>
            <SPA__PaginaArtistaInsignia__NovaInsignia />
        </Contexto__PaginaArtistaInsignia__NovaInsignia.Provider>
    );
};