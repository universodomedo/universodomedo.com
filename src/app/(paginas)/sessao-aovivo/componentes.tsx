'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAoVivo } from 'Conteineres/PaginaAoVivo/conteiner';

export function PaginaSessao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.sessaoAovivo}>
            <Conteiner__PaginaAoVivo />
        </ControladorSlot>
    );
};