import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaPersonagensProvider } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { PaginaPersonagens_Contexto } from './componentes';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

export default async function PaginaPersonagens({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }; }) {
    const resolvedSearchParams = await searchParams;
    const personagemParam = resolvedSearchParams?.[QUERY_PARAMS.PERSONAGEM];
    const idPersonagem = personagemParam ? Number(personagemParam) : null;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.AVENTURA, comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaPersonagensProvider idPersonagemInicial={idPersonagem}>
                <PaginaPersonagens_Contexto />
            </ContextoPaginaPersonagensProvider>
        </ControladorSlot>
    );
};