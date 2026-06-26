'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosPartida__Props } from '../Contexto__PaginaGameDesignerCatalogosPartida/contexto';
import SPA__PaginaGameDesignerCatalogosPartida__Listagem from 'Conteineres/PaginaGameDesignerCatalogosPartida/paginas/SPA__PaginaGameDesignerCatalogosPartida__Listagem/SPA__PaginaGameDesignerCatalogosPartida__Listagem';

interface Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Props {
    listagemCatalogos: Contexto__PaginaGameDesignerCatalogosPartida__Props['listagemCatalogos'];
    iniciaCadastro: Contexto__PaginaGameDesignerCatalogosPartida__Props['iniciaCadastro'];
    selecionaCatalogo: Contexto__PaginaGameDesignerCatalogosPartida__Props['selecionaCatalogo'];
};

const Contexto__PaginaGameDesignerCatalogosPartida__Listagem = createContext<Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosPartida__Listagem = (): Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosPartida__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosPartida__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosPartida__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Provider = ({ listagemCatalogos, iniciaCadastro, selecionaCatalogo }: Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerCatalogosPartida__Listagem.Provider value={{ listagemCatalogos, iniciaCadastro, selecionaCatalogo }}>
            <SPA__PaginaGameDesignerCatalogosPartida__Listagem />
        </Contexto__PaginaGameDesignerCatalogosPartida__Listagem.Provider>
    );
};
