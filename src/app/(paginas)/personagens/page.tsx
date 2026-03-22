import { QUERY_PARAMS } from 'Constantes/parametros_query';
import PaginaPersonagens_Conteiner from './componentes';

export default async function PaginaPersonagens({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const personagemParam = resolvedSearchParams?.[QUERY_PARAMS.PERSONAGEM];
    const idPersonagem = personagemParam ? Number(personagemParam) : null;

    return <PaginaPersonagens_Conteiner idPersonagem={idPersonagem} />;
};