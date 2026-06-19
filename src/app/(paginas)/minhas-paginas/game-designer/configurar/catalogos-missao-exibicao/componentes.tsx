'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerCatalogosMissaoExibicao from 'Conteineres/PaginaGameDesignerCatalogosMissaoExibicao/conteiner';

export default function PaginaGameDesignerCatalogosMissaoExibicao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.catalogosMissaoExibicao}>
            <Conteiner__PaginaGameDesignerCatalogosMissaoExibicao />
        </ControladorSlot>
    );
};
