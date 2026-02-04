import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";

export function PaginaAdmin_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin}>
            <PaginaAdmin_Slot />
        </ControladorSlot>
    );
};

export function PaginaAdmin_Slot() {
    return <></>;
};