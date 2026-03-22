'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../JogoRouteGuard';
import Conteiner__PaginaPreJogo_Jogador from 'Conteineres/PaginaPreJogo_Jogador/conteiner';

export default function PaginaEmJogo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador} embrulho={JogoRouteGuard}>
            <Conteiner__PaginaPreJogo_Jogador />
        </ControladorSlot>
    );
};