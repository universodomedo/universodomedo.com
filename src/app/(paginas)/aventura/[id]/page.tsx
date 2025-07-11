import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

export default function PaginaAventura() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURA, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaAventura_Slot/>
        </ControladorSlot>
    );
};

export function PaginaAventura_Slot() {
    return (
        <></>
    );
};