'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAdminConfiguracaoPatentesTestePericia } from 'Conteineres/PaginaAdminConfiguracaoPatentesTestePericia/conteiner';

export default function PaginaAdminConfiguracaoPatentesTestePericia_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.configuracaoPatentesTestePericia}>
            <Conteiner__PaginaAdminConfiguracaoPatentesTestePericia />
        </ControladorSlot>
    );
};