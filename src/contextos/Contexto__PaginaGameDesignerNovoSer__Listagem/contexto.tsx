'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerNovoSer__Props } from '../Contexto__PaginaGameDesignerNovoSer/contexto';
import SPA__PaginaGameDesignerNovoSer__Listagem from 'Conteineres/PaginaGameDesignerNovoSer/paginas/SPA__PaginaGameDesignerNovoSer__Listagem/SPA__PaginaGameDesignerNovoSer__Listagem';

interface Contexto__PaginaGameDesignerNovoSer__Listagem__Props {
    listagemSeres: Contexto__PaginaGameDesignerNovoSer__Props['listagemSeres'];
    iniciaCadastro: Contexto__PaginaGameDesignerNovoSer__Props['iniciaCadastro'];
    abreEstrutura: Contexto__PaginaGameDesignerNovoSer__Props['abreEstrutura'];
};

const Contexto__PaginaGameDesignerNovoSer__Listagem = createContext<Contexto__PaginaGameDesignerNovoSer__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerNovoSer__Listagem = (): Contexto__PaginaGameDesignerNovoSer__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerNovoSer__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerNovoSer__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerNovoSer__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerNovoSer__Listagem__Provider = ({ listagemSeres, iniciaCadastro, abreEstrutura }: Contexto__PaginaGameDesignerNovoSer__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Seres', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerNovoSer__Listagem.Provider value={{ listagemSeres, iniciaCadastro, abreEstrutura }}>
            <SPA__PaginaGameDesignerNovoSer__Listagem />
        </Contexto__PaginaGameDesignerNovoSer__Listagem.Provider>
    );
};
