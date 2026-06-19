'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaGameDesignerMissoesJogaveis from 'Conteineres/PaginaGameDesignerMissoesJogaveis/conteiner';

export default function PaginaGameDesignerMissoesJogaveis_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.missoesJogaveis}>
            <Conteiner__PaginaGameDesignerMissoesJogaveis />
        </ControladorSlot>
    );
};
