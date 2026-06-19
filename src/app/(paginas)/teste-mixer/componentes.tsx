'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaTesteMixer } from 'Conteineres/PaginaTesteMixer/conteiner';

export default function PaginaTesteMixer_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.testeMixer}>
            <Conteiner__PaginaTesteMixer />
        </ControladorSlot>
    );
};