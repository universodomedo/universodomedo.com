'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPersonagens from "Componentes/ElementosDeMenu/ListaAcoesPersonagens/page";
import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import PaginaPersonagem from 'Componentes/PaginaPersonagem/PaginaPersonagem';

export function PaginaPersonagens_Contexto() {
    const { personagemSelecionado, deselecionaPersonagem } = useContextoPaginaPersonagens();

    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo props={ personagemSelecionado ? { tipo: 'acao', executar: () => deselecionaPersonagem(), tituloTooltip: 'Voltar', style:{top: '2.6%', left: '1.1%'} } : undefined}>
                {personagemSelecionado
                    ? <PaginaPersonagem />
                    : <PaginaInicialPersonagens />
                }
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesPersonagens />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaInicialPersonagens() {
    return (
        <h1>Página Inicial</h1>
    );
};