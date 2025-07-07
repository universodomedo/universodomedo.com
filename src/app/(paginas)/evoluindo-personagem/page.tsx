import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { ContextoEvoluindoPersonagemProvider } from 'Contextos/ContextoEvoluindoPersonagem/contexto.tsx';
import { PaginaEvoluindoPersonagem_Slot } from './componentes.tsx';

export default function PaginaEvoluindoPersonagem() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.EVOLUINDO, comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoEvoluindoPersonagemProvider>
                <PaginaEvoluindoPersonagem_Slot />
            </ContextoEvoluindoPersonagemProvider>
        </ControladorSlot>
    );
};