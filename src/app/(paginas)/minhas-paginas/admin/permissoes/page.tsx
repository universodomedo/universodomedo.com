'use client';

import { ContextoPaginaPermissoesProvider } from "Contextos/ContextoPaginaPermissoes/contexto";
import { PaginaAdmin_Permissoes_Contexto } from "./componentes";

export default function PaginaAdmin_Permissoes() {
    return (
        <ContextoPaginaPermissoesProvider>
            <PaginaAdmin_Permissoes_Contexto />
        </ContextoPaginaPermissoesProvider>
    );
};