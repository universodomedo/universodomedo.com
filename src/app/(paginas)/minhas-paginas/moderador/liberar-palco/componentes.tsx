'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaModeradorLiberarPalco } from 'Conteineres/PaginaModeradorLiberarPalco/conteiner';

export function PaginaModeradorLiberarPalco_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.liberarPalco}>
            <Conteiner__PaginaModeradorLiberarPalco />
        </ControladorSlot>
    );
};
