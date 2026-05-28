'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorHabilidadesEspeciais__Props } from '../Contexto__PaginaModeradorHabilidadesEspeciais/contexto';
import SPA__PaginaModeradorHabilidadesEspeciais__Listagem from 'Conteineres/PaginaModeradorHabilidadesEspeciais/paginas/SPA__PaginaModeradorHabilidadesEspeciais__Listagem/SPA__PaginaModeradorHabilidadesEspeciais__Listagem';

interface Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Props {
    listagemHabilidades: Contexto__PaginaModeradorHabilidadesEspeciais__Props['listagemHabilidades'];
    estaEmProcessoCriacao: Contexto__PaginaModeradorHabilidadesEspeciais__Props['estaEmProcessoCriacao'];
    iniciaCriacao: Contexto__PaginaModeradorHabilidadesEspeciais__Props['iniciaCriacao'];
    selecionaHabilidade: Contexto__PaginaModeradorHabilidadesEspeciais__Props['selecionaHabilidade'];
};

const Contexto__PaginaModeradorHabilidadesEspeciais__Listagem = createContext<Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesEspeciais__Listagem = (): Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesEspeciais__Listagem);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesEspeciais__Listagem precisa estar dentro de um Contexto__PaginaModeradorHabilidadesEspeciais__Listagem');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Provider = ({ listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade }: Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Catálogo de Habilidades Especiais', fecharProps: undefined });

    return (
        <Contexto__PaginaModeradorHabilidadesEspeciais__Listagem.Provider value={{ listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade }}>
            <SPA__PaginaModeradorHabilidadesEspeciais__Listagem />
        </Contexto__PaginaModeradorHabilidadesEspeciais__Listagem.Provider>
    );
};
