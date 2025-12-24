'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";

export default function PaginaAcessar() {
    return (
        <ControladorSlot pagina={PAGINAS.cadastrar}>
            <ModalPrimeiroAcesso />
        </ControladorSlot>
    );
};