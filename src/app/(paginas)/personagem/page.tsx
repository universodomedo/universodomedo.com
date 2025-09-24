import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto';
// import { PaginaAventura_Slot } from '../componentes';

export default async function PaginaAventura({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: { [key: string]: string | string[] | undefined }; }) {
    const { id } = await params;
    const paramKey = Object.keys(searchParams || {})[0];
    const indexEpisodio = paramKey ? Number(paramKey) : null;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURA, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventuraProvider idGrupoAventura={Number(id)} episodioIndexInicial={indexEpisodio}>
                {/* <PaginaAventura_Slot /> */}
                <></>
            </ContextoPaginaAventuraProvider>
        </ControladorSlot>
    );
};