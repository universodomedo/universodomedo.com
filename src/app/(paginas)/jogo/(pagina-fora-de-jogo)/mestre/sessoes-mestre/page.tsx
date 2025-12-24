'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPlay from 'Componentes/ElementosDeMenu/ListaAcoesPlay/page';
import { PaginaSessoesMestre } from './componentes';

export default function PaginaPlay_SessoesMestre() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo}>
            <LayoutContextualizado proporcaoConteudo={84}>
                <LayoutContextualizado.Conteudo>
                    <PaginaSessoesMestre />
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <ListaAcoesPlay />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};