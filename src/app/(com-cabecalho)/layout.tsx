'use client';

import { ReactNode, useEffect } from "react";

import Cabecalho from 'Componentes/ElementosVisuais/PaginaAterrissagem/Cabecalho/Cabecalho';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

export default function LayoutComCabecalho({ children }: { children: ReactNode }) {
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    
    useEffect(() => {
        setTamanhoReduzido(false);
    }, []);

    return (
        <>
            <Cabecalho />
            {children}
        </>
    )
};