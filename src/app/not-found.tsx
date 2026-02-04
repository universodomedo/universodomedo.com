'use client';

import { useLayoutEffect } from "react";
import { PAGINAS } from "types-nora-api";

import { useContextoMenuSwiperEsquerda } from "Contextos/ContextoMenuSwiperEsquerda/contexto";
import LinkInterno from "Componentes/Elementos/LinkInterno/LinkInterno";

export default function NotFound() {
    const { funcEsconderMenu } = useContextoMenuSwiperEsquerda();

    useLayoutEffect(() => { funcEsconderMenu(); }, [funcEsconderMenu]);

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Página Não Encontrada</h1>
            <p>A página que você está tentando acessar não existe.</p>
            <LinkInterno destino={PAGINAS.home}>Voltar</LinkInterno>
        </div>
    );
};