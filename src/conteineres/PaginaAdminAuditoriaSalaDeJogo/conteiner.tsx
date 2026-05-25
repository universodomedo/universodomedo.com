'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminAuditoriaSalaDeJogo__Props, Contexto__PaginaAdminAuditoriaSalaDeJogo__Provider, useContexto__PaginaAdminAuditoriaSalaDeJogo } from 'Contextos/Contexto__PaginaAdminAuditoriaSalaDeJogo/contexto';
import { Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem/contexto';

export function Conteiner__PaginaAdminAuditoriaSalaDeJogo() {
    return (
        <Contexto__PaginaAdminAuditoriaSalaDeJogo__Provider>
            <Conteiner__PaginaAdminAuditoriaSalaDeJogo__Interno />
        </Contexto__PaginaAdminAuditoriaSalaDeJogo__Provider>
    );
};

export const Conteiner__PaginaAdminAuditoriaSalaDeJogo__Interno = criaConteiner<PropsConteiner__PaginaAdminAuditoriaSalaDeJogo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminAuditoriaSalaDeJogo = Contexto__PaginaAdminAuditoriaSalaDeJogo__Props;

function resolveSaida(props: PropsConteiner__PaginaAdminAuditoriaSalaDeJogo): SaidaConteiner {
    return criaSaidaConteiner(Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem__Provider, { estado: props });
};

function useEstado(): PropsConteiner__PaginaAdminAuditoriaSalaDeJogo { return useContexto__PaginaAdminAuditoriaSalaDeJogo(); };