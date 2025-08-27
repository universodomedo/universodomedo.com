import { ReactNode } from "react";

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { LayoutMestre_Slot } from "./componentes";

export default function LayoutMestre({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MESTRE, comCabecalho: false, usuarioObrigatorio: true }}>
            <LayoutMestre_Slot>
                {children}
            </LayoutMestre_Slot>
        </ControladorSlot>
    );
};