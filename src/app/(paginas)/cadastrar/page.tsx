'use client';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.VAZIA, comCabecalho: false, usuarioObrigatorio: false }}>
            <Acessar/>
        </ControladorSlot>
    );
};

function Acessar() {
    return <ModalPrimeiroAcesso />;
};