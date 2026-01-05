'use client';

import { MENUS_INTERNOS, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

export default function PaginaPlay() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo}>
            <LayoutContextualizado proporcaoConteudo={84}>
                <LayoutContextualizado.Conteudo>
                    <></>
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <MenuInterno itens={MENUS_INTERNOS.PAGINAS.jogo} />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};