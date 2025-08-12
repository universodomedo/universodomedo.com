'use client';

import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import { useAppSelector } from "Redux/hooks/useRedux";

export function ConteudoLayout({ children }: { children: React.ReactNode }) {
    const usaLayoutContextualizado = useAppSelector((state) => !!state.menu.chaveMenu);

    if (!usaLayoutContextualizado) return children;

    return (
        <LayoutContextualizado>
            {children}
        </LayoutContextualizado>
    );
};