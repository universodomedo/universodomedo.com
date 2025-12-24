import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto';
import { PaginaAventura_Slot } from '../componentes';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

export default async function PaginaAventura({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const episodioParam = resolvedSearchParams?.[QUERY_PARAMS.EPISODIO];
    const indexEpisodio = episodioParam ? Number(episodioParam) : null;

    return (
        <ControladorSlot pagina={PAGINAS.aventura}>
            <ContextoPaginaAventuraProvider idGrupoAventura={Number(id)} episodioIndexInicial={indexEpisodio}>
                <PaginaAventura_Slot />
            </ContextoPaginaAventuraProvider>
        </ControladorSlot>
    );
};