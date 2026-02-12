import { QUERY_PARAMS } from 'Constantes/parametros_query';
import { PaginaFichas_Client } from './componentes';

export default async function PaginaFichas({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const fichaParam = resolvedSearchParams?.[QUERY_PARAMS.FICHA];
    const idFicha = fichaParam ? Number(fichaParam) : null;

    return <PaginaFichas_Client idFicha={idFicha} />;
};