'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaAdminTutoriais__Props } from '../Contexto__PaginaAdminTutoriais/contexto';
import SPA__PaginaAdminTutoriais__Listagem from 'Conteineres/PaginaAdminTutoriais/paginas/SPA__PaginaAdminTutoriais__Listagem/SPA__PaginaAdminTutoriais__Listagem';

interface Contexto__PaginaAdminTutoriais__Listagem__Props {
    listagemTutoriais: Contexto__PaginaAdminTutoriais__Props['listagemTutoriais'];
    iniciaCriacao: Contexto__PaginaAdminTutoriais__Props['iniciaCriacao'];
    iniciaEdicao: Contexto__PaginaAdminTutoriais__Props['iniciaEdicao'];
};

const Contexto__PaginaAdminTutoriais__Listagem = createContext<Contexto__PaginaAdminTutoriais__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminTutoriais__Listagem = (): Contexto__PaginaAdminTutoriais__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminTutoriais__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminTutoriais__Listagem precisa estar dentro de um Contexto__PaginaAdminTutoriais__Listagem');
    return context;
};

export const Contexto__PaginaAdminTutoriais__Listagem__Provider = ({ listagemTutoriais, iniciaCriacao, iniciaEdicao }: Contexto__PaginaAdminTutoriais__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Gerenciamento de Tutoriais', fecharProps: undefined });

    return (
        <Contexto__PaginaAdminTutoriais__Listagem.Provider value={{ listagemTutoriais, iniciaCriacao, iniciaEdicao }}>
            <SPA__PaginaAdminTutoriais__Listagem />
        </Contexto__PaginaAdminTutoriais__Listagem.Provider>
    );
};
