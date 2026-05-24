'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminConfiguracaoTestePericia__Props } from 'Contextos/Contexto__PaginaAdminConfiguracaoTestePericia/contexto';
import SPA__PaginaAdminConfiguracaoTestePericia__Edicao from 'Conteineres/PaginaAdminConfiguracaoTestePericia/paginas/SPA__PaginaAdminConfiguracaoTestePericia__Edicao/SPA__PaginaAdminConfiguracaoTestePericia__Edicao';

const Contexto__PaginaAdminConfiguracaoTestePericia__Edicao = createContext<Contexto__PaginaAdminConfiguracaoTestePericia__Props | undefined>(undefined);

export const useContexto__PaginaAdminConfiguracaoTestePericia__Edicao = (): Contexto__PaginaAdminConfiguracaoTestePericia__Props => {
    const context = useContext(Contexto__PaginaAdminConfiguracaoTestePericia__Edicao);
    if (!context) throw new Error('useContexto__PaginaAdminConfiguracaoTestePericia__Edicao precisa estar dentro de um Contexto__PaginaAdminConfiguracaoTestePericia__Edicao');
    return context;
};

export const Contexto__PaginaAdminConfiguracaoTestePericia__Edicao__Provider = ({ estado }: { estado: Contexto__PaginaAdminConfiguracaoTestePericia__Props; }) => {
    return (
        <Contexto__PaginaAdminConfiguracaoTestePericia__Edicao.Provider value={estado}>
            <SPA__PaginaAdminConfiguracaoTestePericia__Edicao />
        </Contexto__PaginaAdminConfiguracaoTestePericia__Edicao.Provider>
    );
};
