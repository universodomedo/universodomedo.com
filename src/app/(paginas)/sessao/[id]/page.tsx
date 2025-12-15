import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaSessaoProvider } from 'Contextos/ContextoPaginaSessao/contexto';
import { PaginaSessao_Slot } from '../componentes';

export default async function PaginaSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaSessaoProvider idSessao={Number(id)} >
                <PaginaSessao_Slot />
            </ContextoPaginaSessaoProvider>
        </ControladorSlot>
    );
};