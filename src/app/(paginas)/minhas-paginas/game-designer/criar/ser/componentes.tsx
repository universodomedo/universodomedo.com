'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerSeres from 'Conteineres/PaginaGameDesignerSeres/conteiner';

export default function PaginaGameDesignerSeres_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.criar.ser}>
            <Conteiner__PaginaGameDesignerSeres />
        </ControladorSlot>
    );
};
