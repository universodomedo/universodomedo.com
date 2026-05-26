'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorHabilidadesPericia__Props } from '../Contexto__PaginaModeradorHabilidadesPericia/contexto';
import SPA__PaginaModeradorHabilidadesPericia__Listagem from 'Conteineres/PaginaModeradorHabilidadesPericia/paginas/SPA__PaginaModeradorHabilidadesPericia__Listagem/SPA__PaginaModeradorHabilidadesPericia__Listagem';

interface Contexto__PaginaModeradorHabilidadesPericia__Listagem__Props {
    listagemHabilidades: Contexto__PaginaModeradorHabilidadesPericia__Props['listagemHabilidades'];
    estaEmProcessoCriacao: Contexto__PaginaModeradorHabilidadesPericia__Props['estaEmProcessoCriacao'];
    iniciaCriacao: Contexto__PaginaModeradorHabilidadesPericia__Props['iniciaCriacao'];
    selecionaHabilidade: Contexto__PaginaModeradorHabilidadesPericia__Props['selecionaHabilidade'];
};

const Contexto__PaginaModeradorHabilidadesPericia__Listagem = createContext<Contexto__PaginaModeradorHabilidadesPericia__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesPericia__Listagem = (): Contexto__PaginaModeradorHabilidadesPericia__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesPericia__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesPericia__Listagem precisa estar dentro de um Contexto__PaginaModeradorHabilidadesPericia__Listagem');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesPericia__Listagem__Provider = ({ listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade }: Contexto__PaginaModeradorHabilidadesPericia__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Catálogo de Habilidades de Perícia', fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorHabilidadesPericia__Listagem.Provider value={{ listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade }}>
            <SPA__PaginaModeradorHabilidadesPericia__Listagem />
        </Contexto__PaginaModeradorHabilidadesPericia__Listagem.Provider>
    );
};