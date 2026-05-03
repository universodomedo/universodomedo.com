'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function PaginaModerador_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador}>
            <PaginaModerador_Slot />
        </ControladorSlot>
    );
};

function PaginaModerador_Slot() {
    return (
        <></>
    );
};