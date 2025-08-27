'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { RascunhoSessaoUnicaMestre_Conteudo } from './subcomponentes';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';

export function RascunhoSessoesUnicasMestre_Contexto() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo titulo={'Mestre - Meus Rascunhos de Sessão Única'}>
                <RascunhoSessaoUnicaMestre_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesMestre />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};