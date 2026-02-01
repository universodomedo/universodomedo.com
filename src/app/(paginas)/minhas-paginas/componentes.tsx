import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";

export function MinhasPaginas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas}>
            <MinhasPaginas_Contexto />
        </ControladorSlot>
    );
};

function MinhasPaginas_Contexto() {
    return (<></>);
};