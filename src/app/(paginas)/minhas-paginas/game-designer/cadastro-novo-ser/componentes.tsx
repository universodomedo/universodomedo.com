'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerNovoSer from 'Conteineres/PaginaGameDesignerNovoSer/conteiner';

export default function PaginaGameDesignerCadastroNovoSer_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.cadastroNovoSer}>
            <Conteiner__PaginaGameDesignerNovoSer />
        </ControladorSlot>
    );
};
