import { ControladorSlot } from 'Layouts/ControladorSlot';

import LinhaDoTempo from "Componentes/Elementos/LinhaDoTempo/LinhaDoTempo";

export default function PaginaLinhaDoTempo() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaLinhaDoTempo_Slot/>
        </ControladorSlot>
    );
};

function PaginaLinhaDoTempo_Slot() {
    return <LinhaDoTempo />;
};