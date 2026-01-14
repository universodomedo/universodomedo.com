'use client';

import { ReactNode } from 'react';
import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ContextoListagemPersonagensProvider } from 'Contextos/ContextoListagemPersonagens/contexto';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { PaginaListagemPersonagens_Contexto } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagensEmListagem/page.tsx'
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export default function PaginaMeusPersonagens() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <ContextoListagemPersonagensProvider idTipoPersonagem={1}>
                    <PaginaListagemPersonagens_Contexto />
                </ContextoListagemPersonagensProvider>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.jogador} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaMeusPersonagens_EmbrulhoProvisorio({ children }: { children: ReactNode }) {
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84, titulo: 'Jogador - Meus Personagens' });

    return (
        <>
            {children}
        </>
    );
};