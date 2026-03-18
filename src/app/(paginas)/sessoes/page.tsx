import { QUERY_PARAMS } from 'Constantes/parametros_query';
import PaginaSessoes_Conteiner from './componentes';

export default async function PaginaSessoes({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const sessaoParam = resolvedSearchParams?.[QUERY_PARAMS.SESSAO];
    const idSessao = sessaoParam ? Number(sessaoParam) : null;

    return <PaginaSessoes_Conteiner idSessao={idSessao} />;
};