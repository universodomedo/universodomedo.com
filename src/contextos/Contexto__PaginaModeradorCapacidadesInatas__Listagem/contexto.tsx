'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorCapacidadesInatas__Props } from '../Contexto__PaginaModeradorCapacidadesInatas/contexto';
import SPA__PaginaModeradorCapacidadesInatas__Listagem from 'Conteineres/PaginaModeradorCapacidadesInatas/paginas/SPA__PaginaModeradorCapacidadesInatas__Listagem/SPA__PaginaModeradorCapacidadesInatas__Listagem';

interface Contexto__PaginaModeradorCapacidadesInatas__Listagem__Props {
    listagemCapacidadesInatas: Contexto__PaginaModeradorCapacidadesInatas__Props['listagemCapacidadesInatas'];
    iniciaCadastro: Contexto__PaginaModeradorCapacidadesInatas__Props['iniciaCadastro'];
};

const Contexto__PaginaModeradorCapacidadesInatas__Listagem = createContext<Contexto__PaginaModeradorCapacidadesInatas__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorCapacidadesInatas__Listagem = (): Contexto__PaginaModeradorCapacidadesInatas__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorCapacidadesInatas__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorCapacidadesInatas__Listagem precisa estar dentro de um Contexto__PaginaModeradorCapacidadesInatas__Listagem');
    return context;
};

export const Contexto__PaginaModeradorCapacidadesInatas__Listagem__Provider = ({ listagemCapacidadesInatas, iniciaCadastro }: Contexto__PaginaModeradorCapacidadesInatas__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Cadastro de Capacidades Inatas', fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorCapacidadesInatas__Listagem.Provider value={{ listagemCapacidadesInatas, iniciaCadastro }}>
            <SPA__PaginaModeradorCapacidadesInatas__Listagem />
        </Contexto__PaginaModeradorCapacidadesInatas__Listagem.Provider>
    );
};