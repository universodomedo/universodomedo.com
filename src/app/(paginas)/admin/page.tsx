'use client';

import { LayoutVisualizacaoPadrao_ConteudoMenu } from "Contextos/ContextoLayoutVisualizacaoPadrao/hooks";
import { ListaAcoesAdmin } from "./componentes";

export default function PaginaAdmin() {
    return (
        <LayoutVisualizacaoPadrao_ConteudoMenu>
            <ListaAcoesAdmin />
        </LayoutVisualizacaoPadrao_ConteudoMenu>
    );
};