'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaModoSolo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.solo} embrulho={JogoRouteGuard}>
            <button type="button">Iniciar Missão Funcional 1</button>
        </ControladorSlot>
    );
};