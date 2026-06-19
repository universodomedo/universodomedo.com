'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerMissoesDetalhes__Props } from '../Contexto__PaginaGameDesignerMissoesDetalhes/contexto';
import SPA__PaginaGameDesignerMissoesDetalhes__Listagem from 'Conteineres/PaginaGameDesignerMissoesDetalhes/paginas/SPA__PaginaGameDesignerMissoesDetalhes__Listagem/SPA__PaginaGameDesignerMissoesDetalhes__Listagem';

interface Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Props {
    listagemMissoes: Contexto__PaginaGameDesignerMissoesDetalhes__Props['listagemMissoes'];
    listagemMissoesDetalhes: Contexto__PaginaGameDesignerMissoesDetalhes__Props['listagemMissoesDetalhes'];
    iniciaConfiguracao: Contexto__PaginaGameDesignerMissoesDetalhes__Props['iniciaConfiguracao'];
};

const Contexto__PaginaGameDesignerMissoesDetalhes__Listagem = createContext<Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesDetalhes__Listagem = (): Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesDetalhes__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesDetalhes__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerMissoesDetalhes__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Provider = ({ listagemMissoes, listagemMissoesDetalhes, iniciaConfiguracao }: Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Configuração de Detalhes de Missões', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerMissoesDetalhes__Listagem.Provider value={{ listagemMissoes, listagemMissoesDetalhes, iniciaConfiguracao }}>
            <SPA__PaginaGameDesignerMissoesDetalhes__Listagem />
        </Contexto__PaginaGameDesignerMissoesDetalhes__Listagem.Provider>
    );
};
