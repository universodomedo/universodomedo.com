'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerDesafios from 'Conteineres/PaginaGameDesignerDesafios/conteiner';

export default function PaginaGameDesignerDesafios_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.desafios}>
            <Conteiner__PaginaGameDesignerDesafios />
        </ControladorSlot>
    );
};
