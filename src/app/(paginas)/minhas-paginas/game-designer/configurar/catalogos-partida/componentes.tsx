'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerCatalogosPartida from 'Conteineres/PaginaGameDesignerCatalogosPartida/conteiner';

export default function PaginaGameDesignerCatalogosPartida_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.catalogosPartida}>
            <Conteiner__PaginaGameDesignerCatalogosPartida />
        </ControladorSlot>
    );
};
