'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaAdminAuditoriaSalaDeJogo__Props } from 'Contextos/Contexto__PaginaAdminAuditoriaSalaDeJogo/contexto';
import SPA__PaginaAdminAuditoriaSalaDeJogo__Listagem from 'Conteineres/PaginaAdminAuditoriaSalaDeJogo/paginas/SPA__PaginaAdminAuditoriaSalaDeJogo__Listagem/SPA__PaginaAdminAuditoriaSalaDeJogo__Listagem';

const Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem = createContext<Contexto__PaginaAdminAuditoriaSalaDeJogo__Props | undefined>(undefined);

export const useContexto__PaginaAdminAuditoriaSalaDeJogo__Listagem = (): Contexto__PaginaAdminAuditoriaSalaDeJogo__Props => {
    const context = useContext(Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminAuditoriaSalaDeJogo__Listagem precisa estar dentro de um Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem');
    return context;
};

export const Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem__Provider = ({ estado }: { estado: Contexto__PaginaAdminAuditoriaSalaDeJogo__Props; }) => {
    return (
        <Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem.Provider value={estado}>
            <SPA__PaginaAdminAuditoriaSalaDeJogo__Listagem />
        </Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem.Provider>
    );
};