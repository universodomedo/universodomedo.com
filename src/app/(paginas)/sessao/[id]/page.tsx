import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaSessaoProvider } from 'Contextos/ContextoPaginaSessao/contexto';
import { PaginaSessao_Slot } from '../componentes';

export default async function PaginaSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ControladorSlot pagina={PAGINAS.sessao}>
            <ContextoPaginaSessaoProvider idSessao={Number(id)} >
                <PaginaSessao_Slot />
            </ContextoPaginaSessaoProvider>
        </ControladorSlot>
    );
};