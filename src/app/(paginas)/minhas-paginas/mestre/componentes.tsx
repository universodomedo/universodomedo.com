'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre}>
            <PaginaMestre_Slot />
        </ControladorSlot>
    );
};

function PaginaMestre_Slot() {
    return (
        <></>
    );
};