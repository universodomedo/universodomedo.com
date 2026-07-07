'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerEstruturaSerHumano from 'Conteineres/PaginaGameDesignerEstruturaSerHumano/conteiner';

export default function PaginaGameDesignerEstruturaSerHumano_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.estruturaSerHumano}>
            <Conteiner__PaginaGameDesignerEstruturaSerHumano />
        </ControladorSlot>
    );
};
