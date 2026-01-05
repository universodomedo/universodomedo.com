'use client';

import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { ContextoListagemPersonagensProvider } from 'Contextos/ContextoListagemPersonagens/contexto';
import { PaginaListagemPersonagens_Contexto } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagensEmListagem/page.tsx'

export default function PaginaPersonagensMestre() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo titulo={'Mestre - Meus Personagens'}>
                <ContextoListagemPersonagensProvider idTipoPersonagem={2}>
                    <PaginaListagemPersonagens_Contexto />
                </ContextoListagemPersonagensProvider>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};