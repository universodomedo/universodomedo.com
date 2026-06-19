'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerMissoesDetalhes from 'Conteineres/PaginaGameDesignerMissoesDetalhes/conteiner';

export default function PaginaGameDesignerMissoesDetalhes_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.missoesDetalhes}>
            <Conteiner__PaginaGameDesignerMissoesDetalhes />
        </ControladorSlot>
    );
};
