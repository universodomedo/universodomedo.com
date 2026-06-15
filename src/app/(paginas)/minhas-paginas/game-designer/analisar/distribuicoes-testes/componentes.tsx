'use client';

import { PAGINAS } from 'types-nora-api';

import { Conteiner__PaginaSimuladorDistribuicoesTeste } from 'Conteineres/PaginaSimuladorDistribuicoesTeste/conteiner';
import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function PaginaSimuladorDistribuicoesTeste_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.analisar.simuladorDistribuicoesTeste}>
            <Conteiner__PaginaSimuladorDistribuicoesTeste />
        </ControladorSlot>
    );
};