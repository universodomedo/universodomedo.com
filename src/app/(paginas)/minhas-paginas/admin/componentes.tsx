import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";

export default function PaginaAdmin_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin}>
            <PaginaAdmin_Slot />
        </ControladorSlot>
    );
};

function PaginaAdmin_Slot() {
    return <></>;
};