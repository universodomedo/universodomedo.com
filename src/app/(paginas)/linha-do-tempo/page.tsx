import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import LinhaDoTempo from "Componentes/Elementos/LinhaDoTempo/LinhaDoTempo";

export default function PaginaLinhaDoTempo() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.LINHA_DO_TEMPO, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaLinhaDoTempo_Slot/>
        </ControladorSlot>
    );
};

function PaginaLinhaDoTempo_Slot() {
    return <LinhaDoTempo />;
};