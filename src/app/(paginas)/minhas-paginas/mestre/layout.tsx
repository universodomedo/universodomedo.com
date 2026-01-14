'use client';

import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function LayoutMestre({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre}>
            {children}
        </ControladorSlot>
    );
};