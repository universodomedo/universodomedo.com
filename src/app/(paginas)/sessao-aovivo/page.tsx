import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoFichaPersonagemProvider } from 'Contextos/ContextoFichaPersonagem/contexto';
import { PaginaSessao_Slot } from './componentes';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoFichaPersonagemProvider>
                <PaginaSessao_Slot/>
            </ContextoFichaPersonagemProvider>
        </ControladorSlot>
    );
};