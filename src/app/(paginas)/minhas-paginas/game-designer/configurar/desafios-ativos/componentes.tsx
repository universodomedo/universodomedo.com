'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerDesafiosAtivos from 'Conteineres/PaginaGameDesignerDesafiosAtivos/conteiner';

export default function PaginaGameDesignerDesafiosAtivos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.desafiosAtivos}>
            <Conteiner__PaginaGameDesignerDesafiosAtivos />
        </ControladorSlot>
    );
};
