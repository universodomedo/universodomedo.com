import { ControladorSlot } from 'Layouts/ControladorSlot';

import LinhaDoTempo from "Componentes/Elementos/LinhaDoTempo/LinhaDoTempo";

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaLinhaDoTempo/>
        </ControladorSlot>
    );
};

export function PaginaLinhaDoTempo() {
    return <LinhaDoTempo />;
};