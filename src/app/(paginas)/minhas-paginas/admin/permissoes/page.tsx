'use client';

import { ContextoArvoreItensPermissoesProvider } from "Contextos/ContextoArvoreItensPermissoes/contexto";
import { ContextoPaginaPermissoesProvider } from "Contextos/ContextoPaginaPermissoes/contexto";
import { PaginaAdmin_Permissoes_Contexto } from "./componentes";

export default function PaginaAdmin_Permissoes() {
    return (
        <ContextoArvoreItensPermissoesProvider>
            <ContextoPaginaPermissoesProvider>
                <PaginaAdmin_Permissoes_Contexto />
            </ContextoPaginaPermissoesProvider>
        </ContextoArvoreItensPermissoesProvider>
    );
};