'use client';

import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import { PaginaAventura_Conteudo, PaginaAventura_Menu } from "./subcomponentes";

export function PaginaAventura_Slot() {
    return (
        <LayoutContextualizado proporcaoConteudo={87}>
            <LayoutContextualizado.Conteudo escondeFundo props={{ tipo: 'href', hrefPaginaRetorno: '/aventuras', tituloTooltip: 'Voltar' }}>
                <PaginaAventura_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <PaginaAventura_Menu />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};