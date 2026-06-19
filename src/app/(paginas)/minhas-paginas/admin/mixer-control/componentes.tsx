'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaMixerControl } from 'Conteineres/PaginaMixerControl/conteiner';

export default function PaginaMixerControl_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.mixerControl}>
            <Conteiner__PaginaMixerControl />
        </ControladorSlot>
    );
};