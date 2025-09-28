'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesJogador from 'Componentes/ElementosDeMenu/ListaAcoesJogador/page';

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
                <ListaAcoesJogador />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};