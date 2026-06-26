'use client';

import { PAGINAS } from 'types-nora-api';

import Conteiner__PaginaPartidas from 'Conteineres/PaginaPartidas/conteiner';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaPartidas_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.partidas} embrulho={JogoRouteGuard}>
            <Conteiner__PaginaPartidas />
        </ControladorSlot>
    );
};
