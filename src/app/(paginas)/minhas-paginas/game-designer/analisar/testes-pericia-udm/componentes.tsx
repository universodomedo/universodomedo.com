'use client';

import { PAGINAS } from 'types-nora-api';

import { Conteiner__PaginaSimuladorTestePericiaUdm } from 'Conteineres/PaginaSimuladorTestePericiaUdm/conteiner';
import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function PaginaSimuladorTestePericiaUdm_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.analisar.simuladorTestePericiaUdm}>
            <Conteiner__PaginaSimuladorTestePericiaUdm />
        </ControladorSlot>
    );
};