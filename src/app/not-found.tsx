'use client';

import { useLayoutEffect } from "react";
import Link from "next/link";

import { useContextoMenuSwiperEsquerda } from "Contextos/ContextoMenuSwiperEsquerda/contexto";

export default function NotFound() {
    const { funcEsconderMenu } = useContextoMenuSwiperEsquerda();

    useLayoutEffect(() => { funcEsconderMenu(); }, [funcEsconderMenu]);
    
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Página Não Encontrada</h1>
            <p>A página que você está tentando acessar não existe.</p>
            <Link href={'/'}>Voltar</Link>
        </div>
    );
};