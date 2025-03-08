'use client';

import { ReactNode, useEffect } from "react";

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

export default function LayoutComCabecalho({ children }: { children: ReactNode }) {
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();
    
    useEffect(() => {
        setTamanhoReduzido(true);
    }, []);

    return (
        <>
            {children}
        </>
    )
};