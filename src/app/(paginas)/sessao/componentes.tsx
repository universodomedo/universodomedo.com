'use client';

import { useContextoPaginaSessao } from 'Contextos/ContextoPaginaSessao/contexto';
import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import { VisualizacaoSessao } from "Componentes/ElementosPaginaSessao/VisualizacaoSessao/page";

export function PaginaSessao_Slot() {
    const { sessaoSelecionada } = useContextoPaginaSessao();

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <VisualizacaoSessao sessaoSelecionada={sessaoSelecionada} />
            </LayoutContextualizado.Conteudo>
        </LayoutContextualizado>
    );
};