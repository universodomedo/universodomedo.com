'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminSalasChat } from 'Conteineres/PaginaAdminSalasChat/conteiner';

export function PaginaAdminSalasChat_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.salasChat}>
            <Conteiner__PaginaAdminSalasChat />
        </ControladorSlot>
    );
};
