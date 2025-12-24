import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaPersonagensProvider } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { PaginaPersonagens_Contexto } from './componentes';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

export default async function PaginaPersonagens({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const resolvedSearchParams = await searchParams;
    const personagemParam = resolvedSearchParams?.[QUERY_PARAMS.PERSONAGEM];
    const idPersonagem = personagemParam ? Number(personagemParam) : null;

    return (
        <ControladorSlot pagina={PAGINAS.personagens}>
            <ContextoPaginaPersonagensProvider idPersonagemInicial={idPersonagem}>
                <PaginaPersonagens_Contexto />
            </ContextoPaginaPersonagensProvider>
        </ControladorSlot>
    );
};