'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import Conteiner__PaginaRascunhos from "Conteineres/PaginaRascunhos/conteiner";

export default function RascunhoSessoesUnicasMestre_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.rascunhos.sessoesUnicas}>
            <Conteiner__PaginaRascunhos ehSessaoUnica={true} />
        </ControladorSlot>
    );
};