import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LinhaDoTempo from "Componentes/Elementos/LinhaDoTempo/LinhaDoTempo";

export default function PaginaLinhaDoTempo() {
    return (
        <ControladorSlot pagina={PAGINAS.linhaDoTempo}>
            <PaginaLinhaDoTempo_Slot/>
        </ControladorSlot>
    );
};

function PaginaLinhaDoTempo_Slot() {
    return <LinhaDoTempo />;
};