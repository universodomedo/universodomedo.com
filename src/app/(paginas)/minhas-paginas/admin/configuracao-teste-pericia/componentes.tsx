'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminConfiguracaoTestePericia } from 'Conteineres/PaginaAdminConfiguracaoTestePericia/conteiner';

export default function PaginaAdminConfiguracaoTestePericia_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.configuracaoTestePericia}>
            <Conteiner__PaginaAdminConfiguracaoTestePericia />
        </ControladorSlot>
    );
};
