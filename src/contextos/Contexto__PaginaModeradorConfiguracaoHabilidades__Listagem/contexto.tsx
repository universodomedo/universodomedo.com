'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Props } from '../Contexto__PaginaModeradorConfiguracaoHabilidades/contexto';
import SPA__PaginaModeradorConfiguracaoHabilidades__Listagem from 'Conteineres/PaginaModeradorConfiguracaoHabilidades/paginas/SPA__PaginaModeradorConfiguracaoHabilidades__Listagem/SPA__PaginaModeradorConfiguracaoHabilidades__Listagem';

interface Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Props {
    listagemHabilidades: Contexto__PaginaModeradorConfiguracaoHabilidades__Props['listagemHabilidades'];
    selecionaHabilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Props['selecionaHabilidade'];
};

const Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem = createContext<Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoHabilidades__Listagem = (): Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoHabilidades__Listagem precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Provider = ({ listagemHabilidades, selecionaHabilidade }: Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Catálogo Geral de Habilidades', fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem.Provider value={{ listagemHabilidades, selecionaHabilidade }}>
            <SPA__PaginaModeradorConfiguracaoHabilidades__Listagem />
        </Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem.Provider>
    );
};