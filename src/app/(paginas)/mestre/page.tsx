'use client';

import { useMemo } from "react";

// import { useAtualizaConteudoMenu } from "Contextos/ContextoLayoutVisualizacaoPadrao/hooks";
import { ListaAcoesMestre } from "./componentes";
import LayoutContextualizado from "Contextos/ContextoLayoutVisualizacaoPadrao/page";

export default function PaginaMestre() {
    // useAtualizaConteudoMenu(useMemo(() => <ListaAcoesMestre />, []));

    return <LayoutContextualizado />;
};