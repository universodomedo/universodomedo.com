'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoSessaoEmAndamentoProvider, useContextoSessaoEmAndamento } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import { ContextoPersonagensEmSessaoProvider } from "Contextos/ContextosPaginaAovivo/ContextoPersonagensEmSessao/contexto";
import PaginaSessao_SessaoEmAndamento from "./sessao-em-andamento/page";
import { ContextoSessoesPrevistasProvider } from "Contextos/ContextoSessoesPrevistas/contexto";
import PaginaSessao_SessaoEmEspera from "./sessao-em-espera/page";

export function PaginaSessao_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.sessaoAovivo}>
            <ContextoSessaoEmAndamentoProvider>
                <PaginaSessao_Contexto />
            </ContextoSessaoEmAndamentoProvider>
        </ControladorSlot>
    );
};

export function PaginaSessao_Contexto() {
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();

    return sessaoEmAndamento ? <ContextoPersonagensEmSessaoProvider><PaginaSessao_SessaoEmAndamento /></ContextoPersonagensEmSessaoProvider> : <ContextoSessoesPrevistasProvider><PaginaSessao_SessaoEmEspera /></ContextoSessoesPrevistasProvider>;
};