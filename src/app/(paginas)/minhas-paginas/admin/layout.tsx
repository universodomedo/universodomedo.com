'use client';

import { ReactNode } from "react";
import { PAGINAS, MENUS_INTERNOS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin}>
            <LayoutContextualizado proporcaoConteudo={84}>
                <LayoutContextualizado.Conteudo>
                    {children}
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.admin} />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};