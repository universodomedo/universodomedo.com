'use client';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPersonagens from "Componentes/ElementosDeMenu/ListaAcoesPersonagens/page";
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import PaginaPersonagem from 'Componentes/PaginaPersonagem/PaginaPersonagem';
import { ReactNode } from 'react';

export function PaginaPersonagens_Contexto() {
    const { personagemSelecionado, deselecionaPersonagem } = useContextoPaginaPersonagens();

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
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

function PaginaPersonagens_Contexto_EmbrulhoProvisorio({ children }: { children: ReactNode }) {
    const { personagemSelecionado, deselecionaPersonagem } = useContextoPaginaPersonagens();
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84, fecharProps: personagemSelecionado ? { tipo: 'acao', executar: () => deselecionaPersonagem(), tituloTooltip: 'Voltar', style: { top: '2.6%', left: '1.1%' } } : undefined });
    
    return (
        <>
            {children}
        </>
    );
};

function PaginaInicialPersonagens() {
    return (
        <h1>Página Inicial</h1>
    );
};