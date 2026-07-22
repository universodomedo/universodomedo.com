'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaDocumentacaoProduto__Props } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Listagem from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Listagem/SPA__PaginaDocumentacaoProduto__Listagem';

type Contexto__PaginaDocumentacaoProduto__Listagem__Props = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemPaginas' | 'estaDocumentada' | 'selecionarPagina' | 'abrirCatalogo' | 'abrirMapa' | 'abrirJornadas' | 'abrirEdicao' | 'abrirCtas'>;

const Contexto__PaginaDocumentacaoProduto__Listagem = createContext<Contexto__PaginaDocumentacaoProduto__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Listagem = (): Contexto__PaginaDocumentacaoProduto__Listagem__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Listagem);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Listagem precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Listagem');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Listagem__Provider = (props: Contexto__PaginaDocumentacaoProduto__Listagem__Props) => {
    // Raiz do fluxo: limpa a navegação contextual dos subfluxos (subtítulo/X residuais).
    useConfigurarLayoutContextualizado({ subtitulo: null, fecharProps: undefined });

    return (
        <Contexto__PaginaDocumentacaoProduto__Listagem.Provider value={props}>
            <SPA__PaginaDocumentacaoProduto__Listagem />
        </Contexto__PaginaDocumentacaoProduto__Listagem.Provider>
    );
};