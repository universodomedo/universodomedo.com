'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoListagemPersonagensProvider } from 'Contextos/ContextoListagemPersonagens/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import { PaginaListagemPersonagens_Contexto } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagensEmListagem/page.tsx'

export function PaginaMeusPersonagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.meusPersonagens}>
            <ContextoListagemPersonagensProvider idTipoPersonagem={1}>
                <PaginaMeusPersonagens_Context />
            </ContextoListagemPersonagensProvider>
        </ControladorSlot>
    );
};

export function PaginaMeusPersonagens_Context() {
    return (
        <>
            <AvisosDePersonagensEFichas />
            <PaginaListagemPersonagens_Contexto />
        </>
    );
};