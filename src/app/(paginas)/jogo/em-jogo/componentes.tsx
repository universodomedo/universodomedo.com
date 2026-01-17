import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function Pagina_EmJogo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo}>
            <h1>oi Em Jogo</h1>
        </ControladorSlot>
    );
};