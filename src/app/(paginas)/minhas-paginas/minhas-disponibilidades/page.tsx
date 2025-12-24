import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoDisponibilidadeUsuarioProvider } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';
import { PaginaMinhaDisponibilidade_Contexto } from './componentes';

export default function PaginaMinhaDisponibilidade() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasDisponibilidades}>
            <ContextoDisponibilidadeUsuarioProvider>
                <PaginaMinhaDisponibilidade_Contexto/>
            </ContextoDisponibilidadeUsuarioProvider>
        </ControladorSlot>
    );
};