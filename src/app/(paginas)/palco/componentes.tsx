'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaPalco from 'Conteineres/PaginaPalco/conteiner';

export default function PaginaPalco_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.palco}>
            <Conteiner__PaginaPalco />
        </ControladorSlot>
    );
};