'use client';

import { LayoutVisualizacaoPadrao_ConteudoGeral, LayoutVisualizacaoPadrao_ConteudoMenu } from "Contextos/ContextoLayoutVisualizacaoPadrao/hooks";
import { ListaAcoesAdmin } from "./componentes";

export default function PaginaAdmin() {
    return (
        <>
            <LayoutVisualizacaoPadrao_ConteudoGeral proporcaoFlex={0.85}>
                <></>
            </LayoutVisualizacaoPadrao_ConteudoGeral>
            <LayoutVisualizacaoPadrao_ConteudoMenu>
                <ListaAcoesAdmin />
            </LayoutVisualizacaoPadrao_ConteudoMenu>
        </>
    );
};