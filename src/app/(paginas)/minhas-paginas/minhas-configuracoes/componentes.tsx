import { ControladorSlot } from "Layouts/ControladorSlot";

import { PAGINAS } from "types-nora-api";

export function PaginaMinhasConfigurações_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasConfiguracoes}>
            <PaginaMinhasConfigurações_Slot />
        </ControladorSlot>
    );
};

function PaginaMinhasConfigurações_Slot() {
    return (
        <></>
    );
}; 