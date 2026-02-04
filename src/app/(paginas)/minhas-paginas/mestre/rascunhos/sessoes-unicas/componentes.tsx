'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export function RascunhoSessoesUnicasMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.rascunhos.sessoesUnicas}>
            <ContextoRascunhosMestreProvider ehSessaoUnica={true}>
                <RascunhosMestre_Contexto />
            </ContextoRascunhosMestreProvider>
        </ControladorSlot>
    );
};