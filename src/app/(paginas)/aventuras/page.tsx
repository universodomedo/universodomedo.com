import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaAventurasProvider } from 'Contextos/ContextoPaginaAventuras/contexto';
import { PaginasAventuras_Contexto } from './componentes';

export default function PaginaAventuras() {
    return (
        <ControladorSlot pagina={PAGINAS.aventuras}>
            <ContextoPaginaAventurasProvider>
                <PaginasAventuras_Contexto/>
            </ContextoPaginaAventurasProvider>
        </ControladorSlot>
    );
};