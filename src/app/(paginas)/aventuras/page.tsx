import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAventurasProvider } from 'Contextos/ContextoPaginaAventuras/contexto';
import { PaginaAventuras_Slot } from './componentes';

export default function PaginaAventuras() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURAS, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventurasProvider>
                <PaginaAventuras_Slot/>
            </ContextoPaginaAventurasProvider>
        </ControladorSlot>
    );
};