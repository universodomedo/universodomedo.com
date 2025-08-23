'use client';

import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import { PaginaAventura_Conteudo, PaginaAventura_Menu } from "./subcomponentes";

export function PaginaAventura_Slot() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo escondeFundo hrefPaginaRetorno={'/aventuras'}>
                <PaginaAventura_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <PaginaAventura_Menu />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};