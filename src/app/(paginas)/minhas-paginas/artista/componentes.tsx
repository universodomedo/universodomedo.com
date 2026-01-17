import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaArtista_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista}>
            <PaginaArtista_Slot />
        </ControladorSlot>
    );
};

function PaginaArtista_Slot() {
    return <></>;
};