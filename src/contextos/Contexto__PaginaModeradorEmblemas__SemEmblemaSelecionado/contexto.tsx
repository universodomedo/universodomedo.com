'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorEmblemas__Props } from '../Contexto__PaginaModeradorEmblemas/contexto';
import SPA__PaginaModeradorEmblemas__SemEmblemaSelecionado from 'Conteineres/PaginaModeradorEmblemas/paginas/SPA__PaginaModeradorEmblemas__SemEmblemaSelecionado/SPA__PaginaModeradorEmblemas__SemEmblemaSelecionado';

interface Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Props {
    listagemEmblemas: Contexto__PaginaModeradorEmblemas__Props['listagemEmblemas'];
    estaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['estaEmProcessoCriacao'];
    setEstaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['setEstaEmProcessoCriacao'];
};

const Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada = createContext<Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaModeradorEmblemas__SemAventuraSelecionada = (): Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Props => {
    const context = useContext(Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada);
    if (!context) throw new Error('useContexto__PaginaModeradorEmblemas__SemAventuraSelecionada precisa estar dentro de um Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada');
    return context;
};

export const Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Provider = ({ listagemEmblemas, estaEmProcessoCriacao, setEstaEmProcessoCriacao }: { listagemEmblemas: Contexto__PaginaModeradorEmblemas__Props['listagemEmblemas']; estaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['estaEmProcessoCriacao']; setEstaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['setEstaEmProcessoCriacao']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: null, fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada.Provider value={{ listagemEmblemas, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            <SPA__PaginaModeradorEmblemas__SemEmblemaSelecionado />
        </Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada.Provider>
    );
};