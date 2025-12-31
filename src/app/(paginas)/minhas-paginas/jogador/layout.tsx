'use client';

import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export default function LayoutJogador({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador}>
            {children}
        </ControladorSlot>
    );
};