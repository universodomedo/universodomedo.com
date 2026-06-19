'use client';

import { PAGINAS } from 'types-nora-api';

import Conteiner__PaginaModoSolo from 'Conteineres/PaginaModoSolo/conteiner';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaModoSolo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.solo} embrulho={JogoRouteGuard}>
            <Conteiner__PaginaModoSolo />
        </ControladorSlot>
    );
};
