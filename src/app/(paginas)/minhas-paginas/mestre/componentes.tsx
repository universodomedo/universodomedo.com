'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoGAMBIARRAProvider, useContextoGAMBIARRA } from 'Contextos/ContextoGAMBIARRA/contexto';

export function PaginaMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre}>
            <ContextoGAMBIARRAProvider>
                <PaginaMestre_Slot />
            </ContextoGAMBIARRAProvider>
        </ControladorSlot>
    );
};

function PaginaMestre_Slot() {
    const { rodarTeste } = useContextoGAMBIARRA();

    return (
        <button onClick={rodarTeste}>Rodar</button>
    );
};