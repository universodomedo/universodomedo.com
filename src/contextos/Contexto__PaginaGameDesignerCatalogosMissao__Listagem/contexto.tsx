'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosMissao__Props } from '../Contexto__PaginaGameDesignerCatalogosMissao/contexto';
import SPA__PaginaGameDesignerCatalogosMissao__Listagem from 'Conteineres/PaginaGameDesignerCatalogosMissao/paginas/SPA__PaginaGameDesignerCatalogosMissao__Listagem/SPA__PaginaGameDesignerCatalogosMissao__Listagem';

interface Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Props {
    listagemCatalogosMissao: Contexto__PaginaGameDesignerCatalogosMissao__Props['listagemCatalogosMissao'];
    iniciaCriacao: Contexto__PaginaGameDesignerCatalogosMissao__Props['iniciaCriacao'];
    iniciaEdicao: Contexto__PaginaGameDesignerCatalogosMissao__Props['iniciaEdicao'];
    removerCatalogo: Contexto__PaginaGameDesignerCatalogosMissao__Props['removerCatalogo'];
};

const Contexto__PaginaGameDesignerCatalogosMissao__Listagem = createContext<Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissao__Listagem = (): Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissao__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissao__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissao__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Provider = ({ listagemCatalogosMissao, iniciaCriacao, iniciaEdicao, removerCatalogo }: Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Gerenciamento de Catálogos de Missão', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerCatalogosMissao__Listagem.Provider value={{ listagemCatalogosMissao, iniciaCriacao, iniciaEdicao, removerCatalogo }}>
            <SPA__PaginaGameDesignerCatalogosMissao__Listagem />
        </Contexto__PaginaGameDesignerCatalogosMissao__Listagem.Provider>
    );
};