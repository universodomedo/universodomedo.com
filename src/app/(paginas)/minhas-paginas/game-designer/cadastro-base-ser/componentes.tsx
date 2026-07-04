'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerBasesSer from 'Conteineres/PaginaGameDesignerBasesSer/conteiner';

export default function PaginaGameDesignerCadastroBaseSer_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.cadastroBaseSer}>
            <Conteiner__PaginaGameDesignerBasesSer />
        </ControladorSlot>
    );
};
