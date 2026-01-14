'use client';

import { MENUS_INTERNOS, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export default function PaginaPlay() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo}>
            <LayoutContextualizado>
                <LayoutContextualizado.Conteudo>
                    <PaginaPlay_Conteudo />
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <MenuInterno itens={MENUS_INTERNOS.PAGINAS.jogo} />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};

function PaginaPlay_Conteudo() {
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84 });

    return <></>;
};