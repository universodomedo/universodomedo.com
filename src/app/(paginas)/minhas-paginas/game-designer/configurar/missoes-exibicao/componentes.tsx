'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerMissoesExibicao from 'Conteineres/PaginaGameDesignerMissoesExibicao/conteiner';

export default function PaginaGameDesignerMissoesExibicao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.missoesExibicao}>
            <Conteiner__PaginaGameDesignerMissoesExibicao />
        </ControladorSlot>
    );
};
