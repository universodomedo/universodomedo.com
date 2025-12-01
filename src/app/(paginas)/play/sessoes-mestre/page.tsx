'use client';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPlay from 'Componentes/ElementosDeMenu/ListaAcoesPlay/page';

import { PaginaSessoesMestre } from './componentes';

export default function PaginaPlay_SessoesMestre() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.PLAY, comCabecalho: false, usuarioObrigatorio: false }}>
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