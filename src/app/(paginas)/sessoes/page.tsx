import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginasListagemSessoesProvider } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { PaginaSessoes_Slot } from './componentes';

export default function PaginaSessoes() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginasListagemSessoesProvider>
                <PaginaSessoes_Slot />
            </ContextoPaginasListagemSessoesProvider>
        </ControladorSlot>
    );
};