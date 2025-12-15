'use client';

import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import { useContextoPaginaSessao } from 'Contextos/ContextoPaginaSessao/contexto';
import { VisualizacaoSessao } from "Componentes/ElementosPaginaSessao/VisualizacaoSessao/page";

export function PaginaSessao_Slot() {
    const { sessaoSelecionada } = useContextoPaginaSessao();

    return (
        <LayoutContextualizado proporcaoConteudo={100}>
            <LayoutContextualizado.Conteudo props={{ tipo: 'href', hrefPaginaRetorno: '/sessoes', tituloTooltip: 'Voltar' }}>
                <VisualizacaoSessao sessaoSelecionada={sessaoSelecionada} />
            </LayoutContextualizado.Conteudo>
        </LayoutContextualizado>
    );
};