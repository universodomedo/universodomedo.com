'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { SPA_PaginaJogadorCriaFicha } from 'Contextos/ContextoPaginaJogadorCriaFicha/contexto';

export function PaginaJogadorCriarFicha_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.criar.ficha}>
            <SPA_PaginaJogadorCriaFicha />
        </ControladorSlot>
    );
};