'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginasListagemSessoesProvider } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { VisualizacaoSessoes } from 'Componentes/ElementosPaginaSessao/VisualizacaoSessoes/VisualizacaoSessoes';

export function PaginaSessao_Client({ idSessao }: { idSessao: number; }) {
    return (
        <ControladorSlot pagina={PAGINAS.sessao}>
            <ContextoPaginasListagemSessoesProvider idSessaoInicial={idSessao}>
                <VisualizacaoSessoes />
            </ContextoPaginasListagemSessoesProvider>
        </ControladorSlot>
    );
};