'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminGestaoNavegacao } from 'Conteineres/PaginaAdminGestaoNavegacao/conteiner';

export function PaginaAdminGestaoNavegacao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.gestaoNavegacao}>
            <Conteiner__PaginaAdminGestaoNavegacao />
        </ControladorSlot>
    );
};
