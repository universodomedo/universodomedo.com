import { QUERY_PARAMS } from 'Constantes/parametros_query';
import PaginaAssistir_Conteiner from './componentes';

export default async function PaginaAssistir({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const aventuraParam = resolvedSearchParams?.[QUERY_PARAMS.AVENTURA];
    const idAventura = typeof aventuraParam === 'string' ? Number(aventuraParam) : null;

    return <PaginaAssistir_Conteiner idAventura={Number.isNaN(idAventura) ? null : idAventura} />;
};