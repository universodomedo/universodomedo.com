'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaColaboradorRoteirosEditor3D } from 'Conteineres/PaginaColaboradorRoteirosEditor3D/conteiner';

export default function PaginaColaboradorRoteirosEditor3D_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.colaborador.roteirosEditor3D}>
            <Conteiner__PaginaColaboradorRoteirosEditor3D />
        </ControladorSlot>
    );
};