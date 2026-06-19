'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerMissoesExibicao__Props } from '../Contexto__PaginaGameDesignerMissoesExibicao/contexto';
import SPA__PaginaGameDesignerMissoesExibicao__Listagem from 'Conteineres/PaginaGameDesignerMissoesExibicao/paginas/SPA__PaginaGameDesignerMissoesExibicao__Listagem/SPA__PaginaGameDesignerMissoesExibicao__Listagem';

interface Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Props {
    listagemMissoes: Contexto__PaginaGameDesignerMissoesExibicao__Props['listagemMissoes'];
    listagemMissoesDetalhes: Contexto__PaginaGameDesignerMissoesExibicao__Props['listagemMissoesDetalhes'];
    listagemMissoesExibicao: Contexto__PaginaGameDesignerMissoesExibicao__Props['listagemMissoesExibicao'];
    listagemCatalogosMissao: Contexto__PaginaGameDesignerMissoesExibicao__Props['listagemCatalogosMissao'];
    iniciaConfiguracao: Contexto__PaginaGameDesignerMissoesExibicao__Props['iniciaConfiguracao'];
};

const Contexto__PaginaGameDesignerMissoesExibicao__Listagem = createContext<Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesExibicao__Listagem = (): Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesExibicao__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesExibicao__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerMissoesExibicao__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Provider = ({ listagemMissoes, listagemMissoesDetalhes, listagemMissoesExibicao, listagemCatalogosMissao, iniciaConfiguracao }: Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Configuração de Exibição de Missões', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerMissoesExibicao__Listagem.Provider value={{ listagemMissoes, listagemMissoesDetalhes, listagemMissoesExibicao, listagemCatalogosMissao, iniciaConfiguracao }}>
            <SPA__PaginaGameDesignerMissoesExibicao__Listagem />
        </Contexto__PaginaGameDesignerMissoesExibicao__Listagem.Provider>
    );
};
