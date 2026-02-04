'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoListagemPersonagensProvider } from 'Contextos/ContextoListagemPersonagens/contexto';
import { PaginaListagemPersonagens_Contexto } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagensEmListagem/page.tsx';

export function PaginaPersonagensMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.personagens}>
            <ContextoListagemPersonagensProvider idTipoPersonagem={2}>
                <PaginaListagemPersonagens_Contexto />
            </ContextoListagemPersonagensProvider>
        </ControladorSlot>
    );
};