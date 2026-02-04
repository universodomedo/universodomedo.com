import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LinhaDoTempo from "Componentes/Elementos/LinhaDoTempo/LinhaDoTempo";

export function PaginaLinhaDoTempo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.linhaDoTempo}>
            <LinhaDoTempo />
        </ControladorSlot>
    );
};