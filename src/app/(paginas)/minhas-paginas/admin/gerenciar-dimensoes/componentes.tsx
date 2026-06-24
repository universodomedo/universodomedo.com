'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaGerenciarDimensoes } from 'Conteineres/PaginaGerenciarDimensoes/conteiner';

export default function PaginaGerenciarDimensoes_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.gerenciarDimensoes}>
            <Conteiner__PaginaGerenciarDimensoes />
        </ControladorSlot>
    );
};
