'use client';

import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from "./JogoRouteGuard";

export default function LayoutJogo({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.jogo}>
            <JogoRouteGuard>
                {children}
            </JogoRouteGuard>
        </ControladorSlot>
    );
};