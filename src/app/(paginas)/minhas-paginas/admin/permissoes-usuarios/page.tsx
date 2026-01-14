'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoArvoreItensPermissoesProvider } from "Contextos/ContextoArvoreItensPermissoes/contexto";
import { ContextoPaginaPermissoesUsuariosProvider } from "Contextos/ContextoPaginaPermissoesUsuarios/contexto";
import { PaginaAdmin_PermissoesUsuarios_Contexto } from "./componentes";

export default function PaginaAdmin_PermissoesUsuarios() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.dashboardPermissoesUsuarios}>
            <ContextoArvoreItensPermissoesProvider>
                <ContextoPaginaPermissoesUsuariosProvider>
                    <PaginaAdmin_PermissoesUsuarios_Contexto />
                </ContextoPaginaPermissoesUsuariosProvider>
            </ContextoArvoreItensPermissoesProvider>
        </ControladorSlot>
    );
};