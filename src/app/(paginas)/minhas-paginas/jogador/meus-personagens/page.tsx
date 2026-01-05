'use client';

import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { ContextoListagemPersonagensProvider } from 'Contextos/ContextoListagemPersonagens/contexto';
import { PaginaListagemPersonagens_Contexto } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagensEmListagem/page.tsx'

export default function PaginaMeusPersonagens() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo titulo={'Jogador - Meus Personagens'}>
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