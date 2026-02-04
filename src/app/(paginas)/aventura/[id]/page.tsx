import { QUERY_PARAMS } from 'Constantes/parametros_query';
import { PaginaAventura_Client } from '../componentes';

export default async function PaginaAventura({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const episodioParam = resolvedSearchParams?.[QUERY_PARAMS.EPISODIO];
    const indexEpisodio = episodioParam ? Number(episodioParam) : null;

    return <PaginaAventura_Client idGrupoAventura={Number(id)} indexEpisodio={indexEpisodio} />;
};