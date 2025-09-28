import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto';
import { PaginaAventura_Slot } from '../componentes';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

export default async function PaginaAventura({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: { [key: string]: string | string[] | undefined }; }) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const episodioParam = resolvedSearchParams?.[QUERY_PARAMS.EPISODIO];
    const indexEpisodio = episodioParam ? Number(episodioParam) : null;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURA, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventuraProvider idGrupoAventura={Number(id)} episodioIndexInicial={indexEpisodio}>
                <PaginaAventura_Slot />
            </ContextoPaginaAventuraProvider>
        </ControladorSlot>
    );
};