'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import Conteiner__PaginaRascunhos from "Conteineres/PaginaRascunhos/conteiner";

export default function RascunhoAventuraMestre_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.rascunhos.aventuras}>
            <Conteiner__PaginaRascunhos ehSessaoUnica={false} />
        </ControladorSlot>
    );
};