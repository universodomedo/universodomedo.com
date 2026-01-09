'use client';

import { ContextoArvoreItensPermissoesProvider } from "Contextos/ContextoArvoreItensPermissoes/contexto";
import { ContextoPaginaPermissoesUsuariosProvider } from "Contextos/ContextoPaginaPermissoesUsuarios/contexto";
import { PaginaAdmin_PermissoesUsuarios_Contexto } from "./componentes";

export default function PaginaAdmin_PermissoesUsuarios() {
    return (
        <ContextoArvoreItensPermissoesProvider>
            <ContextoPaginaPermissoesUsuariosProvider>
                <PaginaAdmin_PermissoesUsuarios_Contexto />
            </ContextoPaginaPermissoesUsuariosProvider>
        </ContextoArvoreItensPermissoesProvider>
    );
};