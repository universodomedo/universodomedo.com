import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";

export function PaginaArtista_MinhasImagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.minhasImagens}>
            <PaginaArtista_MinhasImagens_Slot />
        </ControladorSlot>
    );
};

function PaginaArtista_MinhasImagens_Slot() {
    return (
        <h1>oi</h1>
    );
};