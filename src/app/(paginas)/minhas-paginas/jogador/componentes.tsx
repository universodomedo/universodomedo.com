'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaJogador } from 'Conteineres/PaginaJogador/conteiner';

export default function PaginaJogador_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador}>
            <Conteiner__PaginaJogador />
        </ControladorSlot>
    );
};