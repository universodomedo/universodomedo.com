import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaPlay_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo}>
            <PaginaPlay_Slot />
        </ControladorSlot>
    );
};

export function PaginaPlay_Slot() {
    return (<></>);
};