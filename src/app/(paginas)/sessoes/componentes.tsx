'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginasListagemSessoesProvider } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { VisualizacaoSessoes } from 'Componentes/ElementosPaginaSessao/VisualizacaoSessoes/VisualizacaoSessoes';

export function PaginaSessoes_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.sessoes}>
            <ContextoPaginasListagemSessoesProvider>
                <VisualizacaoSessoes />
            </ContextoPaginasListagemSessoesProvider>
        </ControladorSlot>
    );
};