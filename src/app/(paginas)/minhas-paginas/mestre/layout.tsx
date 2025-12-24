import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { LayoutMestre_Slot } from "./componentes";

export default function LayoutMestre({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre}>
            <LayoutMestre_Slot>
                {children}
            </LayoutMestre_Slot>
        </ControladorSlot>
    );
};