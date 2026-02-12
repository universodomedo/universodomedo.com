'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoListagemPersonagensProvider, useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import UnificaPersonagemEFichaParaUsuario from "Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario";

export function PaginaMeusPersonagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.meusPersonagens}>
            <ContextoListagemPersonagensProvider idTipoPersonagem={1}>
                <PaginaMeusPersonagens_Contexto />
            </ContextoListagemPersonagensProvider>
        </ControladorSlot>
    );
};

function PaginaMeusPersonagens_Contexto() {
    const { personagens } = useContextoListagemPersonagens();
    
    return (
        <>
            <AvisosDePersonagensEFichas naoRenderizaAvisoFichaTemporaria />
            <UnificaPersonagemEFichaParaUsuario personagens={personagens} />
        </>
    );
};