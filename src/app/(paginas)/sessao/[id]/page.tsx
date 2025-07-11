import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaSessao_Slot/>
        </ControladorSlot>
    );
};

export function PaginaSessao_Slot() {
    return (
        <></>
    );
};