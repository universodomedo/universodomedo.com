'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminCatalogoAssinatura__Props } from '../Contexto__PaginaAdminCatalogoAssinatura/contexto';
import SPA__PaginaAdminCatalogoAssinatura__Listagem from 'Conteineres/PaginaAdminCatalogoAssinatura/paginas/SPA__PaginaAdminCatalogoAssinatura__Listagem/SPA__PaginaAdminCatalogoAssinatura__Listagem';

type Contexto__PaginaAdminCatalogoAssinatura__Listagem__Props = Pick<Contexto__PaginaAdminCatalogoAssinatura__Props, 'secaoAtiva' | 'setSecaoAtiva' | 'listagemProdutos' | 'listagemPasses' | 'listagemVinculos' | 'estaEmCriacaoProduto' | 'iniciarCriacaoProduto' | 'editarProduto' | 'estaEmCriacaoPasse' | 'iniciarCriacaoPasse' | 'editarPasse' | 'estaEmCriacaoVinculo' | 'iniciarCriacaoVinculo' | 'editarVinculo'>;

const Contexto__PaginaAdminCatalogoAssinatura__Listagem = createContext<Contexto__PaginaAdminCatalogoAssinatura__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminCatalogoAssinatura__Listagem = (): Contexto__PaginaAdminCatalogoAssinatura__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminCatalogoAssinatura__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminCatalogoAssinatura__Listagem precisa estar dentro de um Contexto__PaginaAdminCatalogoAssinatura__Listagem');
    return context;
};

export const Contexto__PaginaAdminCatalogoAssinatura__Listagem__Provider = (props: Contexto__PaginaAdminCatalogoAssinatura__Listagem__Props) => {
    return (
        <Contexto__PaginaAdminCatalogoAssinatura__Listagem.Provider value={props}>
            <SPA__PaginaAdminCatalogoAssinatura__Listagem />
        </Contexto__PaginaAdminCatalogoAssinatura__Listagem.Provider>
    );
};
