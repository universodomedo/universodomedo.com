'use client';

import { createContext, useContext } from 'react';
import { PAGINAS } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Listagem from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Listagem/SPA__PaginaGameDesignerSeres__Listagem';

interface Contexto__PaginaGameDesignerSeres__Listagem__Props {
    listagemSeres: Contexto__PaginaGameDesignerSeres__Props['listagemSeres'];
    iniciaCadastro: Contexto__PaginaGameDesignerSeres__Props['iniciaCadastro'];
    abreEstrutura: Contexto__PaginaGameDesignerSeres__Props['abreEstrutura'];
};

const Contexto__PaginaGameDesignerSeres__Listagem = createContext<Contexto__PaginaGameDesignerSeres__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Listagem = (): Contexto__PaginaGameDesignerSeres__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Listagem__Provider = ({ listagemSeres, iniciaCadastro, abreEstrutura }: Contexto__PaginaGameDesignerSeres__Listagem__Props) => {
    // Título estável vem da PAGINA; a listagem raiz não precisa de subtítulo e o fechar devolve à área do GD (navegação não-travada).
    useConfigurarLayoutContextualizado({ subtitulo: undefined, fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.gameDesigner, tituloTooltip: 'Voltar para Página de Game Designer' } });

    return (
        <Contexto__PaginaGameDesignerSeres__Listagem.Provider value={{ listagemSeres, iniciaCadastro, abreEstrutura }}>
            <SPA__PaginaGameDesignerSeres__Listagem />
        </Contexto__PaginaGameDesignerSeres__Listagem.Provider>
    );
};
