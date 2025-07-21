import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import TesteChatPage from './componentes';

export default function MinhaPagina() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.VAZIA, comCabecalho: false, usuarioObrigatorio: true }}>
            <TesteChatPage />
        </ControladorSlot>
    );
};