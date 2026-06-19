'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerCatalogosMissao from 'Conteineres/PaginaGameDesignerCatalogosMissao/conteiner';

export default function PaginaGameDesignerCatalogosMissao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.criar.catalogosMissao}>
            <Conteiner__PaginaGameDesignerCatalogosMissao />
        </ControladorSlot>
    );
};