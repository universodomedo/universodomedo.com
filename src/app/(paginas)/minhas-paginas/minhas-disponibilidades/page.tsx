import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { ContextoDisponibilidadeUsuarioProvider } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';
import { PaginaMinhaDisponibilidade_Contexto } from './componentes';

export default function PaginaMinhaDisponibilidade() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.DISPONIBILIDADES, comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoDisponibilidadeUsuarioProvider>
                <PaginaMinhaDisponibilidade_Contexto/>
            </ContextoDisponibilidadeUsuarioProvider>
        </ControladorSlot>
    );
};