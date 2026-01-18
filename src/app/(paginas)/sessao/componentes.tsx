'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaSessaoProvider } from 'Contextos/ContextoPaginaSessao/contexto';
import { VisualizacaoSessao } from "Componentes/ElementosPaginaSessao/VisualizacaoSessao/page";

export function PaginaSessao_Client({ idSessao }: { idSessao: number; }) {
    return (
        <ControladorSlot pagina={PAGINAS.sessao}>
            <ContextoPaginaSessaoProvider idSessao={idSessao}>
                <VisualizacaoSessao />
            </ContextoPaginaSessaoProvider>
        </ControladorSlot>
    );
};