import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaMestreAventuraProvider } from 'Contextos/ContextoMestreAventura/contexto';
import { PaginaMestreAventura_Contexto } from '../componentes';

export default async function PaginaMestreAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.aventura}>
            <ContextoPaginaMestreAventuraProvider idGrupoAventura={Number(id)}>
                <PaginaMestreAventura_Contexto />
            </ContextoPaginaMestreAventuraProvider>
        </ControladorSlot>
    );
};