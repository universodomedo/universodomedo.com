import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto';
import { PaginaAventura_Slot } from './componentes';

export default async function PaginaAventura ({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURA, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventuraProvider idGrupoAventura={Number(id)}>
                <PaginaAventura_Slot/>
            </ContextoPaginaAventuraProvider>
        </ControladorSlot>
    );
};