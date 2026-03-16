import { QUERY_PARAMS } from 'Constantes/parametros_query';
import PaginaFichas_Conteiner from './componentes';

export default async function PaginaFichas({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const fichaParam = resolvedSearchParams?.[QUERY_PARAMS.FICHA];
    const idFichaTemporaria = fichaParam ? Number(fichaParam) : null;

    return <PaginaFichas_Conteiner idFichaTemporaria={idFichaTemporaria} />;
};