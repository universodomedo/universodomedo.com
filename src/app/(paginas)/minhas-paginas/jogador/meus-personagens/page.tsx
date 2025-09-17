'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesJogador from 'Componentes/ElementosDeMenu/ListaAcoesJogador/page';

import { ContextoJogadorPersonagensProvider } from 'Contextos/ContextoJogadorPersonagens/contexto.tsx';
import { PaginaMeusPersonagens_Contexto } from './componentes/subcomponentes';

export default function PaginaMeusPersonagens() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo titulo={'Jogador - Meus Personagens'}>
                <ContextoJogadorPersonagensProvider>
                    <PaginaMeusPersonagens_Contexto />
                </ContextoJogadorPersonagensProvider>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesJogador />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};