'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoListagemPersonagensProvider, useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto';
import UnificaPersonagemEFichaParaUsuario from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario';

export function PaginaPersonagensMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.personagens}>
            <ContextoListagemPersonagensProvider idTipoPersonagem={2}>
                <PaginaPersonagensMestre_Contexto />
            </ContextoListagemPersonagensProvider>
        </ControladorSlot>
    );
};

function PaginaPersonagensMestre_Contexto() {
    const { personagens } = useContextoListagemPersonagens();

    return <UnificaPersonagemEFichaParaUsuario personagens={personagens} />;
};