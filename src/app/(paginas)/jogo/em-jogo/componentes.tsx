import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../JogoRouteGuard';

export function Pagina_EmJogo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo} embrulho={JogoRouteGuard}>
            <h1>oi Em Jogo</h1>
        </ControladorSlot>
    );
};