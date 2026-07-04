'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminGestaoMenu } from 'Conteineres/PaginaAdminGestaoMenu/conteiner';

export function PaginaAdminGestaoMenu_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.gestaoMenu}>
            <Conteiner__PaginaAdminGestaoMenu />
        </ControladorSlot>
    );
};
