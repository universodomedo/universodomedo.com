'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesJogador from 'Componentes/ElementosDeMenu/ListaAcoesJogador/page';

export default function PaginaJogador() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo>
                <></>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesJogador />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};