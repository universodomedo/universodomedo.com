'use client';

import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

export default function PaginaJogador() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo>
                <></>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.jogador} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};