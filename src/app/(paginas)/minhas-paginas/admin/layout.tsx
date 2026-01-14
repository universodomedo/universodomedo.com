'use client';

import { ReactNode } from "react";
import { PAGINAS, MENUS_INTERNOS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin}>
            <LayoutContextualizado>
                <LayoutContextualizado.Conteudo>
                    <LayoutAdmin_EmbrulhoProvisorio>
                        {children}
                    </LayoutAdmin_EmbrulhoProvisorio>
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.admin} />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};

function LayoutAdmin_EmbrulhoProvisorio({ children }: { children: ReactNode }) {
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84 });

    return (
        <>
            {children}
        </>
    );
};