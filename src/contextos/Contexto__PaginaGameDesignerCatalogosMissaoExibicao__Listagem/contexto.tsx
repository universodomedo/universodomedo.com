'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props } from '../Contexto__PaginaGameDesignerCatalogosMissaoExibicao/contexto';
import SPA__PaginaGameDesignerCatalogosMissaoExibicao__Listagem from 'Conteineres/PaginaGameDesignerCatalogosMissaoExibicao/paginas/SPA__PaginaGameDesignerCatalogosMissaoExibicao__Listagem/SPA__PaginaGameDesignerCatalogosMissaoExibicao__Listagem';

interface Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Props {
    listagemCatalogosMissao: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['listagemCatalogosMissao'];
    listagemCatalogosMissaoExibicao: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['listagemCatalogosMissaoExibicao'];
    iniciaConfiguracao: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['iniciaConfiguracao'];
};

const Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem = createContext<Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem = (): Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Provider = ({ listagemCatalogosMissao, listagemCatalogosMissaoExibicao, iniciaConfiguracao }: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Configuração de Exibição de Catálogos de Missão', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem.Provider value={{ listagemCatalogosMissao, listagemCatalogosMissaoExibicao, iniciaConfiguracao }}>
            <SPA__PaginaGameDesignerCatalogosMissaoExibicao__Listagem />
        </Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem.Provider>
    );
};
