'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../JogoRouteGuard';
import Conteiner__EmJogo from 'Conteineres/EmJogo/conteiner';

export default function PaginaEmJogo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo} embrulho={JogoRouteGuard}>
            <Conteiner__EmJogo />
        </ControladorSlot>
    );
};