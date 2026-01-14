'use client';

import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export default function PaginaMestre() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <PaginaPlay_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaPlay_Conteudo() {
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84 });

    return <></>;
};