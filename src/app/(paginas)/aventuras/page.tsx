import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAventurasProvider } from 'Contextos/ContextoPaginaAventuras/contexto';
import { PaginasAventuras_Contexto } from './componentes';

export default function PaginaAventuras() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURAS, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventurasProvider>
                <PaginasAventuras_Contexto/>
            </ContextoPaginaAventurasProvider>
        </ControladorSlot>
    );
};