'use client';

import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function LayoutArtista({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista}>
            {children}
        </ControladorSlot>
    );
};