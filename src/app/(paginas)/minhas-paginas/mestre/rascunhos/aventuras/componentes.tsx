'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { RascunhoAventuraMestre_Conteudo } from './subcomponentes';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';

export function RascunhoAventuraMestre_Contexto() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo titulo={'Mestre - Meus Rascunhos de Aventura'}>
                <RascunhoAventuraMestre_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesMestre />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};