'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoArvoreItensPermissoesProvider } from "Contextos/ContextoArvoreItensPermissoes/contexto";
import { ContextoPaginaPermissoesProvider } from "Contextos/ContextoPaginaPermissoes/contexto";
import { PaginaAdmin_Permissoes_Contexto } from "./componentes";

export default function PaginaAdmin_Permissoes() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.dashboardPermissoes}>
            <ContextoArvoreItensPermissoesProvider>
                <ContextoPaginaPermissoesProvider>
                    <PaginaAdmin_Permissoes_Contexto />
                </ContextoPaginaPermissoesProvider>
            </ContextoArvoreItensPermissoesProvider>
        </ControladorSlot>
    );
};