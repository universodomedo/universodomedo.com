import { ControladorSlot } from 'Layouts/ControladorSlot';

import { ContextoEvoluindoPersonagemProvider } from './contexto.tsx';
import { PaginaEvoluindoPersonagem_Slot } from './componentes.tsx';

export default function PaginaEvoluindoPersonagem() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoEvoluindoPersonagemProvider>
                <PaginaEvoluindoPersonagem_Slot />
            </ContextoEvoluindoPersonagemProvider>
        </ControladorSlot>
    );
};