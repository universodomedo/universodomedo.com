'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerMissoes from 'Conteineres/PaginaGameDesignerMissoes/conteiner';

export default function PaginaGameDesignerMissoes_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.criar.missoes}>
            <Conteiner__PaginaGameDesignerMissoes />
        </ControladorSlot>
    );
};