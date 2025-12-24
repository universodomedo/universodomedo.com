import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginasListagemSessoesProvider } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { PaginaSessoes_Slot } from './componentes';

export default function PaginaSessoes() {
    return (
        <ControladorSlot pagina={PAGINAS.sessoes}>
            <ContextoPaginasListagemSessoesProvider>
                <PaginaSessoes_Slot />
            </ContextoPaginasListagemSessoesProvider>
        </ControladorSlot>
    );
};