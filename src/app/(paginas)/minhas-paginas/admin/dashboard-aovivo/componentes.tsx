'use client';

import { ContextoPaginaAovivoProvider } from "Contextos/ContextoPaginaAovivo/contexto";

export function DashboardAovivo_Contexto() {
    return (
        <ContextoPaginaAovivoProvider>
            <DashboardAovivo_Conteudo />
        </ContextoPaginaAovivoProvider>
    );
};

function DashboardAovivo_Conteudo() {
    return (
        <></>
    );
};