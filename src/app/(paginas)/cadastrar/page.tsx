'use client';

import { ControladorSlot } from 'Layouts/ControladorSlot';

import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <Acessar/>
        </ControladorSlot>
    );
};

function Acessar() {
    return <ModalPrimeiroAcesso />;
};