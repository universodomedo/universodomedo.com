'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerConfiguracaoPartida from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/conteiner';

export default function PaginaGameDesignerConfiguracaoPartida_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.configuracaoPartida}>
            <Conteiner__PaginaGameDesignerConfiguracaoPartida />
        </ControladorSlot>
    );
};
