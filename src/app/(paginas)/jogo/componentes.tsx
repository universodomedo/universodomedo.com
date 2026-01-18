import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from './JogoRouteGuard';

export function PaginaPlay_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo} embrulho={JogoRouteGuard}>
            <PaginaPlay_Slot />
        </ControladorSlot>
    );
};

export function PaginaPlay_Slot() {
    return (<></>);
};