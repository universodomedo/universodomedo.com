'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminCatalogoAssinatura } from 'Conteineres/PaginaAdminCatalogoAssinatura/conteiner';

export function PaginaAdminCatalogoAssinatura_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.catalogoAssinatura}>
            <Conteiner__PaginaAdminCatalogoAssinatura />
        </ControladorSlot>
    );
};
