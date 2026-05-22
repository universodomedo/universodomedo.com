'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaArtistaInsignia__Props } from '../Contexto__PaginaArtistaInsignia/contexto';
import SPA__PaginaArtistaInsignia__Listagem from 'Conteineres/PaginaArtistaInsignia/paginas/SPA__PaginaArtistaInsignia__Listagem/SPA__PaginaArtistaInsignia__Listagem';

interface Contexto__PaginaArtistaInsignia__Listagem__Props {
    listagemInsignias: Contexto__PaginaArtistaInsignia__Props['listagemInsignias'];
    estaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['estaEmProcessoCriacao'];
    setEstaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['setEstaEmProcessoCriacao'];
};

const Contexto__PaginaArtistaInsignia__Listagem = createContext<Contexto__PaginaArtistaInsignia__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia__Listagem = (): Contexto__PaginaArtistaInsignia__Listagem__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia__Listagem);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia__Listagem precisa estar dentro de um Contexto__PaginaArtistaInsignia__Listagem');
    return context;
};

export const Contexto__PaginaArtistaInsignia__Listagem__Provider = ({ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }: { listagemInsignias: Contexto__PaginaArtistaInsignia__Props['listagemInsignias']; estaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['estaEmProcessoCriacao']; setEstaEmProcessoCriacao: Contexto__PaginaArtistaInsignia__Props['setEstaEmProcessoCriacao']; }) => {

    return (
        <Contexto__PaginaArtistaInsignia__Listagem.Provider value={{ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            <SPA__PaginaArtistaInsignia__Listagem />
        </Contexto__PaginaArtistaInsignia__Listagem.Provider>
    );
};