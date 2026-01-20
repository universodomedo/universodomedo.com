'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export function RascunhoAventuraMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.rascunhos.aventuras}>
            <ContextoRascunhosMestreProvider ehSessaoUnica={false}>
                <RascunhosMestre_Contexto />
            </ContextoRascunhosMestreProvider>
        </ControladorSlot>
    );
};