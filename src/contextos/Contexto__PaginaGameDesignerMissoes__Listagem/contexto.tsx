'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerMissoes__Props } from '../Contexto__PaginaGameDesignerMissoes/contexto';
import SPA__PaginaGameDesignerMissoes__Listagem from 'Conteineres/PaginaGameDesignerMissoes/paginas/SPA__PaginaGameDesignerMissoes__Listagem/SPA__PaginaGameDesignerMissoes__Listagem';

interface Contexto__PaginaGameDesignerMissoes__Listagem__Props {
    listagemMissoes: Contexto__PaginaGameDesignerMissoes__Props['listagemMissoes'];
    criandoMissao: Contexto__PaginaGameDesignerMissoes__Props['criandoMissao'];
    criarMissao: Contexto__PaginaGameDesignerMissoes__Props['criarMissao'];
    removerMissao: Contexto__PaginaGameDesignerMissoes__Props['removerMissao'];
};

const Contexto__PaginaGameDesignerMissoes__Listagem = createContext<Contexto__PaginaGameDesignerMissoes__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoes__Listagem = (): Contexto__PaginaGameDesignerMissoes__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoes__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoes__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerMissoes__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerMissoes__Listagem__Provider = ({ listagemMissoes, criandoMissao, criarMissao, removerMissao }: Contexto__PaginaGameDesignerMissoes__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Gerenciamento de Missões', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerMissoes__Listagem.Provider value={{ listagemMissoes, criandoMissao, criarMissao, removerMissao }}>
            <SPA__PaginaGameDesignerMissoes__Listagem />
        </Contexto__PaginaGameDesignerMissoes__Listagem.Provider>
    );
};