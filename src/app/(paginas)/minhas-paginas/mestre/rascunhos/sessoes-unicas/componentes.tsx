'use client';

import { useContextoMestreRascunhosSessoesUnicas } from 'Contextos/ContextoMestreRascunhosSessoesUnicas/contexto';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { RascunhoSessaoUnicaMestre_Conteudo } from './subcomponentes';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';
import DetalhesRascunho from '../DetalhesRascunho';

export function RascunhoSessoesUnicasMestre_Contexto() {
    return (
        <LayoutContextualizado>
            <ConteudoCondicional />

            <LayoutContextualizado.Menu>
                <ListaAcoesMestre />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function ConteudoCondicional() {
    const { idRascunhoSelecionado } = useContextoMestreRascunhosSessoesUnicas();

    return idRascunhoSelecionado < 1 ? (
        <LayoutContextualizado.Conteudo titulo={'Mestre - Meus Rascunhos de Sessão Única'}>
            <RascunhoSessaoUnicaMestre_Conteudo />
        </LayoutContextualizado.Conteudo>
    ) : (
        <LayoutContextualizado.Conteudo>
            <DetalhesRascunho idRascunhoSelecionado={idRascunhoSelecionado} />
        </LayoutContextualizado.Conteudo>
    );
};