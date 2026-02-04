'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';

export function PaginaJogador_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador}>
            <PaginaJogador_Slot />
        </ControladorSlot>
    );
};

function PaginaJogador_Slot() {
    return <AvisosDePersonagensEFichas />;
};